import React, { useEffect, useState } from 'react';
import DashboardNavBar from '../components/DashboardNavBar'
import { FaPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoMdStats } from "react-icons/io";
import CreateTripModal from './CreateTripModal';
import TripList from '../components/TripsList';
import { useNavigate } from 'react-router-dom';
import TravelTips from '../components/TravelTips';

const Dashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refreshTrips, setRefreshTrips] = useState(false);
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  const [selectedTrip, setSelectedTrip] = useState(null);

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
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };
    fetchUser();
  }, [])

  const handleTripCreated = () => {
    setRefreshTrips((prev) => !prev);
  };

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
  
  useEffect(() => {
    fetchTrips();
  }, [refreshTrips]);

  const totalTrips = trips.length;
  const completed = trips.filter(t => t.status === 'Completed').length;
  const upcoming = trips.filter(t => t.status === 'Upcoming').length;
  const totalBudget = trips.reduce((sum, t) => sum + t.budget, 0);

  return (
    <>
      <DashboardNavBar />

      {/* Greeting */}
      <div className="border border-gray-300 px-10 py-8">
        <div className="flex items-center justify-between">

          {/* Left: Welcome text */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
            <p className="text-gray-500">Plan your next adventure or manage existing trips.</p>
          </div>

          {/* Right: Buttons */}
          <div className="flex gap-4">
            <button onClick={() => navigate(`/budget-planner`)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer">Plan your trip budget</button>
            <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">+ New Trip</button>
          </div>

        </div>
      </div>

      <div className="min-h-screen bg-[#f8f9fc] py-10 px-6">
        {/* Stats */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Trips */}
            <div className="bg-white shadow-md border border-gray-300 rounded-xl p-6 flex items-center gap-4">
              <div className="text-blue-500 text-3xl">📍</div>
              <div>
                <p className="text-gray-500 font-medium">Total Trips</p>
                <p className="text-2xl font-semibold text-gray-900">{totalTrips}</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white shadow-md border border-gray-300 rounded-xl p-6 flex items-center gap-4">
              <div className="text-blue-500 text-3xl">📍</div>
              <div>
                <p className="text-gray-500 font-medium">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completed}</p>
              </div>
            </div>

            {/* Upcoming Trips */}
            <div className="bg-white shadow-md border border-gray-300 rounded-xl p-6 flex items-center gap-4">
              <div className="text-yellow-500 text-3xl">⏰</div>
              <div>
                <p className="text-gray-500 font-medium">Upcoming Trips</p>
                <p className="text-2xl font-semibold text-gray-900">{upcoming}</p>
              </div>
            </div>

            {/* Total Budget */}
            <div className="bg-white shadow-md border border-gray-300 rounded-xl p-6 flex items-center gap-4">
              <div className="bg-purple-100 text-purple-600 rounded-lg p-2 text-2xl">$</div>
              <div>
                <p className="text-gray-500 font-medium">Total Budget</p>
                <p className="text-sm mt-1 text-green-600">${totalBudget ? totalBudget.toFixed(2) : '0.00'} Budget</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trips */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-8 mt-10">
          <h1 className="text-xl font-semibold mb-6 text-left">Your Trips</h1>
          <TripList trips={trips} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-8 mt-10">
          <h1 className="text-xl font-semibold mb-6">Quick Actions</h1>

          {/* Create New Trip */}
          <button onClick={() => setShowModal(true)} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-blue-100 transition cursor-pointer">
            <div className="bg-blue-100 p-2 rounded-xl flex items-center justify-center">
              <FaPlus className="text-blue-600"/>
            </div>
            <span className="text-gray-900 font-medium">Create New Trip</span>
          </button>

          {/* Explore Destinations */}
          <button onClick={() => navigate("/explore-destinations")} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-green-100 transition mt-4 cursor-pointer">
            <div className="bg-green-100 p-2 rounded-xl">
              <IoIosSearch className="text-green-600"/>
            </div>
            <span className="text-gray-900 font-medium">Explore Destinations</span>
          </button>

          {/* View Travel Stats */}
          <button onClick={() => navigate("/travel-stats", { state: { trips } })} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl hover:bg-orange-100 transition mt-4 cursor-pointer">
            <div className="bg-orange-100 p-2 rounded-xl">
              <IoMdStats className="text-orange-600"/>
            </div>
            <span className="text-gray-900 font-medium">View Travel Stats</span>
          </button>
        </div>

        {/* Travel Tips */}
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-8 mt-10">
          <h1 className="text-xl font-semibold mb-4 text-left">Travel Tips</h1>

          {/* Trip Selector */}
          <div className="mb-4">
            <label htmlFor="tripSelect" className="block mb-1 text-sm font-medium text-gray-700">Select a Trip</label>
            <select id="tripSelect" onChange={(e) => {
                const tripId = e.target.value;
                const trip = trips.find(t => t._id === tripId);
                setSelectedTrip(trip || null);
              }} className="w-full p-2 border border-gray-300 rounded">
              <option value="">-- Choose a trip --</option>
                {trips.map(trip => (
                  <option key={trip._id} value={trip._id}>{trip.name}</option>
                ))}
            </select>
          </div>

          {/* Travel Tips Component */}
          <TravelTips selectedTrip={selectedTrip} />
        </div>
        <CreateTripModal isOpen={showModal} onTripCreated={handleTripCreated} onClose={() => setShowModal(false)} />
      </div>
    </>
  )
}

export default Dashboard