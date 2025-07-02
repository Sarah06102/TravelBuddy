import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardNavBar = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
            const res = await fetch("http://localhost:3000/api/user", {
                method: 'GET',
                headers: {
                'Content-type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (!res.ok) throw new Error('Failed to fetch user');

            const data = await res.json();
            console.log("Fetched user data:", data);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
            } catch (error) {
            console.error('Error fetching user', error);
            }
        };
        fetchUser();
    }, [])

    const handleNavigation = (path) => navigate(`/${path}`);

    const handleSignOut = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/signout', {
                method: 'POST',
                credentials: 'include',
            });

            if (res.ok) {
                localStorage.removeItem('token');
                window.location.href = '/';
            } else {
                console.error('Sign out failed');
            }
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    return (
        <div className="bg-gradient-to-r from-indigo-300 to-violet-600 rounded-full m-4 p-4 flex justify-between items-center">
            {/* Left: Logo */}
            <button onClick={() => handleNavigation('dashboard')} className="font-bold text-white text-xl cursor-pointer">TravelBuddy</button>

            {/* Right: Name and Sign Out */}
            <div className="flex items-center gap-4">
                <p className="text-white">{firstName} {lastName} | {email}</p>
                <button onClick={handleSignOut} className="font-medium text-white border border-white rounded-full px-4 py-1 cursor-pointer hover:bg-white hover:text-blue-700 transition-all duration-300">Sign Out</button>
            </div>
        </div>
    )
}

export default DashboardNavBar;