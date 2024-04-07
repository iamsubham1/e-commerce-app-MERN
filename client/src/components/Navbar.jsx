import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <div className='navbar w-full h-[7vh] mt-2 flex justify-end navbar-background'>
            <div className='first-section flex items-center gap-8 w-[80%] ml-1 '>
                <img src={logo} className='max-w-[70px]' alt='Logo' />
                <p className='flex items-center gap-1'>
                    <i className="fa-solid fa-location-dot"></i> Berhampur
                </p>
                <input type='text' placeholder='search' className='min-h-[70%] min-w-[68%] px-2 rounded-lg bg-black border-2' />
            </div>
            <div className='w-[45%] flex justify-end mr-10 items-center gap-12'>
                <ul className='flex justify-around items-center w-[35%]'>
                    <li>
                        <NavLink to='/' activeClassName="active" className='flex items-center gap-1 h-full w-10'>
                            <img src='https://res.cloudinary.com/dmb0ooxo5/image/upload/v1707672594/vcqztf5l0iuwxay72twr.jpg' className='rounded-full' alt='Profile' />

                        </NavLink>

                    </li>
                    <li><NavLink className='text-lg'>Orders</NavLink></li>
                    <li><NavLink className='text-lg'>Cart</NavLink></li>
                </ul>
                <div className='button-section px-4 flex gap-4'>
                    <button type='button' className='w-[5vw] h-[70%] border-[white] border-2 rounded py-1 primary-button'>Sign Up</button>
                    <button type='button' className='w-[5vw] h-[70%] border-[white] border-2 rounded py-1 primary-button'>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
