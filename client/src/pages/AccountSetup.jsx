import React, { useState, useEffect } from 'react';
import { addPhNumber } from '../apis/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { getUserData } from '../reducers/userSlice';

const AccountSetup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData } = useSelector((state) => state.user);
    const cookies = new Cookies();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(true);

    const notify = (message) => toast(message);

    const handleInputChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleDoneClick = async () => {
        setLoading(true);
        const response = await addPhNumber(phoneNumber);
        if (response) {
            notify("Phonenumber added");
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } else {
            notify("Something is wrong with Google");
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            cookies.set('JWT', token, { httpOnly: false, secure: true, sameSite: 'none', maxAge: 60 * 60 * 24 });
            // Fetch user details after setting the cookie
            dispatch(getUserData());
        }
    }, [cookies, getUserData]);

    useEffect(() => {
        if (userData) {
            if (userData.phoneNumber) {
                navigate('/');
            } else {
                setLoading(false);
            }
        }
    }, [userData, getUserData]);

    if (loading) {
        return (
            <div className="w-[100vw] h-[80vh] overflow flex justify-center items-center">
                <span className="loader"></span>
            </div>
        );
    }

    return (
        <>
            {!userData && !userData?.phoneNumber ? (
                <div className="max-w-full h-[80vh] flex justify-center items-center">
                    <ToastContainer
                        position="top-right"
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
                    <div className="w-full max-w-md p-8 border-2">
                        <h1 className="text-5xl mb-4 font-bold">Almost Done!</h1>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 mb-4 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={handleDoneClick}
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                            >
                                Finish
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-[100vw] h-[80vh] overflow flex justify-center items-center">
                    <span className="loader"></span>
                </div>
            )}
        </>
    );
};

export default AccountSetup;
