import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';
import { EditProfile, EditProfilePic, GetProfile, RemoveProfilePic } from '../../services/APIRoutes';
import { omit } from "lodash";
const validator = require('validator')

export default function ProfilePage() {

  const [image, setImage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(GetProfile, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.user) {
        setFormData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          phone: data.user.phone
        });
        setImage(data.user.profilePic);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageChange = async (e) => {

    const file = e.target.files[0];
    if (file) {

      const form = new FormData();
      form.append('profilePic', file);

      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(EditProfilePic, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: form
        });
        const data = await response.json();
        if (data.user) {
          setImage(data.user.profilePic);
        } else {
          console.error('Error changing profile pic:', data.error);
        }
      } catch (error) {
        console.error('Error changing profile pic:', error);
      }
    }
  };

  const handleRemoveImage = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const result = await fetch(RemoveProfilePic, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            }      
        });
        const data = await result.json()
        if (data.user) {
          setImage(data.user.profilePic);
        }
      } catch (error) {
          setFormError(error.message)
      }
  };

  const validate = (name, value) => {
      switch (name) {
          case "email":
              if (!validator.isEmail(value)) {
                  setErrors({
                      ...errors,
                      email: "Enter a valid email address",
                  });
              } else {
                  let newObj = omit(errors, "email");
                  setErrors(newObj);
              }
              break;

          case "firstName":
              if (value === "") {
                  setErrors({
                      ...errors,
                      firstName: "Please fill this field",
                  });
              } else {
                  let newObj = omit(errors, "firstName");
                  setErrors(newObj);
              }
              break;

          case "lastName":
              if (value === "") {
                  setErrors({
                      ...errors,
                      lastName: "Please fill this field",
                  });
              } else {
                  let newObj = omit(errors, "lastName");
                  setErrors(newObj);
              }
              break;

          case "phone":
              if (value === "") {
                  setErrors({
                      ...errors,
                      phone: "Please fill this field",
                  });
              } else if (!validator.isMobilePhone(value)) {
                  setErrors({
                      ...errors,
                      phone: "Enter a valid phone number",
                  });
              } else {
                  let newObj = omit(errors, "phone");
                  setErrors(newObj);
              }
              break;

          default:
              break;
      }
  };

  const handleChange = (e) => {
      e.persist();
      const { name, value } = e.target;
      validate(name, value);
      setFormData({
          ...formData,
          [name]: value,
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let blank_fields = {}
    for (let i in Object.keys(formData)) {
        if (!formData[Object.keys(formData)[i]]) {
            blank_fields = { ...blank_fields, [Object.keys(formData)[i]]: "Please fill this field" }
        }
    }
    blank_fields = { ...errors, ...blank_fields }
    setErrors(blank_fields)

    if (Object.keys(blank_fields).length === 0 && Object.keys(formData).length !== 0) {
        try {
            const token = localStorage.getItem('userToken');
            const result = await fetch(EditProfile, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await result.json()
            if (data.error) {
                throw new Error(data.error)
            } else if (data.user) {
              setFormData({
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                phone: data.user.phone
              });
            }
        } catch (error) {
            setFormError(error.message)
        }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 m-5 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img 
              src={"https://backendgroovix.onrender.com"+image} 
              alt="Profile" 
              className="w-35 h-35 rounded-full object-cover"
            />
            <label className="absolute bottom-2 right-2 bg-gray-700 text-white rounded-full p-3 cursor-pointer">
              <FontAwesomeIcon icon={faCamera} className='h-7 w-7'/>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </label>
            <button 
              type="button" 
              onClick={handleRemoveImage} 
              className="absolute top-0 right-0 p-3"
            >
              <FontAwesomeIcon icon={faTrash} className='h-5 w-5' />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm text-red-600">First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none"
              placeholder="First Name"
            />
            {errors.firstName && (<small className="text-sm text-red-500">{errors.firstName}</small>)}
          </div>
          <div className="mb-4">
            <label className="text-sm text-red-600">Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none"
              placeholder="Last Name"
            />
            {errors.lastName && (<small className="text-sm text-red-500">{errors.lastName}</small>)}
          </div>
          <div className="mb-4">
            <label className="text-sm text-red-600">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none"
              placeholder="Email"
            />
            {errors.email && (<small className="text-sm text-red-500">{errors.email}</small>)}
          </div>
          <div className="mb-4">
            <label className="text-sm text-red-600">Phone <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none"
              placeholder="Phone Number"
            />
            {errors.phone && (<small className="text-sm text-red-500">{errors.phone}</small>)}
          </div>
          {
              formError &&
              <div className='flex flex-col py-2 text-sm'>
                  <p className='text-red-500'>{formError}</p>
              </div>
          }
          <button type="submit" className="w-full my-5 py-2 bg-red-600 hover:bg-red-500 text-white">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
