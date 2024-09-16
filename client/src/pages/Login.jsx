import React, { useState, useEffect } from 'react';
import { FaRegEye } from "react-icons/fa";
import { RiEyeCloseLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { login } from '../apis/api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from '../utility/getCookie';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
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
        window.open("https://e-commerce-app-mern-bmty.onrender.com/api/auth/google", "_self");
    };
    useEffect(() => {
        const cookie = getCookie('JWT')
        if (cookie) {
            navigate('/')
        }
    }, []);

    const notify = (message) => toast(`${message}`);
    return (
        <>

            <div className="flex justify-center items-center h-[90vh] ">
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
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-2 border-[#eeeeee]">
                    <h2 className="text-5xl font-bold mb-4 heading-font text-center">Welcome Back !</h2>
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
                            <p className="mt-4">Forgot Password ? <Link to="/reset" className="text-slate-400 hover:">Reset</Link></p>

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

                        <div className="mt-4 flex items-center gap-4 flex-col-reverse ">
                            <button onClick={handleGoogleLogin} className="google-btn rounded">

                                <FcGoogle className="mr-2" />Continue with Google
                            </button>
                            <div class="flex w-full items-center justify-center mb-3 mt-3">
                                <span class="line"></span>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <span class="line"></span>
                            </div>


                            <button type="submit" className="w-[100%] shine-btn rounded-md" onClick={handleLogin}>Login</button>


                        </div>
                    </form>
                    <p className="text-center mt-4">Don't have an account? <a href="/signup" className="text-slate-500  hover:text-black">Sign Up</a></p>

                </div>
            </div>
        </>
    );
}

export default Login;
