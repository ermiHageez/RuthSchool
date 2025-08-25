import React from 'react';
import ProfileManagement from '../component/ProfileManagement';

const StudentDashboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
      <p>Welcome, Student! Here you can view your profile and registered courses.</p>
      <ProfileManagement/>
    </div>
  );
};

export default StudentDashboard;