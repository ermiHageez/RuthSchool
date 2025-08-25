import React, { useState, useEffect } from 'react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');

  useEffect(() => {
    // Fetch courses from your backend
    const fetchCourses = async () => {
      const response = await fetch('/api/courses'); // Replace with actual API
      const data = await response.json();
      setCourses(data);
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    // Add new course to your backend
    await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCourse }),
    });
    setCourses([...courses, { name: newCourse }]);
    setNewCourse('');
  };

  const handleDeleteCourse = async (courseId) => {
    // Delete course from your backend
    await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
    setCourses(courses.filter(course => course.id !== courseId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Course Management</h2>
      <form onSubmit={handleAddCourse} className="mb-4">
        <input
          type="text"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          placeholder="New Course Name"
          className="border border-gray-300 rounded p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
          Add Course
        </button>
      </form>
      <ul className="list-disc list-inside">
        {courses.map(course => (
          <li key={course.id} className="flex justify-between items-center">
            {course.name}
            <button
              onClick={() => handleDeleteCourse(course.id)}
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

export default CourseManagement;