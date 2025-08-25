import React from 'react';
import UserManagement from '../component/UserManagement';

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p>Welcome, Admin! Here you can manage users and registrations.</p>
      <UserManagement/>
    </div>
  );
};

export default AdminDashboard;