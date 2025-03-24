import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/create-product">Create Product</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;