import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { MdShoppingCart } from "react-icons/md";
import { useSelector } from 'react-redux';
import { getCookie } from '../utility/getCookie';
import { logout } from '../utility/logout';



const Navbar = () => {
    const cookie = getCookie('JWT');

    console.log('JWT token:', cookie);
    const [keyword, setKeyword] = useState("");
    const { items } = useSelector((state) => state.cart);

    const handleSearch = async (e) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword);
        console.log(newKeyword);

        try {
            const response = await fetch(`http://localhost:8080/api/product/search/${newKeyword}`, {
                method: 'POST',
                headers: {
                    JWT: getCookie('JWT')
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();

        } catch (error) {
            console.error('Error fetching all chats:', error.message);
        }
    };
    const handleLogout = () => {
        logout('JWT');


    };

    return (

        <div className='navbar w-full h-[8vh] mt-4 flex justify-end navbar-background border-t-2 border-b-2 border-black'>
            <div className='first-section flex items-center gap-8 w-[80%] ml-1 '>
                <img src={logo} className='max-w-[70px]' alt='Logo' />
                {cookie ? (<>
                    <p className='flex items-center gap-2'>
                        <i className="fa-solid fa-location-dot"></i> Berhampur
                    </p>
                    <input type='text' placeholder='Search' className='min-h-[100%] min-w-[68%] px-2  bg-[#eeeeee] border-l-2 border-r-2 border-black  text-black text-lg' onChange={handleSearch} />

                </>) : (<></>)}
            </div>
            <div className='w-[45%] flex justify-end mr-10 items-center gap-12'>
                {cookie ? (<>
                    <ul className='flex justify-around items-center w-[35%]'>
                        <li>
                            <NavLink to='/' activeclassname="active" className='flex items-center h-full w-10'>
                                <img src='https://res.cloudinary.com/dmb0ooxo5/image/upload/v1707672594/vcqztf5l0iuwxay72twr.jpg' className='' alt='Profile' />

                            </NavLink>

                        </li>
                        <Link className='over' id='link'><span data-hover="ORDERS">Orders</span></Link>

                        <li><NavLink className='text-lg flex gap-1 items-center p-2'><MdShoppingCart className='text-[#1d1d1d] text-2xl ' />  <span>{items.length}</span>

                        </NavLink></li>

                    </ul>
                </>) : (<></>)}
                <div className='button-section px-4 flex gap-4 h-[100%] btn-section items-center border-l-2 border-r-2 border-black'>
                    {!cookie ? (<>

                        <Link to="/signup" id='link' className=''><span data-hover="SIGN UP">Sign Up</span> </Link>

                        <Link to="/login" id='link'><span data-hover="LOGIN">Login</span> </Link>
                    </>) : <>
                        <Link to="/login" id='link' className='' onClick={handleLogout}><span data-hover="LOGOUT">Logout</span> </Link>
                    </>}
                </div>
            </div>
        </div>
    );
};

export default Navbar;










