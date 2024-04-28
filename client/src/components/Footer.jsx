import React from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../utility/getCookie';

const Footer = () => {

    const token = getCookie('JWT');
    return (
        <>
            {token && (<footer className="bg-[#1a1a1a] text-[#FAF2E2] py-8 px-4 w-full">
                <div className="mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About Project</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/about" className="hover:text-gray-400">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <a href="https://github.com/iamsubham1/e-commerce-app-MERN" className="hover:text-gray-400">
                                        GitHub Repo
                                    </a>
                                </li>
                                <li>
                                    <Link to="/projects" className="hover:text-gray-400">
                                        Other Projects
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Products</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/products/mobiles" className="hover:text-gray-400">
                                        Mobiles
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products/laptops" className="hover:text-gray-400">
                                        Laptops
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products/headphones" className="hover:text-gray-400">
                                        HeadPhones
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/blog" className="hover:text-gray-400">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faqs" className="hover:text-gray-400">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/support" className="hover:text-gray-400">
                                        Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
                            <p className="mb-4">
                                Stay up to date with our latest news and updates.
                            </p>
                            <form>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-gray-700 text-white py-2 px-4 rounded-l-lg focus:outline-none w-[60%]"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#0c0c0c] hover:bg-[#fff3d1] hover:text-black text-white py-2 px-4 rounded-r-lg focus:outline-none w-[40%]"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div>&copy; 2024 ECART Private Limited . All rights reserved.</div>
                            <div className="mt-4 md:mt-0">
                                <Link to="/privacy-policy" className="mr-4 hover:text-gray-400">
                                    Privacy Policy
                                </Link>
                                <Link to="/terms-of-service" className="hover:text-gray-400">
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>)}
        </>
    );

};

export default Footer;