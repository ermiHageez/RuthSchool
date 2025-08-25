import React from 'react';
import CourseManagement from '../component/CourseManagement';

const InstructorDashboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Instructor Dashboard</h2>
      <p>Welcome, Instructor! Here you can view your courses and manage grades.</p>
      <CourseManagement/>
    </div>
  );
};

export default InstructorDashboard;