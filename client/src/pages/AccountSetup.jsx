import React, { useState, useEffect } from 'react';
import { addPhNumber } from '../apis/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';



const AccountSetup = () => {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);

    const notify = (message) => toast(`${message}`);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setloading] = useState(false);

    const handleInputChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleDoneClick = async () => {
        setloading(true);
        const response = await addPhNumber(phoneNumber);
        if (response) {

            notify("Login Successfull");
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } else notify("Something is wrong with google");

    };

    useEffect(() => {
        const checkPhoneNumber = () => {
            setloading(true);

            //console.log("User details:", userData);

            if (userData && userData.phoneNumber) {
                //console.log("User has a phone number");


                navigate('/');



            } else {
                //console.log("User does not have a phone number");
                setloading(false);
            }
        };

        checkPhoneNumber();
    }, [userData]);


    if (loading) {
        return (<div className="w-[100vw] h-[80vh] overflow flex justify-center items-center">
            <span className="loader"></span>
        </div>
        )
    }
    return (<>
        {!userData && !userData?.phoneNumber ? <div className="max-w-full h-[80vh] flex justify-center items-center ">
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
            <div className="w-full max-w-md  p-8 border-2 ">
                <h1 className="text-5xl mb-4 font-bold">Almost&nbsp;Done&nbsp;!</h1>
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
                        className="w-full bg-blue-500  text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Finish
                    </button>
                </div>
            </div>
        </div> : <div className="w-[100vw] h-[80vh] overflow flex justify-center items-center">
            <span className="loader"></span>
        </div>
        }
    </>);
};

export default AccountSetup;
