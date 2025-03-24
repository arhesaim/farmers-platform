import React, { useState } from 'react';
import api from '../api';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/search?q=${query}`);
            setResults(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>
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

export default Search;