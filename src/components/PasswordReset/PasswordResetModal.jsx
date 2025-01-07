// components/PasswordResetModal.js
import { auth } from '@/Backend/Firebase';
import React, { useState, useEffect } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

const PasswordResetModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await sendPasswordResetEmail(email);
    };

    useEffect(() => {
        if (sending) {
            setMessage('Sending reset email...');
        } else if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('');
        }
    }, [sending, error]);

    useEffect(() => {
        if (!sending && !error) {
            setEmail(''); // Reset email field after successful operation
            if (message) {
                setMessage('Check your email for the password reset link.');
            }
        }
    }, [sending, error, message]);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Password Reset</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-500">Enter your email address to reset your password.</p>
                        <input
                            type="email"
                            className="mt-2 p-2 border rounded-md w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                        />
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={handleSubmit}
                            disabled={sending}
                        >
                            Send Email
                        </button>
                        {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetModal;
