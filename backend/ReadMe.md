Student Management Backend API

This backend API handles student applications, admin management, grades, and semester registrations.

Setup Instructions

Clone the repository:

git clone <https://github.com/ermiHageez/RuthSchool>
cd <backend>


Install dependencies:

npm install express bcrypt jsonwebtoken pg dotenv


Create a .env file with these variables:

PORT=5000
DATABASE_URL=postgresql://username:password@host:port/dbname
JWT_SECRET=your_jwt_secret_key


Start the server:

npm start

API Endpoints and Their Functionality


<!-- Student APIs -->

POST /student/apply
Submit a student application to a school.

POST /student/login
Student login to receive a JWT token.

GET /student/status
Get the current student's application status.

GET /student/dashboard
Retrieve student info, grades, and registration status.
(To be implemented)

POST /student/register-semester
Register the student for a semester.
(To be implemented)

<!-- Admin APIs -->

POST /admin/login
Admin login to receive a JWT token.

GET /admin/students
Get a list of all students in the admin's school.

GET /admin/students/:id
Retrieve full account and info details for a specific student.

PUT /admin/students/:id/status
Approve or reject a student's account.

PUT /admin/students/:id/grades
Add or update grades per student for each semester and subject.

PUT /admin/students/:id/eligibility
Mark whether the student is eligible for the next semester.


<!-- Authentication & Middleware -->

JWT is used for authentication.

authenticateToken middleware validates JWT tokens.

requireRole(['admin']) ensures only admins access protected routes.

requireStudentStatus checks student account statuses.

<!-- Dependencies -->

express — Web server framework

bcrypt — Password hashing

jsonwebtoken — JWT token creation and verification

pg — PostgreSQL database client

dotenv — Environment variable loader

Notes

Frontend is handled separately.

Database setup with these tables is required: admins, student_accounts, student_info, student_semesters, and schools.

Grades are stored as JSON in student_semesters.grades.