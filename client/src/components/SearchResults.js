import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get(`/search?q=${query}`);
                setResults(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchResults();
    }, [query]);

    return (
        <div>
            <h2>Search Results for "{query}"</h2>
            <ul>
                {results.map((product) => (
                    <li key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <img src={product.image_url} alt={product.name} />
                        <p>Category: {product.category}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;