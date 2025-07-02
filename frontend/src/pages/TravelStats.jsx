import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Globe, Clock3, DollarSign } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const TravelStats = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [view, setView] = useState('bar');

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/trips", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                setTrips(data);
            } catch (err) {
                console.error("Failed to fetch trips", err);
            }
        };
        fetchTrips();
    }, []);

    if (!trips || trips.length === 0) {
        return (
            <div className="p-6 space-y-4">
                <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 cursor-pointer"> ← Back to Dashboard</button>
                <h2 className="text-2xl font-bold mb-2">Your Travel Stats</h2>
                <p className="text-gray-500">No trips yet. Start planning to see your stats!</p>
            </div>
        );
    }

    const totalDays = trips.reduce((sum, trip) => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        return sum + Math.round((end - start) / (1000 * 60 * 60 * 24));
    }, 0);

    const uniqueCountries = new Set(trips.map(t => t.destination)).size;

    const destinations = trips.map(trip => trip.destination);
    const plannedBudgets = trips.map(trip => trip.budget || 0);
    const actualSpends = trips.map(trip => trip.status === "Completed" ? trip.actualSpent || 0 : null); 

    const barData = {
        labels: trips.map(t => t.destination),
        datasets: [
            {
                label: 'Planned Budget',
                data: plannedBudgets,
                backgroundColor: 'rgba(147, 197, 253, 0.8)', // Blue
            },
            {
                label: 'Actual Spent',
                data: actualSpends,
                backgroundColor: 'rgba(252, 165, 165, 0.8)', // Pink
            }
        ]
    };

    const pieData = {
        labels: destinations,
        datasets: [{
            data: plannedBudgets,
            backgroundColor: [
                '#93c5fd', '#fca5a5', '#fdba74', '#6ee7b7', '#a78bfa', '#f9a8d4', '#34d399'
            ]
        }]
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: { boxWidth: 20 }
            }
        },
        maintainAspectRatio: false
    };

    const stackedBarData = {
        labels: trips.map(t => t.destination),
        datasets: [
            {
                label: 'Planned Budget',
                data: plannedBudgets,
                backgroundColor: '#60a5fa',
            },
            {
                label: 'Actual Spent',
                data: actualSpends,
                backgroundColor: '#f87171',
            }
        ]
    };

    const stackedBarOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Stacked Spending' }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
    };

    const lineData = {
        labels: trips.map(t => new Date(t.startDate).toLocaleDateString()),
        datasets: [
            {
                label: 'Planned Budget',
                data: plannedBudgets,
                fill: false,
                borderColor: '#3b82f6',
                tension: 0.2
            },
            {
                label: 'Actual Spent',
                data: actualSpends,
                fill: false,
                borderColor: '#f87171',
                tension: 0.2
            }
        ]
    };
      
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Spending Over Time' }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="p-6 space-y-8">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 cursor-pointer"> ← Back to Dashboard</button>
            <h2 className="text-2xl font-bold">Your Travel Stats</h2>

            <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white border p-4 rounded-xl shadow flex items-center gap-3">
                    <Clock3 className="w-6 h-6 text-indigo-600" />
                    <div>
                        <p className="text-lg font-semibold">{totalDays} Days</p>
                        <p className="text-sm text-gray-500">Total Time Traveled</p>
                    </div>
                </div>
                <div className="bg-white border p-4 rounded-xl shadow flex items-center gap-3">
                    <Globe className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="text-lg font-semibold">{uniqueCountries} Countries</p>
                        <p className="text-sm text-gray-500">Visited</p>
                    </div>
                </div>
                <div className="bg-white border p-4 rounded-xl shadow flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                    <div>
                        <p className="text-lg font-semibold">${actualSpends.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4 capitalize">{view} Overview</h3>
                <div className="flex gap-2 flex-wrap text-sm mb-5">
                    {['bar', 'line', 'pie', 'stacked'].map(type => (
                        <button key={type} onClick={() => setView(type)} className={`px-3 py-1 rounded-full border cursor-pointer ${view === type ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                        </button>
                    ))}
                </div>
                {view === 'bar' && (
                    <div className="flex justify-center items-center" style={{ height: '500px' }}>
                        <Bar data={barData} />
                    </div>
                )}

                {view === 'line' && (
                    <div className="flex justify-center items-center" style={{ height: '500px' }}>
                        <Line data={lineData} options={lineOptions} />
                    </div>
                )}
            
                {view === 'pie' && (
                    <div className="flex justify-center items-center" style={{ height: '500px' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                )}

                {view === 'stacked' && (
                    <div className="flex justify-center items-center" style={{ height: '500px' }}>
                        <Bar data={stackedBarData} options={stackedBarOptions} />
                    </div>
                )}

            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white border p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">Budget Breakdown by Country</h3>
                    <div className="flex justify-center items-center" style={{ height: '500px' }}>
                        <Pie data={pieData} />
                    </div>
                </div>

                <div className="bg-white border p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">Trip Length + Budget + Spend</h3>
                    <div className="flex justify-center items-center" style={{ height: '500px' }}>
                        <Bar data={stackedBarData} options={stackedBarOptions} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 text-gray-500 rounded-xl h-64 flex items-center justify-center mt-6">
                🌍 Interactive Countries Map Coming Soon
            </div>
        </div>
    );
};

export default TravelStats;
