import React from 'react';
import ProfileManagement from '../component/ProfileManagement';

const ProfilePage = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p>Manage your profile information here.</p>
      <ProfileManagement/>
    </div>
  );
};

export default ProfilePage;