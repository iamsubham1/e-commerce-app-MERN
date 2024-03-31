import React, { useState, useEffect } from 'react';

const Navbar = ({ activeSection }) => {
    const [activeLink, setActiveLink] = useState(activeSection);

    useEffect(() => {
        setActiveLink(activeSection);
    }, [activeSection]);

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    const navbarClass = activeLink === "About" ? "aboutActive" : "";

    return (
        <div id='navbarContainer' className={navbarClass}>
            <ul>
                {["Home", "About", "Projects", "Contact",].map((linkName) => {
                    const isAboutActiveAndNotCurrentLink = activeLink === "About" && activeLink !== linkName;

                    const linkStyle = {
                        color: activeLink === linkName ? "white" : isAboutActiveAndNotCurrentLink ? "#9DC32F" : "initial",
                        transition: 'color 0.3s ease-in-out, transform 0.8s ease-in-out',
                        transform: activeLink === linkName ? 'translateX(0)' : 'translateX(-100%)',
                    };

                    const listItemStyle = {
                        backgroundColor: "transparent",
                    };

                    return (
                        <li key={linkName} style={listItemStyle} >
                            <a href={`#${linkName}`} style={linkStyle} onClick={() => handleLinkClick(linkName)} className='relative' >
                                {linkName.toUpperCase()}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Navbar;