import React from 'react'
import NavBar from '../components/NavBar'
import { CiMap } from 'react-icons/ci';
import { FiMapPin } from 'react-icons/fi';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPeople } from 'react-icons/go';
import { MdOutlineWifiOff } from 'react-icons/md';
import { MdNotificationsNone } from 'react-icons/md';

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <section className="p-60 bg-linear-65 from-indigo-300 to-violet-600">
        <div className="flex items-center flex-col gap-7">
          <h1 className="text-5xl font-bold text-white text-center">Plan Your Perfect Journey</h1>
          <h2 className="text-center text-white text-lg">Discover amazing destinations, create detailed itineraries, and make unforgettable memories with our comprehensive travel planning platform.</h2>
          <div className="flex gap-7">
            <button className="bg-white text-blue-700 font-bold rounded-xl p-3 px-7 cursor-pointer hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all ease-in-out duration-300">Start Planning now</button>
            <button className="text-white rounded-xl p-3 font-bold px-7 border-2 border-white cursor-pointer hover:bg-white hover:text-blue-700 transition-all ease-in-out duration-300">Explore Destinations</button>
          </div>
        </div>
      </section>

      <section className="p-40">
        <div>
          <h1 className="font-bold text-4xl text-center">Everything You Need To <span className="text-cyan-500">Travel Smart</span></h1>
          <h2 className="text-center pt-7 pb-15">Our comprehensive platform provides all the tools you need to create, organize, and enjoy amazing travel experiences.</h2>
          <div className="flex flex-col gap-10">
            <div className="bg-blue-50 p-10 rounded-xl">
              <div className="flex items-center gap-3">
                <CiMap size={35} className="bg-blue-400 rounded-sm text-white p-1.5"/>
                <h1 className="text-xl font-bold">Smart Itinerary Builder</h1>
              </div>
              <p className="pt-3 text-gray-500">Create detailed day-to-day itineraries with our intelligent planning system. Add activities, restaurants, and attractions with optimal routing.</p>
            </div>

            <div className="bg-green-50 p-10 rounded-xl">
              <div className="flex items-center gap-3">
                <FiMapPin size={35} className="bg-green-500 rounded-sm text-white p-2"/>
                <h1 className="text-xl font-bold">Destination Discovery</h1>
              </div>
              <p className="pt-3 text-gray-500">Explore curated destinations with insider tips, local recommedations, and hidden gems from our global community of travelers.</p>
            </div>

            <div className="bg-orange-50 p-10 rounded-xl">
              <div className="flex items-center gap-3">
                <BsCurrencyDollar size={35} className="bg-orange-500 rounded-sm text-white p-2"/>
                <h1 className="text-xl font-bold">Budget Tracking</h1>
              </div>
              <p className="pt-3 text-gray-500">Keep your expenses in check with our comprehensive budget tracking system. Set limits, track spending, and get insights.</p>
            </div>
          
            <div className="bg-purple-50 p-10 rounded-xl">
              <div className="flex items-center gap-3">
                <GoPeople size={35} className="bg-purple-500 rounded-sm text-white p-2"/>
                <h1 className="text-xl font-bold">Collaborative Planning</h1>
              </div>
              <p className="pt-3 text-gray-500">Plan together with friends and family. Share itineraries, vote on activities, and coordinate your group travel seamlessly.</p>
            </div>

            <div className="bg-red-50 p-10 rounded-xl">
              <div className="flex items-center gap-3">
                <MdOutlineWifiOff size={35} className="bg-red-500 rounded-sm text-white p-2"/>
                <h1 className="text-xl font-bold">Offline Access</h1>
              </div>
              <p className="pt-3 text-gray-500">Access your travel plans even without internet connection. Download maps, itineraries, and important information for offline use.</p>
            </div>

            <div className="bg-cyan-50 p-10 rounded-xl">
              <div className="flex items-center gap-3">
                <MdNotificationsNone size={35} className="bg-cyan-500 rounded-sm text-white p-1.5"/>
                <h1 className="text-xl font-bold">Real Time Updates</h1>
              </div>
              <p className="pt-3 text-gray-500">Get instant notifications about flight changes, weather updates, and local events that might affect your travel plans.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="p-30 bg-indigo-950">
        <div className="flex items-center flex-col gap-7">
          <h1 className="font-bold text-4xl text-center text-white">Ready to Start Your Journey?</h1>
          <h2 className="text-lg text-center text-white">Join thousands of travelers who trust TravelBuddy to make their journeys unforgettable. Start planning your next trip today!</h2>
          <div className="flex gap-7">
            <button className="bg-white text-blue-700 font-bold rounded-xl p-3 px-7 cursor-pointer hover:bg-transparent hover:text-white hover:border-2 hover:border-white transition-all ease-in-out duration-300">Get Started now</button>
            <button className="text-white rounded-xl p-3 font-bold px-7 border-2 border-white cursor-pointer hover:bg-white hover:text-blue-700 transition-all ease-in-out duration-300">View Demo</button>
          </div>
        </div>
      </section>

      <section className="bg-indigo-950 border-t border-white p-2">
        <div>
          <p className="text-white text-left">© 2025 TravelBuddy. All rights reserved</p>
        </div>
      </section>
    </>
  )
}

export default LandingPage