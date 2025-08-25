import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { authenticateToken, requireStudentStatus } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

// Apply to school
router.post('/apply', async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      school_code,
      full_name,
      father_name,
      grandfather_name,
      place_of_birth,
      dob,
      gender,
      nationality,
      phone_number,
      email,
      permanent_address,
      emergency_contact_name,
      emergency_contact_number,
      previous_school,
      year_completed
    } = req.body;

    const schoolRes = await client.query(
      'SELECT id FROM schools WHERE code = $1',
      [school_code]
    );

    if (schoolRes.rowCount === 0) {
      return res.status(404).json({ message: 'Invalid school code.' });
    }

    const school_id = schoolRes.rows[0].id;

    const studentAccountRes = await client.query(
      `INSERT INTO student_accounts (email, school_id, status)
       VALUES ($1, $2, 'pending') RETURNING id`,
      [email, school_id]
    );

    const student_id = studentAccountRes.rows[0].id;

    await client.query(
      `INSERT INTO student_info (
        student_id, full_name, father_name, grandfather_name, place_of_birth,
        dob, gender, nationality, phone_number, email, permanent_address,
        emergency_contact_name, emergency_contact_number,
        previous_school, year_completed
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )`,
      [
        student_id, full_name, father_name, grandfather_name, place_of_birth,
        dob, gender, nationality, phone_number, email, permanent_address,
        emergency_contact_name, emergency_contact_number,
        previous_school, year_completed
      ]
    );

    res.status(201).json({ message: 'Application submitted successfully.' });

  } catch (error) {
    console.error('Application Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM student_accounts WHERE username = $1`,
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.id, role: 'student' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, message: "Login successful" });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Check status
router.get('/status', authenticateToken, requireStudentStatus(['pending', 'active', 'rejected']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT status FROM student_accounts WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ status: result.rows[0].status });
  } catch (error) {
    console.error("Status error:", error);
    res.status(500).json({ message: 'Error retrieving status' });
  }
});

// 🔷 Student Dashboard
router.get('/dashboard', authenticateToken, requireStudentStatus(['active']), async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch student account info
    const accountRes = await pool.query(
      `SELECT id, username, email, status, created_at FROM student_accounts WHERE id = $1`,
      [studentId]
    );
    if (accountRes.rowCount === 0) {
      return res.status(404).json({ message: 'Student account not found' });
    }

    // Fetch student personal info
    const infoRes = await pool.query(
      `SELECT full_name, father_name, grandfather_name, dob, gender, nationality, phone_number, email, permanent_address FROM student_info WHERE student_id = $1`,
      [studentId]
    );

    // Fetch latest semester info with grades and status
    const semesterRes = await pool.query(
      `SELECT semester, year, status, grades, created_at 
       FROM student_semesters 
       WHERE student_id = $1 
       ORDER BY year DESC, semester DESC 
       LIMIT 1`,
      [studentId]
    );

    res.json({
      account: accountRes.rows[0],
      info: infoRes.rows[0] || null,
      latestSemester: semesterRes.rows[0] || null,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// 🔷 Semester Registration
router.post('/semester/register', authenticateToken, requireStudentStatus(['active']), async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get latest semester
    const latestSemesterRes = await pool.query(
      `SELECT semester, year, status FROM student_semesters 
       WHERE student_id = $1 
       ORDER BY year DESC, semester DESC 
       LIMIT 1`,
      [studentId]
    );

    let nextSemester = 1;
    let nextYear = new Date().getFullYear();

    if (latestSemesterRes.rowCount > 0) {
      const { semester, year, status } = latestSemesterRes.rows[0];
      
      // Only allow registration if latest semester status is 'passed'
      if (status !== 'passed') {
        return res.status(403).json({ message: 'Cannot register: previous semester not passed.' });
      }

      // Calculate next semester & year
      if (semester === 1) {
        nextSemester = 2;
        nextYear = year;
      } else {
        nextSemester = 1;
        nextYear = year + 1;
      }
    }

    // Check if next semester already registered
    const checkExistingRes = await pool.query(
      `SELECT * FROM student_semesters WHERE student_id = $1 AND semester = $2 AND year = $3`,
      [studentId, nextSemester, nextYear]
    );

    if (checkExistingRes.rowCount > 0) {
      return res.status(400).json({ message: 'Already registered for the next semester.' });
    }

    // Insert new semester record with status 'registered' and empty grades
    await pool.query(
      `INSERT INTO student_semesters (student_id, semester, year, status, grades)
       VALUES ($1, $2, $3, 'registered', '{}')`,
      [studentId, nextSemester, nextYear]
    );

    res.json({ message: `Registered for semester ${nextSemester}, year ${nextYear}` });

  } catch (error) {
    console.error('Semester registration error:', error);
    res.status(500).json({ message: 'Error during semester registration' });
  }
});

export default router;
