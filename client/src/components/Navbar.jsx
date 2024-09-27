import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { MdShoppingCart, MdMenu, MdOutlineClose } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { getCookie } from '../utility/getCookie';
import { logout } from '../utility/logout';
import { getUserData } from '../reducers/userSlice';
import { FaBoxOpen } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { IoIosHelpCircle } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { RiLoginCircleFill } from "react-icons/ri";
import { getSearchResults } from '../apis/api';
import { fetchInitialCartState } from '../reducers/cartslice';
import '../components/css/navbar.css'
import Loader from './Loader';
import BeatLoader from "react-spinners/BeatLoader";



const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cookie = getCookie('JWT');
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const [dropdownWidth, setDropdownWidth] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [locationloading, setLocationloading] = useState(false);
    const [loading, setloading] = useState(false);
    const [token, setToken] = useState(null);

    const searchInputRef = useRef(null);
    const debounceTimer = useRef(null);

    const { items } = useSelector((state) => state.cart);
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        const token = getCookie('JWT');
        if (token) {
            dispatch(getUserData(token));
            dispatch(fetchInitialCartState(token));
        }

    }, []);




    useEffect(() => {

        if (navigator.geolocation) {
            setLocationloading(true);
            navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    //console.log(latitude, longitude);

                    // Convert coordinates to address
                    try {
                        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                            params: {
                                latlng: `${latitude},${longitude}`,
                                key: "AIzaSyBbdDgOyvgEd1G_qyiRrhAT7SH8zwKBrzA"
                            }
                        });

                        if (response.data.results.length > 0) {
                            //console.log(response);
                            setLocationloading(false);
                            let formattedAddress = response.data.results[1].formatted_address;
                            //console.log("Original Address:", formattedAddress);

                            // Remove the first word and comma
                            const firstCommaIndex = formattedAddress.indexOf(',');
                            if (firstCommaIndex !== -1) {
                                formattedAddress = formattedAddress.substring(firstCommaIndex + 1).trim();
                            }

                            // Remove the last two words and their commas
                            let addressParts = formattedAddress.split(',').map(part => part.trim());
                            if (addressParts.length > 2) {
                                // Remove the last two elements
                                addressParts = addressParts.slice(0, -2);
                            }
                            // Reassemble the address
                            let trimmedAddress = addressParts.join(', ').trim();

                            //console.log("Trimmed Address:", trimmedAddress);
                            setUserAddress(trimmedAddress);


                        }
                    } catch (error) {
                        console.error("Error fetching location address:", error);
                    }
                },
                (error) => console.error("Error getting location:", error),

                {
                    enableHighAccuracy: true, // Request the highest possible accuracy
                    maximumAge: 0, // Do not use a cached location

                }
            );
        }
    }, []);

    const totalQuantity = items && items.reduce((total, item) => total + item.quantity, 0);

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

    //console.log("dropdown", isDropdownOpen);

    const handleSearch = async (value) => {
        setloading(true);
        const response = await getSearchResults(value);
        if (response) {
            //console.log(response);
            setIsDropdownOpen(true);
            setloading(false);
            setSearchResults(response.data);
            const inputRect = searchInputRef.current.getBoundingClientRect();
            setDropdownLeft(inputRect.left);
            setDropdownWidth(inputRect.width);
        }
        else {
            setSearchResults([]);
            setIsDropdownOpen(false);
        }
    };

    const debounceSearch = (value) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            handleSearch(value);
        }, 300); // Adjust the delay as needed
    };
    const handleLogout = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        logout('JWT');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const clearSearch = () => {
        setSearchValue('');
        setIsDropdownOpen(false);
    };
    return (
        <div className={` w-full h-[7vh] mt-4 flex justify-end navbar border-t-2 border-b-2  border-black ${isNavbarVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
            <div className=' flex items-center w-[85%] mr-5 '>
                <img src={logo} className='w-[60px] hover:cursor-pointer ml-4' alt='Logo' onClick={() => navigate('/')} />

                {cookie && (
                    <>
                        <div className={`w-[20%] mr-4 ml-3 ${isNavbarVisible ? 'inline' : 'hidden'} transition-all duration-300 hide-location`}>
                            {locationloading ? (
                                <BeatLoader size={10} color={"white"} />
                            ) : (
                                <div className='flex items-center gap-2 hide-section'>
                                    <i className="fa-solid fa-location-dot mb-1"></i>
                                    <p className='text-sm select-none'>{userAddress || 'unable to get location'}</p>
                                </div>
                            )}
                        </div>
                        <div className='w-[80%] md:w-[50%] sm:w-[70%] relative'>

                            <input type='keyword'
                                value={searchValue}

                                ref={searchInputRef}
                                placeholder='Search for products,brands,description'


                                style={{
                                    borderLeft: '2px solid black',
                                    borderRight: '2px solid black',
                                    borderColor: 'black',
                                    color: 'black',
                                    fontSize: '.95rem',
                                    borderRadius: '0.375rem',
                                    minHeight: '100%',
                                }} className='min-h-[100%] placeholder:text-[#161616] placeholder:font-[600] relative w-full px-2 py-[0.50rem] bg-[#cfcfcfd1] border-l-2 border-r-2 border-black text-black text-lg rounded-md'
                                onChange={(e) => {
                                    debounceSearch(e.target.value);
                                    setSearchValue(e.target.value);
                                }} />

                            {searchValue && (
                                <button
                                    className='absolute z-12 -ml-[7.5%] top-1/2 transform -translate-y-1/2 text-black hover:text-red-500 text-md'
                                    onClick={clearSearch}
                                >
                                    &#x2715;
                                </button>
                            )}
                        </div>
                    </>
                )}


                {/* Dropdown for search results */}
                {isDropdownOpen && (
                    <div className="dropdown left-5" style={{ left: dropdownLeft, width: dropdownWidth }}>
                        {loading ? (
                            <div className="py-10 text-center text-black">
                                <Loader width={dropdownWidth}
                                    height='200px' />
                            </div>
                        ) : (
                            searchResults.length > 0 ? (
                                searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item text-black flex flex-row-reverse justify-end gap-2 items-center"
                                        onClick={() => {
                                            navigate(`/product/${result._id}`);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <div>{result.name}</div>
                                        <img src={result.pictures[0]} className='w-[50px] h-[50px]' alt={result.name} />
                                    </div>
                                ))
                            ) : (
                                <div className='py-10'>
                                    <p className='text-center text-black'>No Search Results</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>


            <div className='max-w-[10%] flex justify-end mr-10 items-center gap-12 hide-section '>


                {cookie && (
                    <ul className='flex justify-around items-center w-[]'>
                        <li>
                            <Link to='/profile' activeclassname="active" className='flex items-center h-full w-10 hover:w-[2.4rem]'>
                                <img src={userData && userData.profilePic && userData.profilePic.url ? userData.profilePic.url : "https://res.cloudinary.com/dmb0ooxo5/image/upload/v1706984465/ftfdy0ic7ftz2awihjts.jpg"} referrerPolicy="no-referrer" className='rounded-full' alt='Profile' />
                            </Link>
                        </li>
                        <Link className='over' id='link' to='/orders'><span data-hover="ORDERS">Orders</span></Link>
                        <li><Link className='text-lg text-[#a09676] flex gap-1 items-center p-2 hover:scale-[1.1] hover:text-[#dfcba7]' to='/cart'><MdShoppingCart className='text-2xl' /><span>{totalQuantity || "0"}</span></Link></li>
                    </ul>
                )}

            </div>


            {/* normal nav-bar auth buttons*/}

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

            {/*mobile hambuger menu section*/}

            {!isMobileMenuOpen ? <MdMenu className={'text-3xl cursor-pointer self-center hamburger mr-5 '} onClick={toggleMobileMenu} /> : <MdOutlineClose className={'text-3xl cursor-pointer self-center hamburger '} onClick={toggleMobileMenu} />}

            {
                isMobileMenuOpen && (cookie ? (
                    <div className="mobile-menu text-black" style={{ animationName: isMobileMenuOpen ? 'slidein' : 'slideout' }}>
                        <ul >
                            <li className='flex items-center cursor-pointer w-full h-[6vh]'>
                                <div className='flex items-center justify-start w-full gap-2 px-4'>
                                    <NavLink to='/profile' activeclassname="active" className='flex items-center h-full w-10' onClick={toggleMobileMenu} >
                                        <img src={userData.profilePic ? userData.profilePic.url : "https://res.cloudinary.com/dmb0ooxo5/image/upload/v1706984465/ftfdy0ic7ftz2awihjts.jpg"} className='rounded-full' alt='Profile' />
                                    </NavLink>
                                    <p className='text-lg'>{userData.name}</p>
                                </div>
                                <div className='flex items-center justify-end'>
                                    <Link className='text-lg text-[#474640] flex gap-2 items-center p-2 hover:text-[#1d1d1d]' to='/cart' onClick={toggleMobileMenu}>
                                        <MdShoppingCart className='text-2xl' />
                                        <span>{totalQuantity || "0"}</span>
                                    </Link>
                                </div>
                            </li>

                            <li><div className='w-full h-[6vh] text-4xl flex items-center p-4 gap-2 ' onClick={toggleMobileMenu}><FaBoxOpen />
                                <span className='text-lg '  > <p >Your Orders</p></span>
                            </div></li>

                            <li> <Link to="/login" className='flex w-full h-[6vh]  p-4 items-center gap-2 text-4xl' onClick={handleLogout}><MdLogout /><span className='text-lg'><p>Logout</p></span>
                            </Link></li>
                        </ul>
                    </div>
                ) : (<div className="mobile-menu" style={{ animationName: isMobileMenuOpen ? 'slidein' : 'slideout' }}>
                    <ul>


                        <li> <Link to="/signup" className='flex w-full h-[6vh]  p-4 items-center gap-2 text-4xl' onClick={toggleMobileMenu} ><MdAccountCircle />
                            <span className='text-lg'><p>Sign up</p></span>
                        </Link></li>
                        <li> <Link to="/login" className='flex w-full h-[6vh]  p-4 items-center gap-2 text-4xl' onClick={toggleMobileMenu} ><RiLoginCircleFill />


                            <span className='text-lg'><p>Login</p></span>
                        </Link></li>
                        <li> <Link to="/help" className='flex w-full h-[6vh]  p-4 items-center gap-2 text-4xl' onClick={toggleMobileMenu}><IoIosHelpCircle />
                            <span className='text-lg'><p>Help</p></span>
                        </Link></li>
                    </ul>
                </div>))
            }


        </div>
    );
};

export default Navbar;