import React from 'react';
import RegistrationForm from '../component/RegistrationForm';

const RegistrationPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;