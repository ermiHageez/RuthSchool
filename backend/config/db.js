import pkg from 'pg';
const { Pool } = pkg;

let pool;

export const connectDB = async () => {
  try {
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL database");
    await createTables(client);
    client.release();
    return pool;

  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    throw error;
  }
};

const createTables = async (client) => {
  try {
    // 1. Schools Table (Multi-Tenant Support)
    await client.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(10) UNIQUE NOT NULL,
        subscription VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Departments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
        name VARCHAR(255) UNIQUE NOT NULL,
        code VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Admins Table (school-level admin)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('school_admin', 'department_admin')),
        school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
        department_id INTEGER REFERENCES departments(id),
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Student Accounts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_accounts (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
        department_id INTEGER REFERENCES departments(id),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'suspended')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Student Info Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_info (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES student_accounts(id) ON DELETE CASCADE,
        full_name VARCHAR(100),
        father_name VARCHAR(100),
        grandfather_name VARCHAR(100),
        place_of_birth VARCHAR(100),
        dob DATE,
        gender VARCHAR(10),
        nationality VARCHAR(50),
        phone_number VARCHAR(15),
        email VARCHAR(100),
        permanent_address TEXT,
        emergency_contact_name VARCHAR(100),
        emergency_contact_number VARCHAR(15),
        previous_school VARCHAR(100),
        year_completed VARCHAR(10),
        subject1 VARCHAR(100),
        grade1 VARCHAR(10),
        subject2 VARCHAR(100),
        grade2 VARCHAR(10),
        subject3 VARCHAR(100),
        grade3 VARCHAR(10),
        total_grades VARCHAR(10),
        is_degree BOOLEAN,
        is_tvet BOOLEAN,
        program_option VARCHAR(100),
        level VARCHAR(50),
        course_option VARCHAR(100),
        payment_method VARCHAR(50),
        receipt_number VARCHAR(100),
        applicant_name VARCHAR(100),
        signature TEXT
      )
    `);

    // 6. Student Semesters Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_semesters (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES student_accounts(id) ON DELETE CASCADE,
        semester INTEGER NOT NULL,
        year INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'passed', 'failed')),
        grades JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, semester, year)
      )
    `);

    console.log("✅ Tables created or already exist.");
  } catch (error) {
    console.error("❌ Table creation error:", error);
    throw error;
  }
};
