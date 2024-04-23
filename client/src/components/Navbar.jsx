import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { MdShoppingCart } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { getCookie } from '../utility/getCookie';
import { logout } from '../utility/logout';
import { getUserData } from '../store/userSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const cookie = getCookie('JWT');
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const [dropdownWidth, setDropdownWidth] = useState(0);
    const searchInputRef = useRef(null);
    const { items } = useSelector((state) => state.cart);
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {

        dispatch(getUserData());
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

            setIsNavbarVisible(currentScrollTop < lastScrollTop || currentScrollTop === 0);
            setLastScrollTop(currentScrollTop);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollTop]);

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

            const searchData = await response.json();

            // Set search results and open dropdown
            setSearchResults(searchData);
            setIsDropdownOpen(true);
            console.log(searchResults);

            // Calculate and set dropdown position and width
            const inputRect = searchInputRef.current.getBoundingClientRect();
            setDropdownLeft(inputRect.left);
            setDropdownWidth(inputRect.width);

        } catch (error) {
            console.error('Error fetching search results:', error.message);
            setSearchResults([]);
            setIsDropdownOpen(false);
        }
    };

    const handleLogout = () => {
        logout('JWT');
    };

    return (
        <div className={`navbar w-full h-[7vh] mt-4 flex justify-end navbar-background border-t-2 border-b-2 border-black ${isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
            <div className='first-section flex items-center gap-8 w-[80%] ml-1 '>
                <img src={logo} className='max-w-[60px]' alt='Logo' />
                {cookie && (
                    <>
                        <p className='flex items-center gap-2'>
                            <i className="fa-solid fa-location-dot"></i> Berhampur
                        </p>
                        <input type='text' ref={searchInputRef} placeholder='Search name description or category..' className='min-h-[100%] min-w-[68%] px-2 bg-[#f7f6f6] border-l-2 border-r-2 border-black  text-black text-lg' onChange={handleSearch} />
                    </>
                )}
                {/* Dropdown for search results */}
                {isDropdownOpen && (
                    <div className="dropdown" style={{ left: dropdownLeft, width: dropdownWidth }}>
                        {searchResults.map((result, index) => (
                            <div key={index} className="dropdown-item text-black flex flex-row-reverse justify-end gap-2 items-center" onClick={() => console.log('Selected item:', result)}>
                                <div>{result.name}</div>
                                <img src={result.pictures[0]} className='w-[50px] h-[50px]'></img>
                                {/* Render other properties as needed */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className='w-[45%] flex justify-end mr-10 items-center gap-12'>
                {cookie && (
                    <ul className='flex justify-around items-center w-[35%]'>
                        <li>
                            <NavLink to='/' activeclassname="active" className='flex items-center h-full w-10'>
                                <img src={userData.profilePic ? userData.profilePic.url : ""} className='' alt='Profile' />
                            </NavLink>
                        </li>
                        <Link className='over' id='link'><span data-hover="ORDERS">Orders</span></Link>
                        <li><NavLink className='text-lg text-[#474640] flex gap-1 items-center p-2 hover:scale-[1.1] hover:text-[#000000]'><MdShoppingCart className='text-2xl' /><span>{items.length}</span></NavLink></li>
                    </ul>
                )}
                <div className='button-section px-4 flex gap-4 h-[100%] btn-section items-center border-l-2 border-r-2 border-black'>
                    {!cookie ? (
                        <>
                            <Link to="/signup" id='link' className=''><span data-hover="SIGN UP">Sign Up</span> </Link>
                            <Link to="/login" id='link'><span data-hover="LOGIN">Login</span> </Link>
                        </>
                    ) : (
                        <Link to="/login" id='link' className='' onClick={handleLogout}><span data-hover="LOGOUT">Logout</span> </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
