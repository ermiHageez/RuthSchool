import jwt from 'jsonwebtoken';
import { getDB } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireStudentStatus = (allowedStatuses) => {
  return async (req, res, next) => {
    try {
      if (req.user.role !== 'student') {
        return next();
      }

      const db = getDB();
      const result = await db.query(
        'SELECT status FROM student_accounts WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      if (!allowedStatuses.includes(result.rows[0].status)) {
        return res.status(403).json({ message: 'Account status does not allow this action' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Error checking student status' });
    }
  };
};
