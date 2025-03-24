import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import CreateProduct from './components/CreateProduct';
import UpdateProduct from './components/UpdateProduct';
import DeleteProduct from './components/DeleteProduct';
import Products from './components/Products';
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
                <Route path="/products" element={<Products />} />
                <Route path="/create-product" element={<ProtectedRoute element={CreateProduct} />} />
                <Route path="/update-product/:id" element={<ProtectedRoute element={UpdateProduct} />} />
                <Route path="/delete-product/:id" element={<ProtectedRoute element={DeleteProduct} />} />
            </Routes>
        </Router>
    );
};

export default App;