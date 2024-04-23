import React, { useState, useEffect } from 'react';
import { FaRegEye } from "react-icons/fa";
import { RiEyeCloseLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { login } from '../apis/api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from '../utility/logout';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',

    });
    const [showPassword, setshowPassword] = useState(false);

    //form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {

        setshowPassword(prevState => !prevState
        );
    };

    //normal login
    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await login(formData);
        if (response) {
            notify("Login Successfull");
            setTimeout(() => {
                window.location.href = '/'
            }, 1200);

        } else notify("Incorrect Credentials");
    }

    //google login
    const handleGoogleLogin = (e) => {
        e.preventDefault();
        window.open("http://localhost:8080/api/auth/google", "_self");

        console.log("Login with Google");
    };


    const notify = (message) => toast(`${message}`);
    return (
        <>

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
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    <form>
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            />
                            <p className="mt-4">Forgot Password ? <a href="/signup" className="text-blue-500 hover:underline">Reset</a></p>

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
                        <div className="mt-4 flex items-center gap-4">
                            <button onClick={handleGoogleLogin} className="bg-[#000000] w-[50%]  text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 flex items-center justify-center">

                                Login with &nbsp;<FcGoogle className="mr-2" />
                            </button>
                            <button type="submit" className="w-[50%] bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" onClick={handleLogin}>Login</button>

                        </div>
                    </form>

                    <p className="mt-4 text-center">Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a></p>
                </div>
            </div>
        </>
    );
}

export default Login;
