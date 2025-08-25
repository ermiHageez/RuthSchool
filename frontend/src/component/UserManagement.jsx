import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from your backend
    const fetchUsers = async () => {
      const response = await fetch('/api/users'); // Replace with actual API
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    // Delete user from your backend
    await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <ul className="list-disc list-inside">
        {users.map(user => (
          <li key={user.id} className="flex justify-between items-center">
            {user.username} - {user.role}
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="bg-red-500 text-white p-1 rounded ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;