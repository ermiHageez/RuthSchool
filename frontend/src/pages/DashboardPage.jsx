import React from 'react';

const DashboardPage = () => {
  // Sample user data (replace this with actual data from your backend)
  const userData = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    registrationDate: "2025-08-21",
    courses: ["Accounting", "Marketing and Sales Management"],
    status: "Registered",
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h3 className="text-xl font-semibold">User Information</h3>
        <p><strong>Name:</strong> {userData.fullName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Registration Date:</strong> {userData.registrationDate}</p>
        <p><strong>Status:</strong> {userData.status}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Registered Courses</h3>
        <ul className="list-disc list-inside">
          {userData.courses.map((course, index) => (
            <li key={index}>{course}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;