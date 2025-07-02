import React, { useState, useEffect } from 'react';
import EditTripModal from '../pages/EditTripModal';
import { useNavigate } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';

const TripList = ({ trips }) => {
    const [imageUrls, setImageUrls] = useState({});
    const [editingTrip, setEditingTrip] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            const newImageUrls = {};
            for (const trip of trips) {
                if (!imageUrls[trip._id]) {
                    try {
                        const res = await fetch(`https://api.unsplash.com/search/photos?query=${trip.destination}&client_id=${import.meta.env.VITE_UNSPLASH_API_KEY}`);
                        const data = await res.json();
                        newImageUrls[trip._id] = data.results[0]?.urls?.regular || null;
                    } catch (err) {
                        console.error(`Failed to fetch image for ${trip.destination}`);
                    }
                }
            }
            setImageUrls(prev => ({ ...prev, ...newImageUrls }));
        };

        if (trips.length) {
            fetchImages();
        }
    }, [trips]);

    const handleEditTrip = (trip) => {
        setEditingTrip(trip);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/trips/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.ok) {
                window.location.reload();
            } else {
                console.error("Failed to delete trip");
            }
        } catch (error) {
            console.error("Error deleting trip", error);
        }
    };

    if (!trips.length) {
        return (
            <>
                <p className="text-lg font-medium text-gray-700">No trips yet</p>
                <p className="text-sm mb-4">Start planning your first adventure!</p>
            </>
        );
    }
    
    const generateGoogleCalendarUrl = (trip) => {
        const start = new Date(trip.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = new Date(trip.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "");

        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: trip.name,
            dates: `${start}/${end}`,
            details: trip.description || `Trip to ${trip.destination}`,
            location: trip.destination,
            trp: "false",
        });
        return `https://www.google.com/calendar/render?${params.toString()}`;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 px-4">
            {trips.map((trip) => (
                <div key={trip._id} className="relative bg-white p-4 rounded-xl shadow-md border border-gray-200">
                    {imageUrls[trip._id] ? (
                        <img src={imageUrls[trip._id]} alt={trip.destination} className="w-full h-40 object-cover rounded-lg mb-3"/>
                        ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm">
                            Loading image...
                        </div>
                    )}
                    <div className="flex justify-between items-start mt-2">
                        <div>
                            <h2 className="text-xl font-semibold">{trip.name}</h2>
                            <p className="text-sm text-gray-600">{trip.destination}</p>
                        </div>
                        <button onClick={() => window.open(generateGoogleCalendarUrl(trip), '_blank')} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition shadow-sm cursor-pointer">
                            📅 Sync to Calendar
                        </button>
                    </div>
                    <p className="text-sm mt-1">{trip.startDate} → {trip.endDate}</p>
                    <p className="text-sm mt-1 font-medium">
                        Status:  
                        <span className={
                            `${trip.status === "Planning" ? "text-yellow-600" :
                            trip.status === "Upcoming" ? "text-blue-600" :
                            trip.status === "Ongoing" ? "text-green-600" :
                            "text-gray-600"} ml-1`
                        }>
                            {trip.status}
                        </span> 
                    </p>
                    <p className="text-sm mt-1 text-green-600">${typeof trip.budget === 'number' ? trip.budget.toFixed(2) : '0.00'} Budget</p>
                    {trip.status === "Completed" && trip.actualSpent != null && (
                        <div className="mt-2">
                            <label className="block text-sm font-medium">Actual Spent</label>
                            <p className="mt-1 text-gray-800 text-sm font-semibold">${trip.actualSpent?.toFixed(2) || "0.00"}</p>
                        </div>
                    )}

                    <WeatherWidget destination={trip.destination} />
                    <button onClick={() => navigate(`/trip/${trip._id}/itinerary`)} className="text-sm text-white bg-indigo-500 px-3 py-1 rounded-full hover:bg-indigo-600 transition cursor-pointer">Itinerary</button>
                    <button onClick={() => navigate(`/trip/${trip._id}/packing-list`)} className="text-sm text-white bg-purple-500 px-3 py-1 rounded-full hover:bg-purple-600 ml-4 transition cursor-pointer">Packing List</button>
                    <button onClick={() => navigate(`/trip/${trip._id}/journal`)} className="text-sm text-white bg-yellow-500 px-3 py-1 rounded-full hover:bg-yellow-600 ml-4 transition cursor-pointer">Journal</button>
                    <button onClick={() => handleEditTrip(trip)} className="text-sm text-white bg-blue-500 px-3 py-1 rounded-full hover:bg-blue-600 transition ml-4 cursor-pointer">Edit Trip</button>
                    {isModalOpen && (
                        <EditTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} trip={editingTrip} 
                        onTripUpdated={() => {
                            setIsModalOpen(false);
                            window.location.reload();
                        }}/>
                    )}

                    <button onClick={() => {
                        if (window.confirm('Are you sure you want to delete this trip?')) {
                            handleDelete(trip._id);
                        }
                    }} className="mt-3 text-white bg-red-500 px-3 py-1 hover:bg-red-600 rounded-full transition text-sm cursor-pointer ml-4">Delete Trip</button>    
                </div>
            ))}
        </div>
    );
};

export default TripList;
