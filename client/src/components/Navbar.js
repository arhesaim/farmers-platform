import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    return (
        <nav>
            <ul>
                <li><Link to="/">Farmer Platform</Link></li>
                {!isAuthenticated && <li><Link to="/register">Register</Link></li>}
                {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAuthenticated && <li><Link to="/create-product">Create Product</Link></li>}
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/search">Browse</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;