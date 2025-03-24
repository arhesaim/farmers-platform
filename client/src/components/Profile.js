import React, { useState, useEffect } from 'react';
import api from '../api';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile', {
                    headers: { Authorization: localStorage.getItem('token') }
                });
                setProfile(response.data);
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setPhone(response.data.phone);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/profile', { first_name: firstName, last_name: lastName, phone }, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            alert('Profile updated successfully');
        } catch (err) {
            console.error(err);
            alert('Profile update failed');
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Username: </label>
                    <span>{profile.username}</span>
                </div>
                <div>
                    <label>Email: </label>
                    <span>{profile.email}</span>
                </div>
                <div>
                    <label>First Name: </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Last Name: </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Phone: </label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;