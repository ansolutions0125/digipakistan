'use client';
import React, { useState } from 'react';
import axios from 'axios';

const EnrollUserComponent = () => {
  const [userId, setUserId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEnroll = async () => {
    if (!userId || !courseId) {
      setErrorMessage('Please provide both user ID and course ID.');
      return;
    }

    try {
      const enrollmentData = {
        course_id: courseId, // Correct course ID
        user_id: userId,     // Correct user ID
      };

      const response = await axios.post(
        'https://api.thinkific.com/api/public/v1/enrollments',
        enrollmentData,
        {
          headers: {
            'X-Auth-API-Key': '9e2d5a6420e27c5337433e8d1b9cf62c', // Replace with your API key
            'X-Auth-Subdomain': 'digitalprogram', // Replace with your subdomain
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        alert('User successfully enrolled in the course!');
      } else {
        setErrorMessage(`Failed to enroll user: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error enrolling user:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'An error occurred during enrollment.');
    }
  };

  return (
    <div>
      <h1>Enroll User in Course</h1>
      <div>
        <label htmlFor="user_id">User ID:</label>
        <input
          type="text"
          id="user_id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
        />
      </div>
      <div>
        <label htmlFor="course_id">Course ID:</label>
        <input
          type="text"
          id="course_id"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Enter course ID"
        />
      </div>
      <button onClick={handleEnroll}>Enroll User</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default EnrollUserComponent;
