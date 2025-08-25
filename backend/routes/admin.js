import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'adminsecret';

// Insert default school admin and departments on server start (or you can call this manually)
async function insertDefaults() {
  const client = await pool.connect();
  try {
    // Insert default school admin if it doesn't exist
    const bcryptjs = await import('bcryptjs');
    const hashedPassword = await bcryptjs.hash('admin123', 10);

    await client.query(`
      INSERT INTO admins (username, password, role, firstname, lastname, email)
      VALUES ('schooladmin', $1, 'school_admin', 'School', 'Administrator', 'admin@school.edu')
      ON CONFLICT (username) DO NOTHING
    `, [hashedPassword]);

    // Insert default departments if they don't exist
    await client.query(`
      INSERT INTO departments (name, code, semester) VALUES
        ('Computer Science', 'CS', 8),
        ('Mathematics', 'MATH', 6),
        ('Physics', 'PHYS', 6),
        ('Chemistry', 'CHEM', 6)
      ON CONFLICT (code) DO NOTHING
    `);

    console.log('Default admin and departments inserted (if not present)');
  } catch (error) {
    console.error('Error inserting default data:', error);
  } finally {
    client.release();
  }
}
// Call this once on server start or call manually elsewhere
insertDefaults();


// ✅ Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin.id, role: 'admin', school_id: admin.school_id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, message: 'Login successful' });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Get all students for the admin’s school
router.get('/students', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { school_id } = req.user;

  try {
    const result = await pool.query(
      `SELECT id, username, email, status, created_at
       FROM student_accounts
       WHERE school_id = $1
       ORDER BY created_at DESC`,
      [school_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Get full student info by ID
router.get('/students/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  const studentId = req.params.id;
  const { school_id } = req.user;

  try {
    const accountCheck = await pool.query(
      `SELECT * FROM student_accounts WHERE id = $1 AND school_id = $2`,
      [studentId, school_id]
    );

    if (accountCheck.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const infoResult = await pool.query(
      `SELECT * FROM student_info WHERE student_id = $1`,
      [studentId]
    );

    res.json({
      account: accountCheck.rows[0],
      info: infoResult.rows[0] || null
    });

  } catch (error) {
    console.error('Error fetching student info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Approve or Reject student
router.put('/students/:id/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  const studentId = req.params.id;
  const { status } = req.body;
  const { school_id } = req.user;

  if (!['active', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const check = await pool.query(
      'SELECT * FROM student_accounts WHERE id = $1 AND school_id = $2',
      [studentId, school_id]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let username = check.rows[0].username;
    let hashedPassword = null;

    if (status === 'active' && !username) {
      username = `student${studentId}`;
      const rawPassword = `pass${Math.floor(1000 + Math.random() * 9000)}`;
      hashedPassword = await bcrypt.hash(rawPassword, 10);

      await pool.query(
        `UPDATE student_accounts
         SET status = $1, username = $2, password = $3
         WHERE id = $4`,
        [status, username, hashedPassword, studentId]
      );

      return res.json({ message: 'Student approved', username, password: rawPassword });
    }

    await pool.query(
      `UPDATE student_accounts SET status = $1 WHERE id = $2`,
      [status, studentId]
    );

    res.json({ message: `Student ${status}` });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
