import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length > 0) {
                try {
                    const response = await api.get(`/search?q=${query}`);
                    setSuggestions(response.data);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setSuggestions([]);
            }
        };
        fetchSuggestions();
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((product) => (
                        <li key={product.id}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;