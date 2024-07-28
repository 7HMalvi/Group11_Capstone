import React, { useState } from 'react'
import authImg from '../../../src/image/auth.png';
import logoImg from '../../../src/image/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import CustomSelect from '../custom/CustomSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {SignUpAPI} from '../../services/APIRoutes'
import { omit } from "lodash";
const validator = require('validator')


export default function SignUp() {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [cpasswordVisible, setCPasswordVisible] = useState(false);
    const [values, setValues] = useState
    ({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        cpassword: "",
        userType: "user"
    })
    const [errors, setErrors] = useState({});
    const [signupError, setSignupError] = useState("");
    let navigate = useNavigate();

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
    const toggleCPasswordVisibility = () => {
        setCPasswordVisible(!cpasswordVisible);
    };

     
    const validate = (name, value) => {
        switch (name) {
            case "email":
                if (!validator.isEmail(value)) 
                {
                    setErrors({
                        ...errors,
                        email: "Enter a valid email address",
                    });
                }else {
                    let newObj = omit(errors, "email");
                    setErrors(newObj);
                }
                break;

            case "firstName":
                if (value==="") {
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
                if (value==="") {
                    setErrors({
                        ...errors,
                        lastName: "Please fill this field",
                    });
                } else {
                    let newObj = omit(errors, "lastName");
                    setErrors(newObj);
                }
                break;
  
            case "password":
                if (value==="") {
                    setErrors({
                        ...errors,
                        password: "Please fill this field",
                    });
                } else {
                    let newObj = omit(errors, "password");
                    setErrors(newObj);
                }
                break;

            case "cpassword":
                if (value === "") {
                    setErrors({
                        ...errors,
                        cpassword: "Please fill this field",
                    });
                } else if (value !== values.password) {
                    setErrors({
                        ...errors,
                        cpassword: "Passwords do not match",
                    });
                } else {
                    let newObj = omit(errors, "cpassword");
                    setErrors(newObj);
                }
                break;
    
            default:
                break;
        }
    };
  
    const handleChange = (event) => {
        event.persist();
        let name = event.target.name;
        let val = event.target.value;
        validate(name, val);
        setValues({
            ...values,
            [name]: val,
        });
    };

    const handleSelectChange = (selectedOption) => {
        setValues({
            ...values,
            userType: selectedOption.value
        });
    };
    
    const handleSubmit = async (event) => {

        event.preventDefault();

        let blank_fields = {}
        for(let i in Object.keys(values)){
            if(!values[Object.keys(values)[i]]){
                blank_fields = {...blank_fields, [Object.keys(values)[i]]: "Please fill this field"}
            }
        }
        blank_fields = {...errors, ...blank_fields}
        setErrors(blank_fields)

        
        if (Object.keys(blank_fields).length === 0 && Object.keys(values).length !== 0) {

            try{
                const result = await fetch(SignUpAPI, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(values),
                                    });
                const status = result.status
                const data = await result.json()
                if(data.error){
                    throw new Error(data.error)
                }else if(status===201){
                    localStorage.setItem('userToken', data.token)
                    if(data.user.userType==="user"){
                        navigate("/home", {replace:true});
                    }else{
                        navigate("/dashboard", {replace:true});
                    }
                }
            }catch(error){
                setSignupError(error.message)
            }

            setValues({
                ...values,
                password: "",
                cpassword: ""
            });

        }
    };


  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 w-full h-screen'>
        <div className='hidden sm:block bg-red-600'>
            <img className="w-full h-screen object-cover" src={authImg} alt="Admin Login" />
        </div>
        <div className='flex flex-col justify-center'>
            <img src={logoImg} alt="Logo" className='h-30 self-center' style={{width: "350px"}} />
            <form className='max-w-[370px] w-full mx-auto p-4 shadow-red text-white' onSubmit={handleSubmit}>
                <div className='flex flex-col py-2'>
                    <label className='text-sm'>First Name</label>
                    <input className="text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none" 
                            type='text' 
                            name="firstName"
                            placeholder='Enter First Name'
                            onChange={handleChange}
                            value={values.firstName}/>
                    {errors.firstName && (<small className="text-sm text-red-500">{errors.firstName}</small>)}
                </div>
                <div className='flex flex-col py-2'>
                    <label className='text-sm'>Last Name</label>
                    <input className="text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none" 
                            type='text' 
                            name="lastName"
                            placeholder='Enter Last Name'
                            onChange={handleChange}
                            value={values.lastName}/>
                    {errors.lastName && (<small className="text-sm text-red-500">{errors.lastName}</small>)}
                </div>
                <div className='flex flex-col py-2'>
                    <label className='text-sm'>Email</label>
                    <input className="text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none" 
                            type='text' 
                            name="email"
                            placeholder='Enter Email'
                            onChange={handleChange}
                            value={values.email}/>
                    {errors.email && (<small className="text-sm text-red-500">{errors.email}</small>)}
                </div>
                <div className='flex flex-col py-2'>
                    <label className='text-sm'>Password</label>
                    <input className="text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none" 
                            type={passwordVisible ? 'text' : 'password'}
                            name="password"
                            placeholder='Enter Password'
                            onChange={handleChange}
                            value={values.password} />
                    <button
                        type='button'
                        onClick={togglePasswordVisibility}
                        className='absolute text-red-500 focus:outline-none'
                        style={{    
                            marginLeft: "310px",
                            marginTop: "30px"
                        }}
                    >

                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                    </button>
                    {errors.password && (<small className="text-sm text-red-500">{errors.password}</small>)}
                </div>
                <div className='flex flex-col py-2'>
                    <label className='text-sm'>Confirm Password</label>
                    <input className="text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none" 
                            type={cpasswordVisible ? 'text' : 'password'}
                            name="cpassword"
                            placeholder='Confirm Password'
                            onChange={handleChange}
                            value={values.cpassword} />
                    <button
                        type='button'
                        onClick={toggleCPasswordVisibility}
                        className='absolute text-red-500 focus:outline-none'
                        style={{    
                            marginLeft: "310px",
                            marginTop: "30px"
                        }}
                    >
                        <FontAwesomeIcon icon={cpasswordVisible ? faEyeSlash : faEye} />
                    </button>
                    {errors.cpassword && (<small className="text-sm text-red-500">{errors.cpassword}</small>)}
                </div>
                <div className='flex flex-col py-2'>
                    <label className='text-sm'>User Type</label>
                    <CustomSelect 
                        options={[
                            { value: 'user', label: 'User' },
                            { value: 'admin', label: 'Admin' }
                        ]}
                        onChange={handleSelectChange}
                    />
                </div>
                <button className='w-full my-5 py-2 bg-red-600 hover:bg-red-500 text-white'>Sign Up</button>
                {
                    signupError &&
                    <div className='flex flex-col py-2 text-sm'>
                        <p className='text-red-500'>{signupError}</p>
                    </div>
                }
                <div className='flex justify-center'>
                    <p className='text-sm'>Already have an account? <Link to="/" className='text-red-500'>Login</Link></p>
                </div>
            </form>
        </div>
    </div>
  )
}