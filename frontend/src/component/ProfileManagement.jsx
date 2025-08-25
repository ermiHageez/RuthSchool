import React, { useState, useEffect } from 'react';

const ProfileManagement = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Fetch user profile data from your backend
    const fetchProfileData = async () => {
      const response = await fetch('/api/profile'); // Replace with actual API
      const data = await response.json();
      setProfileData(data);
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Save profile data to your backend
    await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    alert('Profile updated successfully!');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Management</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          name="fullName"
          value={profileData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          required
        />
        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          required
        />
        <input
          type="text"
          name="phone"
          value={profileData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border border-gray-300 rounded p-2 mb-4 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileManagement;