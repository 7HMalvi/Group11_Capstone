import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditUserModal = ({ user, show, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [user, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(user._id, formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
      <div className="p-4 rounded shadow-red" style={{ width: '350px', height: '400px' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-red-600">Edit User</h2>
          <button onClick={onClose} className="text-red-600 text-2xl">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">First Name</label>
            <input
              className="w-full text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required />
          </div>
          <div className="mb-4">
            <label className="block">Last Name</label>
            <input
              className="w-full text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required/>
          </div>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              className="w-full text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 border border-red-600">Cancel</button>

            <button type="submit" className="px-4 py-2 border border-red-600 bg-red-600 text-white">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
