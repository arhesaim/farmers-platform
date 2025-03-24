import React from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const DeleteProduct = () => {
    const { id } = useParams();

    const handleDelete = async () => {
        try {
            await api.delete(`/products/${id}`);
            alert('Product deleted successfully');
        } catch (err) {
            console.error(err);
            alert('Product deletion failed');
        }
    };

    return (
        <button onClick={handleDelete}>Delete Product</button>
    );
};

export default DeleteProduct;