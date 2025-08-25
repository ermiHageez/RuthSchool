import React, { useState } from 'react';
import { jsPDF } from 'jspdf'; // Library for PDF generation

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    grandfatherName: '',
    placeOfBirth: '',
    dob: '',
    gender: 'Male',
    nationality: '',
    phoneNumber: '',
    email: '',
    permanentAddress: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    previousSchool: '',
    yearCompleted: '',
    subjects: [
      { subject: '', grade: '' },
      { subject: '', grade: '' },
      { subject: '', grade: '' },
    ],
    totalGrades: '',
    isDegree: false,
    isTVET: false,
    programOption: '',
    level: '',
    courseOption: '',
    paymentMethod: '',
    receiptNumber: '',
    applicantName: '',
    signature: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubjectChange = (index, e) => {
    const { name, value } = e.target;
    const subjects = [...formData.subjects];
    subjects[index][name] = value;
    setFormData({ ...formData, subjects });
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3)); // Limit to 3 steps
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1)); // Limit to step 1
  };

  const generateCredentials = () => {
    const username = formData.fullName.split(' ').join('').toLowerCase() + Math.floor(Math.random() * 1000);
    const password = Math.random().toString(36).slice(-8); // Generate a random 8-character password
    return { username, password };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = generateCredentials();

    // Send data to the backend
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, username, password }),
    });

    if (response.ok) {
      alert(`Registration successful! Your username is ${username} and your password is ${password}.`);
      generatePDF({ ...formData, username, password });
    } else {
      alert('Registration failed. Please try again.');
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.text("Registration Form", 20, 10);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Full Name: ${data.fullName}`, 20, 30);
    doc.text(`Username: ${data.username}`, 20, 40);
    doc.text(`Password: ${data.password}`, 20, 50);
    doc.text(`Email: ${data.email}`, 20, 60);
    doc.text(`Phone Number: ${data.phoneNumber}`, 20, 70);
    doc.text(`Emergency Contact: ${data.emergencyContactName} - ${data.emergencyContactNumber}`, 20, 80);
    
    let y = 100;
    doc.text("Subjects and Grades:", 20, y);
    data.subjects.forEach((subject, index) => {
      doc.text(`Subject: ${subject.subject}, Grade: ${subject.grade}`, 20, y + (10 * (index + 1)));
    });

    doc.save("registration_form.pdf");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4 mx-auto max-w-2xl text-gray-700 mt-20">
      {/* Step 1: Personal Information */}
      {step === 1 && (
        <>
          <h2 className="text-lg font-bold">Personal Information</h2>
          <input type="text" name="fullName" onChange={handleChange} placeholder="Full Name" className="input" required />
          <input type="text" name="fatherName" onChange={handleChange} placeholder="Father's Name" className="input" required />
          <input type="text" name="grandfatherName" onChange={handleChange} placeholder="Grand Father's Name" className="input" />
          <input type="text" name="placeOfBirth" onChange={handleChange} placeholder="Place of Birth" className="input" required />
          <input type="date" name="dob" onChange={handleChange} className="input" required />
          <div>
            Gender:
            <label>
              <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female
            </label>
          </div>
          <input type="text" name="nationality" onChange={handleChange} placeholder="Nationality" className="input" />
          <input type="text" name="phoneNumber" onChange={handleChange} placeholder="Phone Number" className="input" />
          <input type="email" name="email" onChange={handleChange} placeholder="Email" className="input" required />
          <textarea name="permanentAddress" onChange={handleChange} placeholder="Permanent Address" className="input" required />
          <input type="text" name="emergencyContactName" onChange={handleChange} placeholder="Emergency Contact Name" className="input" required />
          <input type="text" name="emergencyContactNumber" onChange={handleChange} placeholder="Emergency Contact Number" className="input" required />
        </>
      )}

      {/* Step 2: Educational Information */}
      {step === 2 && (
        <>
          <h2 className="text-lg font-bold">Educational Information</h2>
          <input type="text" name="previousSchool" onChange={handleChange} placeholder="Previous School" className="input" required />
          <input type="text" name="yearCompleted" onChange={handleChange} placeholder="Year Completed" className="input" required />
          {formData.subjects.map((subject, index) => (
            <div key={index} className="flex space-x-2">
              <input type="text" name="subject" value={subject.subject} onChange={(e) => handleSubjectChange(index, e)} placeholder="Subject" className="input" />
              <input type="text" name="grade" value={subject.grade} onChange={(e) => handleSubjectChange(index, e)} placeholder="Grade" className="input" />
            </div>
          ))}
          <input type="text" name="totalGrades" onChange={handleChange} placeholder="Total Grades" className="input" />
        </>
      )}

      {/* Step 3: Classification of Admission and Signature */}
      {step === 3 && (
        <>
          <h2 className="text-lg font-bold">Classification of Admission</h2>
          <div>
            <label>
              <input type="checkbox" name="isDegree" checked={formData.isDegree} onChange={() => setFormData({ ...formData, isDegree: !formData.isDegree })} /> Degree
            </label>
            <label>
              <input type="checkbox" name="isTVET" checked={formData.isTVET} onChange={() => setFormData({ ...formData, isTVET: !formData.isTVET })} /> TVET
            </label>
          </div>
          {formData.isDegree && (
            <select name="programOption" onChange={handleChange} className="input">
              <option value="">Select Program</option>
              <option value="Accounting">Accounting</option>
              <option value="Management">Management</option>
              <option value="Other">Other</option>
            </select>
          )}
          {formData.isTVET && (
            <>
              <select name="level" onChange={handleChange} className="input">
                <option value="">Select Level</option>
                <option value="Level I">Level I</option>
                <option value="Level II">Level II</option>
              </select>
              <select name="courseOption" onChange={handleChange} className="input">
                <option value="">Select Course</option>
                <option value="Marketing and Sales Management">Marketing and Sales Management</option>
                <option value="Accounting and Finance">Accounting and Finance</option>
                {/* Add more courses as necessary */}
              </select>
            </>
          )}

          {/* Payment Information */}
          <h2 className="text-lg font-bold">Payment Information</h2>
          <select name="paymentMethod" onChange={handleChange} className="input" required>
            <option value="">Select Payment Method</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" name="receiptNumber" onChange={handleChange} placeholder="Receipt Number/Voucher" className="input" required />

          {/* Signature */}
          <h2 className="text-lg font-bold">Signature</h2>
          <input type="text" name="applicantName" onChange={handleChange} placeholder="Applicant's Name" className="input" required />
          <input type="text" name="signature" onChange={handleChange} placeholder="Digital Signature (Type your name)" className="input" required />
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {step > 1 && (
          <button type="button" onClick={handlePrev} className="btn">Previous</button>
        )}
        {step < 3 ? (
          <button type="button" onClick={handleNext} className="btn">Next</button>
        ) : (
          <button type="submit" className="btn">Register</button>
        )}
      </div>
    </form>
  );
};

export default RegistrationForm;