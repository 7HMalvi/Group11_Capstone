import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../../image/logo.png';
import { LogoutAPI } from '../../services/APIRoutes';

export default function Navbar({ userType }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem("userToken");
        if (!token) {
            navigate("/login");
        } else {
            setProfileImage(localStorage.getItem("userProfile"));
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch(LogoutAPI, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                localStorage.removeItem('userToken');
                navigate("/login", { replace: true });
            } else {
                const data = await response.json();
                console.error('Logout error:', data.error);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-black shadow-red">
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none"
                            aria-expanded="false"
                            onClick={toggleMobileMenu}
                        >
                            <span className="sr-only">Open main menu</span>
                            <FontAwesomeIcon icon={faBars} className="block h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0">
                            <NavLink to={userType === "admin" ? "/dashboard" : "/home"}>
                                <img className="h-10 w-auto" src={logoImg} alt="Logo" />
                            </NavLink>
                        </div>
                        <div className="hidden content-center sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                <NavLink
                                    to={userType === "admin" ? "/dashboard" : "/home"}
                                    className={({ isActive }) => isActive ? "text-red-600 px-3 py-2 text-sm font-medium" : "text-white hover:text-red-600 px-3 py-2 text-sm font-medium"}
                                >
                                    {userType === "admin" ? "Dashboard" : "Home"}
                                </NavLink>
                                {userType === "admin" && (
                                    <>
                                        <NavLink
                                            to="/song"
                                            className={({ isActive }) => isActive ? "text-red-600 px-3 py-2 text-sm font-medium" : "text-white hover:text-red-600 px-3 py-2 text-sm font-medium"}
                                        >
                                            Song
                                        </NavLink>
                                        <NavLink
                                            to="/data"
                                            className={({ isActive }) => isActive ? "text-red-600 px-3 py-2 text-sm font-medium" : "text-white hover:text-red-600 px-3 py-2 text-sm font-medium"}
                                        >
                                            Data
                                        </NavLink>
                                    </>
                                )}
                                {userType !== "admin" && (
                                    <>
                                        <NavLink
                                            to="/playlist"
                                            className={({ isActive }) => isActive ? "text-red-600 px-3 py-2 text-sm font-medium" : "text-white hover:text-red-600 px-3 py-2 text-sm font-medium"}
                                        >
                                            Playlist
                                        </NavLink>
                                        <NavLink
                                            to="/upload"
                                            className={({ isActive }) => isActive ? "text-red-600 px-3 py-2 text-sm font-medium" : "text-white hover:text-red-600 px-3 py-2 text-sm font-medium"}
                                        >
                                            Upload
                                        </NavLink>
                                        <NavLink
                                            to="/search"
                                            className={({ isActive }) => isActive ? "text-red-600 px-3 py-2 text-sm font-medium" : "text-white hover:text-red-600 px-3 py-2 text-sm font-medium"}
                                        >
                                            <FontAwesomeIcon icon={faSearch} className="mr-1" />
                                            Search
                                        </NavLink>
                                        <NavLink
                                            to="/pro"
                                            className={"text-white bg-red-600 px-3 py-1 text-lg font-medium rounded"}
                                        >
                                            Pro
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Profile dropdown */}
                        <div className="ml-3 relative">
                            <button
                                className="flex text-sm rounded-full focus:outline-none"
                                onClick={toggleDropdown}
                            >
                                <span className="sr-only">Open user menu</span>
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            </button>
                            {dropdownOpen && (
                                <div className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                                    <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-red-600" role="menuitem">Profile</NavLink>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-red-600" role="menuitem">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavLink
                            to={userType === "admin" ? "/dashboard" : "/home"}
                            className={({ isActive }) => isActive ? "text-red-600 block px-3 py-2 text-base font-medium" : "text-white hover:text-red-600 block px-3 py-2 text-base font-medium"}
                        >
                            {userType === "admin" ? "Dashboard" : "Home"}
                        </NavLink>
                        {userType === "admin" && (
                            <>
                                <NavLink
                                    to="/song"
                                    className={({ isActive }) => isActive ? "text-red-600 block px-3 py-2 text-base font-medium" : "text-white hover:text-red-600 block px-3 py-2 text-base font-medium"}
                                >
                                    Song
                                </NavLink>
                                <NavLink
                                    to="/data"
                                    className={({ isActive }) => isActive ? "text-red-600 block px-3 py-2 text-base font-medium" : "text-white hover:text-red-600 block px-3 py-2 text-base font-medium"}
                                >
                                    Data
                                </NavLink>
                            </>
                        )}
                        {userType !== "admin" && (
                            <>
                                <NavLink
                                    to="/playlist"
                                    className={({ isActive }) => isActive ? "text-red-600 block px-3 py-2 text-base font-medium" : "text-white hover:text-red-600 block px-3 py-2 text-base font-medium"}
                                >
                                    Playlist
                                </NavLink>
                                <NavLink
                                    to="/upload"
                                    className={({ isActive }) => isActive ? "text-red-600 block px-3 py-2 text-base font-medium" : "text-white hover:text-red-600 block px-3 py-2 text-base font-medium"}
                                >
                                    Upload
                                </NavLink>
                                <NavLink
                                    to="/search"
                                    className={({ isActive }) => isActive ? "text-red-600 block px-3 py-2 text-base font-medium" : "text-white hover:text-red-600 block px-3 py-2 text-base font-medium"}
                                >
                                    <FontAwesomeIcon icon={faSearch} className="mr-1" />
                                    Search
                                </NavLink>
                                <NavLink
                                    to="/pro"
                                    className={"text-white bg-red-600 block px-3 py-1 text-base font-medium rounded"}
                                >
                                    Pro
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
