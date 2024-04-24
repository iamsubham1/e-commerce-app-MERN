import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { MdShoppingCart, MdMenu, MdOutlineClose } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { getCookie } from '../utility/getCookie';
import { logout } from '../utility/logout';
import { getUserData } from '../store/userSlice';
import { FaBoxOpen } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { IoIosHelpCircle } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { RiLoginCircleFill } from "react-icons/ri";

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

            setSearchResults(searchData);
            setIsDropdownOpen(true);

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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className={` w-full h-[7vh] mt-4 flex justify-end navbar border-t-2 border-b-2  border-black ${isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
            <div className=' flex items-center gap-8 w-[80%] ml-1 '>
                <img src={logo} className='w-[60px]' alt='Logo' />
                {cookie && (
                    <>
                        <p className='flex items-center gap-2 hide-section hide-location'>
                            <i className="fa-solid fa-location-dot"></i> Berhampur
                        </p>
                        <input type='text' ref={searchInputRef} placeholder='Search ' className='min-h-[100%] searchwidth px-2 bg-[#f7f6f6] border-l-2 border-r-2 border-black  text-black text-lg' onChange={handleSearch} />
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
            <div className='max-w-[10%] flex justify-end mr-10 items-center gap-12 hide-section '>
                {cookie && (
                    <ul className='flex justify-around items-center w-[]'>
                        <li>

                        </li>
                        <Link className='over' id='link' to='/orders'><span data-hover="ORDERS">Orders</span></Link>
                        <li><NavLink className='text-lg text-[#474640] flex gap-1 items-center p-2 hover:scale-[1.1] hover:text-[#000000]' to='/cart'><MdShoppingCart className='text-2xl' /><span>{items.length}</span></NavLink></li>
                    </ul>
                )}

            </div>
            <div className={`button-section px-4 flex gap-4 h-[100%] btn-section items-center mr-6 border-black hide-section border-l-2 border-r-2`}>
                {!cookie ? (
                    <>
                        <Link to="/signup" id='link' className='nav-link'><span data-hover="SIGN UP">Sign Up</span> </Link>
                        <Link to="/login" id='link' className='nav-link'><span data-hover="LOGIN">Login</span> </Link>
                    </>
                ) : (
                    <Link to="/login" id='link' className='nav-link' onClick={handleLogout}><span data-hover="LOGOUT">Logout</span> </Link>
                )}
            </div>

            {!isMobileMenuOpen ? <MdMenu className={'text-3xl cursor-pointer self-center hamburger'} onClick={toggleMobileMenu} /> : <MdOutlineClose className={'text-3xl cursor-pointer self-center hamburger'} onClick={toggleMobileMenu} />}

            {
                isMobileMenuOpen && (cookie ? (
                    <div className="mobile-menu" style={{ animationName: isMobileMenuOpen ? 'slidein' : 'slideout' }}>
                        <ul>
                            <li className='flex items-center cursor-pointer w-full h-[6vh]'>
                                <div className='flex items-center justify-start w-full gap-2 px-4'>
                                    <NavLink to='/profile' activeclassname="active" className='flex items-center h-full w-10'>
                                        <img src={userData.profilePic ? userData.profilePic.url : ""} className='' alt='Profile' />
                                    </NavLink>
                                    <p className='text-lg'>{userData.name}</p>
                                </div>
                                <div className='flex items-center justify-end'>
                                    <NavLink className='text-lg text-[#474640] flex gap-2 items-center p-2 hover:text-[#5c8acf]' to='/cart'>
                                        <MdShoppingCart className='text-2xl' />
                                        <span>{items.length}</span>
                                    </NavLink>
                                </div>
                            </li>

                            <li><div className='w-full h-[6vh] text-4xl flex items-center p-4 gap-2'><FaBoxOpen />
                                <span className='text-lg'> <p>Your Orders</p></span>
                            </div></li>

                            <li> <Link to="/login" className='flex w-full h-[6vh]  p-4 items-center gap-2 text-4xl' onClick={handleLogout}><MdLogout /><span className='text-lg'><p>Logout</p></span>
                            </Link></li>
                        </ul>
                    </div>
                ) : (<div className="mobile-menu" style={{ animationName: isMobileMenuOpen ? 'slidein' : 'slideout' }}>
                    <ul>


                        <li> <Link to="/signup" className='flex w-full h-[6vh]  p-4 items-center gap-2 text-4xl' onClick={handleLogout}><MdAccountCircle />
                            <span className='text-lg'><p>Sign up</p></span>
                        </Link></li>
                        <li> <Link to="/login" className='flex w-full h-[6vh]  p-4 items-center gap-2 text-4xl' onClick={handleLogout}><RiLoginCircleFill />


                            <span className='text-lg'><p>Login</p></span>
                        </Link></li>
                        <li> <Link to="/help" className='flex w-full h-[6vh]  p-4 items-center gap-2 text-4xl' onClick={handleLogout}><IoIosHelpCircle />
                            <span className='text-lg'><p>Help</p></span>
                        </Link></li>
                    </ul>
                </div>))
            }

        </div>
    );
};

export default Navbar;