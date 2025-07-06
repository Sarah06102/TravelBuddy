import React, { useState } from 'react'

const TravelTips = ({ selectedTrip }) => {
    const [travelTips, setTravelTips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchAITips = async () => {
        if (!selectedTrip?.destination) {
            setError("Please select a trip with a destination first.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:3000/api/tips/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ destination: selectedTrip.destination }),
            });

            if (!res.ok) throw new Error("Failed to fetch tips");

            const data = await res.json();
            setTravelTips(data);
        } catch (err) {
            console.error(err);
            setError("Could not load travel tips.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-b from-white to-gray-100 p-6 rounded-2xl shadow-lg mt-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                Travel Tips for <span className="text-blue-600">{selectedTrip?.destination}</span>
            </h2>

            <button onClick={fetchAITips} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition-all duration-200 mb-6 cursor-pointer">
                Generate Tips
            </button>

            {loading && <p className="text-blue-500 animate-pulse">Generating tips...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {travelTips.length > 0 ? (
                <ul className="space-y-4">
                    {travelTips.map((tip, index) => (
                        <li key={index} className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm text-gray-700 hover:bg-gray-50 transition-all duration-200">
                            <span className="font-semibold text-blue-600 mr-2">{index + 1}.</span> {tip.tip || tip}
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p className="text-gray-500 italic">No tips yet. Click above to generate some!</p>
            )}
        </div>
    );
};

export default TravelTips