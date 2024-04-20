import React, { useState, useEffect } from 'react';
import { FaRegEye } from "react-icons/fa";
import { RiEyeCloseLine } from "react-icons/ri";
import { signup } from '../apis/api';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utility/getCookie';


const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [formValid, setFormValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
        setPasswordsMatch(prevFormData.password === value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await signup(formData);
        if (response) {
            notify("Account Created");
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } else notify("Account exists login instead!");
    };


    const notify = (message) => toast(`${message}`);

    useEffect(() => {
        const isFormFilled = Object.values(formData).every((val) => val.trim() !== '');
        setFormValid(isFormFilled && passwordsMatch);
    }, [formData, passwordsMatch]);

    // useEffect(() => {

    //     const token = getCookie('JWT');
    //     console.log(token);
    //     if (token) {
    //         navigate('/');
    //     }
    // }, [navigate]);
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <ToastContainer position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                className='mt-14'
            />
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                <form>
                    <div className="mb-4">
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                    </div>
                    <div className="mb-4 relative">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handlePasswordChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" required />
                        {showPassword ? (
                            <FaRegEye
                                className="absolute top-0 right-0 mt-3 mr-4 cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}
                            />
                        ) : (
                            <RiEyeCloseLine
                                className="absolute top-0 right-0 mt-3 mr-4 cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}
                            />
                        )}
                    </div>
                    <div className="mb-4 relative">
                        <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handlePasswordChange} className={`w-full px-4 py-2 border rounded-md focus:outline-none ${passwordsMatch ? 'focus:border-blue-500' : 'border-red-500'}`} required />
                        {!passwordsMatch && <p className="mt-1 text-sm text-red-500">Passwords do not match</p>}
                        {showPassword ? (
                            <FaRegEye
                                className="absolute top-0 right-0 mt-3 mr-4 cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}
                            />
                        ) : (
                            <RiEyeCloseLine
                                className="absolute top-0 right-0 mt-3 mr-4 cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-md focus:outline-none ${!formValid ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        disabled={!formValid}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </button>                </form>
                <p className="mt-4 text-center">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
            </div>
        </div>
    );
};

export default SignupForm;
