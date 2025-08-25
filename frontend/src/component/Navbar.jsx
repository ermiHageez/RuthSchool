import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ userRole, onLogout }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">College Registration</h1>
        <div>
          <Link to="/" className="text-white mx-2">Home</Link>
          <Link to="/register" className="text-white mx-2">Register</Link>
          {userRole === 'Admin' && (
            <Link to="/admin" className="text-white mx-2">Admin Dashboard</Link>
          )}
          {userRole === 'Instructor' && (
            <Link to="/instructor" className="text-white mx-2">Instructor Dashboard</Link>
          )}
          {userRole === 'Student' && (
            <Link to="/student" className="text-white mx-2">Student Dashboard</Link>
          )}
          {userRole ? (
            <>
              <Link to="/profile" className="text-white mx-2">Profile</Link>
              <button onClick={onLogout} className="text-white mx-2">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-white mx-2">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;