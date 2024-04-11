import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { MdShoppingCart } from "react-icons/md";



const Navbar = () => {

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmFtIiwib3JkZXJzIjpbIjY2MDJmMjJjY2UyZGNiZGI2YjI5OGRhMiIsIjY2MDJmMzE3NDZhY2Q0ZjMwYWI1NWIyZiIsIjY2MTI5MmRiMDEwMDBkNjZjOGU1YjRjNyIsIjY2MTI5MzA2YzMzYTFhYWEzMTkzOTEwOSIsIjY2MTJiZTExNzFlY2QwMGI4YzdkNDAyMyIsIjY2MTJiZTdmOTIzMmUyYjAzNDJkOTJhNCIsIjY2MTJiZWU5MzYyMWRmYThjNmRkOTAyZiIsIjY2MTJjMzA0ZjRiYWY5ZjM4ZGQ4YzIyNiIsIjY2MTJjMzRjZjRiYWY5ZjM4ZGQ4YzIzNiIsIjY2MTJjMzcxNDFmZWQyNzdjZGNlMzM1MSIsIjY2MTJjNWI0NGU0ZGM1OTkwYjU2OGU5NyIsIjY2MTJjNjBkYjc3OTdhNTQ4ZjUzMTk0MSIsIjY2MTJkMTc2ZjUzZTQyNzBmOTk2NzJkZSIsIjY2MTJkMTg2MzNkMmJkMTZlMjFkOWU2NSIsIjY2MTJkMWIwNjA5NTJiMDkxNzVlMzQxYyIsIjY2MTJkMWJiYmE5ZjhiOTQzNzljNmRhNyIsIjY2MTJkMWNlY2VlNGRjYmY3NDJjM2M1NyIsIjY2MTJkM2E4NDk2MGYwNDBmZGY4YzJhMCIsIjY2MTJkM2NlNDk2MGYwNDBmZGY4YzJhYyIsIjY2MTJkM2ZiOGYwOWE5ZWJmMGUzMjAwZCIsIjY2MTJkNDI4ZDgwZjkyZWZmYTMyMzc2NCIsIjY2MTJkNDNmZDgwZjkyZWZmYTMyMzc3MCIsIjY2MTJkNDlkM2Q4YjYzMzQxOGVmMDE4YSIsIjY2MTJkNTI2ZDNiZTE0MDExZDQyN2RjOCIsIjY2MTJkNjczZDBkYTZlNzJlNzE3MzdjYiIsIjY2MTJkNzk0ZTExODE4YzZkNGNjMjI1NCIsIjY2MTJkN2FkYmU0Mzk0MjE2ZjA0MjA3MyIsIjY2MTJkODA3OTJiZWE1MDdkMTRlMjc4OCIsIjY2MTJkODJmYmU2YmFhZTI5NGNlOTc3YiIsIjY2MTJkODViM2JkZmE5MDBlYmIwNjZlYSIsIjY2MTJkODg1ZTc1NzQ1M2RjOTE1YzQ2MSIsIjY2MTJkOTI5N2U4YWI4NmE4NDIyNzRkZSIsIjY2MTJkOTM5N2U4YWI4NmE4NDIyNzRlOCIsIjY2MTJkYTI5YTBkOTRmMzNjMzM4MTQ2ZCJdLCJfaWQiOiI2NWZiZGM3N2JkZDA2NzI1NmUxNDlkYTYiLCJlbWFpbCI6InJhbUBnbWFpbC5jb20iLCJpYXQiOjE3MTI1ODMyNTZ9.MpkpYU56IryvqzPXsZFq9Z2B5FpqxzUhnJR2vT27BiU"
    const [keyword, setKeyword] = useState("");

    const handleSearch = async (e) => {
        const newKeyword = e.target.value;
        setKeyword(newKeyword);
        console.log(newKeyword);

        try {
            const response = await fetch(`http://localhost:8080/api/product/search/${newKeyword}`, {
                method: 'POST',
                headers: {
                    JWT: token
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

    return (

        <div className='navbar w-full h-[8vh] mt-4 flex justify-end navbar-background border-t-2 border-b-2 border-black'>
            <div className='first-section flex items-center gap-8 w-[80%] ml-1 '>
                <img src={logo} className='max-w-[70px]' alt='Logo' />
                <p className='flex items-center gap-2'>
                    <i className="fa-solid fa-location-dot"></i> Berhampur
                </p>
                <input type='text' placeholder='Search' className='min-h-[100%] min-w-[68%] px-2  bg-[#eeeeee] border-l-2 border-r-2 border-black  text-black text-lg' onChange={handleSearch} />
            </div>
            <div className='w-[45%] flex justify-end mr-10 items-center gap-12'>
                <ul className='flex justify-around items-center w-[35%]'>
                    <li>
                        <NavLink to='/' activeClassName="active" className='flex items-center h-full w-10'>
                            <img src='https://res.cloudinary.com/dmb0ooxo5/image/upload/v1707672594/vcqztf5l0iuwxay72twr.jpg' className='' alt='Profile' />

                        </NavLink>

                    </li>
                    <Link className='over' id='link'><span data-hover="ORDERS">Orders</span></Link>

                    <li><NavLink className='text-lg flex gap-1 items-center p-2'><MdShoppingCart className='text-[#1d1d1d] text-2xl ' />

                    </NavLink></li>

                </ul>
                <div className='button-section px-4 flex gap-4 h-[100%] btn-section items-center border-l-2 border-r-2 border-black'>

                    <Link to="#" id='link' className=''><span data-hover="SIGN UP">Sign Up</span> </Link>

                    <Link to="#" id='link'><span data-hover="LOGIN">Login</span> </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
