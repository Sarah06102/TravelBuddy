import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import Itinerary from './Itinerary';
import PackingList from './PackingList';
import TravelJournal from './TravelJournal';
import WeatherWidget from './WeatherWidget';
import ExploreDestinations from '../pages/ExploreDestinations';
import TravelStats from '../pages/TravelStats';

export const Router = createBrowserRouter([
    { path: "/", element: <LandingPage />}, 
    { path: "dashboard", element: <Dashboard />}, 
    { path: "trip/:tripId/itinerary", element: <Itinerary />},
    { path: "trip/:tripId/packing-list", element: <PackingList /> },
    { path: "trip/:tripId/journal", element: <TravelJournal />},
    { path: "trip/:tripId/weather", element: <WeatherWidget />},
    { path: "explore-destinations", element: <ExploreDestinations />},
    { path: "travel-stats", element: <TravelStats />},
]);

export default Router