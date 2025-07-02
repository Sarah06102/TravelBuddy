import React, { useEffect, useState } from 'react';

const WeatherWidget = ({ destination }) => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState("");
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
 
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${destination}&limit=1&appid=${API_KEY}`);
                const geoData = await geoRes.json();
                if (!geoData.length) throw new Error("Location not found");
                const { lat, lon } = geoData[0];
    
                const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
                const currentData = await currentRes.json();
                setCurrentWeather(currentData);
    
                const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
                const forecastData = await forecastRes.json();
    
                const dailyForecasts = forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 5);
                setForecast(dailyForecasts);
            } catch (err) {
                console.error("Error:", err);
                setError("Failed to load weather.");
            }
        };
 
        if (destination) fetchWeather();
    }, [destination]);
 
    if (error) return <p className="text-red-500">{error}</p>;
    if (!currentWeather || forecast.length === 0) return <p>Loading weather...</p>;
 
    return (
        <div className="mt-4 mb-5 bg-blue-50 p-4 pb-6 rounded-xl shadow max-w-full">
            <h2 className="text-sm font-bold mb-3 pl-1">5-Day Forecast</h2>

            <div className="flex overflow-x-auto gap-3 px-1 pb-1 scrollbar-hide">
                {forecast.map((day, index) => {
                    const dateObj = new Date(day.dt * 1000);
                    const dateStr = dateObj.toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    });
                    const dayStr = dateObj.toLocaleDateString(undefined, {
                        weekday: 'long',
                    });

                    return (
                        <div key={index} className="min-w-[100px] flex-shrink-0 bg-white rounded-2xl px-3 py-4 text-center shadow-md">
                            <p className="text-[10px] font-semibold">{dateStr}</p>
                            <p className="text-xs text-gray-500 mb-2">{dayStr}</p>
                            <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description} className="w-10 h-10 mx-auto mb-2"/>
                            <div className="text-sm font-semibold">
                                {Math.round(day.main.temp_max)}°C / {Math.round(day.main.temp_min)}°C
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1 capitalize">
                                {day.weather[0].main}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
 
export default WeatherWidget;
 