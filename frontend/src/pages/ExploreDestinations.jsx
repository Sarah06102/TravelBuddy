import React, { useEffect, useState, useMemo } from "react";
import { SlidersHorizontal, Compass, Globe, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const countryInterestMap = {
    // Europe
    "France": ["Wine", "Museums"],
    "Italy": ["Art", "Historic Sites"],
    "United Kingdom": ["Royal Attractions", "Pubs"],
    "Germany": ["Castles", "Beer"],
    "Spain": ["Beaches", "Flamenco"],
    "Portugal": ["Coastal Towns", "Port Wine"],
    "Switzerland": ["Mountains", "Luxury"],
    "Austria": ["Classical Music", "Alpine Skiing"],
    "Czech Republic": ["Beer", "Medieval Towns"],
    "Croatia": ["Coastal Towns", "Game of Thrones"],
    "Norway": ["Fjords", "Northern Lights"],
    "Sweden": ["Design", "Nature"],
    "Finland": ["Saunas", "Aurora Borealis"],
    "Greece": ["Islands", "Mythology"],
    "Netherlands": ["Tulips", "Cycling"],
    "Georgia": ["Wine", "Caucasus Mountains"],
    "Albania": ["Beaches", "Ottoman Architecture"],
    "Andorra": ["Ski Resorts", "Duty-Free Shopping"],

    // Asia
    "Japan": ["Temples", "Street Food"],
    "China": ["Great Wall", "Culture"],
    "Thailand": ["Beaches", "Night Markets"],
    "Vietnam": ["Caves", "Street Food"],
    "India": ["Spirituality", "Palaces"],
    "Indonesia": ["Beaches", "Volcanoes"],
    "Nepal": ["Himalayas", "Trekking"],
    "Sri Lanka": ["Tea Plantations", "Beaches"],
    "Singapore": ["Skyline", "Street Food"],
    "Malaysia": ["Rainforests", "Cultural Diversity"],
    "Uzbekistan": ["Silk Road", "Islamic Architecture"],
    "Jordan": ["Petra", "Desert Adventures"],
    "South Korea": ["K-Pop", "Technology"],
    "Laos": ["Caves", "Waterfalls"],
    "Mongolia": ["Steppe", "Nomadic Life"],
    "Kyrgyzstan": ["Mountains", "Lakes"],
    "Afghanistan": ["Mountains", "Silk Road History"],
    "Pakistan": ["Himalayas", "Historic Forts"],
    "Iran": ["Persian Architecture", "Deserts"],
    "Tajikistan": ["Pamir Mountains", "Adventure Trekking"],
    "Kazakhstan": ["Steppe", "Space Launch Site"],
    "Armenia": ["Ancient Churches", "Mountains"],
    "Azerbaijan": ["Mud Volcanoes", "Modern Baku"],

    // Americas
    "United States": ["Road Trips", "National Parks"],
    "Canada": ["Lakes", "Wildlife"],
    "Mexico": ["Beaches", "Mayan Ruins"],
    "Brazil": ["Carnival", "Rainforests"],
    "Argentina": ["Tango", "Glaciers"],
    "Chile": ["Stargazing", "Atacama Desert"],
    "Colombia": ["Coffee", "Colorful Towns"],
    "Costa Rica": ["Eco-Tourism", "Rainforests"],
    "Cuba": ["Classic Cars", "Salsa Music"],
    "Guatemala": ["Mayan Ruins", "Lakes"],
    "Bolivia": ["Salt Flats", "Mountains"],
    "Peru": ["Machu Picchu", "Culture"],
    "Ecuador": ["Galápagos", "Volcanoes"],
    "Paraguay": ["Rivers", "Jesuit Ruins"],
    "Suriname": ["Rainforests", "Dutch Heritage"],
    "Anguilla": ["Luxury Beaches", "Island Escapes"],

    // Africa
    "South Africa": ["Safari", "Wine"],
    "Morocco": ["Markets", "Deserts"],
    "Egypt": ["Pyramids", "Nile Cruises"],
    "Kenya": ["Safari", "Great Migration"],
    "Tanzania": ["Serengeti", "Zanzibar Beaches"],
    "Ethiopia": ["Historic Churches", "Cuisine"],
    "Namibia": ["Sand Dunes", "Wildlife"],
    "Ghana": ["History", "Beaches"],
    "Namibia": ["Sand Dunes", "Wildlife"],
    "Ethiopia": ["Historic Churches", "Highlands"],
    "Gabon": ["Rainforests", "Wildlife"],
    "Madagascar": ["Unique Species", "Baobab Trees"],
    "Algeria": ["Sahara Desert", "Roman Ruins"],
    "Angola": ["Baobab Trees", "Colonial History"],

    // Oceania & Pacific
    "Australia": ["Beaches", "Outback"],
    "New Zealand": ["Mountains", "Adventure Sports"],
    "Fiji": ["Coral Reefs", "Island Hopping"],
    "Papua New Guinea": ["Tribal Culture", "Diving"],
    "French Polynesia": ["Overwater Bungalows", "Honeymoons"],
    "Samoa": ["Volcanoes", "Beaches"],
    "Solomon Islands": ["Coral Reefs", "WWII Sites"],
};
  
const regionFallbackMap = {
    "Europe": ["Architecture", "Historic Sites"],
    "Asia": ["Temples", "Street Food"],
    "Africa": ["Safari", "Tribal Culture"],
    "Oceania": ["Beaches", "Adventure Sports"],
    "Americas": ["Festivals", "National Parks"],
    "Antarctica": ["Expeditions", "Glaciers"],
    "Caribbean": ["Island Hopping", "Beaches"],
    "Central America": ["Eco-Tourism", "Rainforests"],
    "Middle East": ["Deserts", "Religious Sites"],
};

const getSeasonForCountry = (country, region) => {
    const seasons = [];

    const summerCountries = [
        "Greece", "Italy", "Spain", "Thailand", "Croatia", "Portugal", "France",
        "Turkey", "Morocco", "Indonesia", "Vietnam", "Philippines", "Maldives",
        "Fiji", "Australia", "Brazil", "Mexico", "South Africa", "Tanzania",
        "Kenya", "Argentina", "Chile", "Sri Lanka", "Cuba", "Jamaica", "Pakistan"
    ];
    
    const winterCountries = [
        "Canada", "Switzerland", "Norway", "Finland", "Austria", "Germany",
        "United States", "Sweden", "Japan", "South Korea", "New Zealand",
        "Iceland", "Denmark", "Estonia", "Russia", "Czech Republic"
    ];
    
    const springCountries = [
        "Japan", "South Korea", "France", "Netherlands", "Portugal", "Taiwan",
        "Uzbekistan", "Iran", "Israel", "China", "Italy", "Greece", "Jordan",
        "Turkey", "Hungary", "Slovenia", "Georgia", "Armenia", "Kazakhstan"
    ];
    
    const fallCountries = [
        "Germany", "United States", "China", "Turkey", "Georgia", "Armenia",
        "Vietnam", "Nepal", "Bhutan", "Colombia", "Peru", "Bolivia",
        "Ethiopia", "Mexico", "Japan", "South Korea"
    ];

    if (summerCountries.includes(country)) seasons.push("Summer");
    if (winterCountries.includes(country)) seasons.push("Winter");
    if (springCountries.includes(country)) seasons.push("Spring");
    if (fallCountries.includes(country)) seasons.push("Fall");

    if (seasons.length > 0) return seasons;
  
    // Region-based fallback
    if (region?.includes("Europe")) return ["Spring"];
    if (region?.includes("Asia")) return ["Fall"];
    if (region?.includes("Africa")) return ["Summer"];
    if (region?.includes("Oceania")) return ["Summer"];
    if (region?.includes("Americas")) return ["Winter"];
    if (region?.includes("Caribbean")) return ["Summer"];
    if (region?.includes("Middle East")) return ["Fall"];
  
    return ["All"];
};

const generalCategoryMap = {
    "Wine": "Food & Markets",
    "Museums": "Culture",
    "Art": "Culture",
    "Historic Sites": "History",
    "Royal Attractions": "History",
    "Pubs": "Food & Markets",
    "Castles": "History",
    "Beer": "Food & Markets",
    "Beaches": "Beaches",
    "Flamenco": "Culture",
    "Coastal Towns": "Beaches",
    "Port Wine": "Food & Markets",
    "Mountains": "Nature",
    "Luxury": "Luxury Travel",
    "Classical Music": "Culture",
    "Alpine Skiing": "Adventure",
    "Medieval Towns": "History",
    "Game of Thrones": "Pop Culture",
    "Fjords": "Nature",
    "Northern Lights": "Nature",
    "Design": "Culture",
    "Nature": "Nature",
    "Saunas": "Wellness",
    "Aurora Borealis": "Nature",
    "Islands": "Beaches",
    "Mythology": "Culture",
    "Tulips": "Nature",
    "Cycling": "Adventure",
    "Temples": "Culture",
    "Street Food": "Food & Markets",
    "Great Wall": "History",
    "Night Markets": "Food & Markets",
    "Caves": "Nature",
    "Spirituality": "Wellness",
    "Palaces": "History",
    "Volcanoes": "Nature",
    "Himalayas": "Nature",
    "Trekking": "Adventure",
    "Tea Plantations": "Nature",
    "Skyline": "Modern Attractions",
    "Rainforests": "Nature",
    "Cultural Diversity": "Culture",
    "Silk Road": "History",
    "Islamic Architecture": "Architecture",
    "Petra": "History",
    "Desert Adventures": "Adventure",
    "K-Pop": "Pop Culture",
    "Technology": "Modern Attractions",
    "Road Trips": "Adventure",
    "National Parks": "Nature",
    "Lakes": "Nature",
    "Wildlife": "Nature",
    "Mayan Ruins": "History",
    "Carnival": "Festivals",
    "Tango": "Culture",
    "Glaciers": "Nature",
    "Stargazing": "Nature",
    "Atacama Desert": "Nature",
    "Coffee": "Food & Markets",
    "Colorful Towns": "Culture",
    "Eco-Tourism": "Nature",
    "Classic Cars": "Pop Culture",
    "Salsa Music": "Culture",
    "Salt Flats": "Nature",
    "Machu Picchu": "History",
    "Safari": "Wildlife",
    "Markets": "Food & Markets",
    "Deserts": "Nature",
    "Great Migration": "Wildlife",
    "Serengeti": "Wildlife",
    "Zanzibar Beaches": "Beaches",
    "Historic Churches": "History",
    "Cuisine": "Food & Markets",
    "Sand Dunes": "Nature",
    "Outback": "Adventure",
    "Adventure Sports": "Adventure",
    "Coral Reefs": "Nature",
    "Island Hopping": "Beaches",
    "Tribal Culture": "Culture",
    "Diving": "Adventure",
    "Overwater Bungalows": "Luxury Travel",
    "Honeymoons": "Luxury Travel"
};
  
const getInterestsForCountry = (name, region) => {
    if (countryInterestMap[name]) return countryInterestMap[name];
  
    // If no custom interest, try region-specific fallback
    if (region && regionFallbackMap[region]) return regionFallbackMap[region];
  
    // Then, if region is unknown, use generic safe fallback
    return ["Adventure", "Local Culture"];
};

const getCountryCode = (name) => {
    const mapping = {
        "Cocos (Keeling) Islands": "CC",
        "Vatican City State (Holy See)": "VA",
        "United States": "US",
        "United Kingdom": "GB",
    };
    return mapping[name] || name.slice(0, 2).toUpperCase();
};

const categorizeDestinations = (destList) => {
    const categories = {};
    const fallbackCategory = "Other Countries";
    const popularCategory = "Popular Locations";
    const tempMap = {};
  
    // Popular locations
    const popular = destList.filter((d) =>
      ["France", "Japan", "Italy", "United States", "Canada", "Mexico", "United Arab Emirates", "United Kingdom", "Greece", "Spain"].includes(d.name)
    );
  
    if (popular.length) {
      categories[popularCategory] = popular;
    }
  
    // Group by generalized interest
    for (const dest of destList) {
        if (["France", "Japan", "Italy", "United States", "Canada"].includes(dest.name)) continue;
  
        const interests = dest.interests || [];
        const generalized = new Set();
  
        for (const interest of interests) {
            const gen = generalCategoryMap[interest];
            if (gen) {
            generalized.add(gen);
            }
        }
  
        for (const gen of generalized) {
            if (!tempMap[gen]) tempMap[gen] = [];
            tempMap[gen].push(dest);
        }
    }
  
    // Filter and add categories with >= 5 destinations
    const validEntries = Object.entries(tempMap).filter(([, items]) => items.length >= 5);
    const categorizedNames = new Set(popular.map((d) => d.name));
  
    for (const [cat, items] of validEntries) {
        categories[`${cat}`] = items;
        items.forEach((d) => categorizedNames.add(d.name));
    }
  
    // Add all uncategorized to fallback
    const uncategorized = destList.filter((d) => !categorizedNames.has(d.name));
    if (uncategorized.length) {
        categories[fallbackCategory] = uncategorized;
    }
    return categories;
};
  

const CategorySlider = ({ title, items, images, setImages }) => (
    <div className="space-y-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
            {items.map((dest, idx) => (
                <div key={idx} className="w-[250px] flex-shrink-0 p-3 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition">
                    <img src={images[dest.name]} alt={dest.name} className="w-full h-40 object-cover rounded-md mb-2" onError={(e) => {
                        const fallback = `https://flagsapi.com/${getCountryCode(dest.name)}/flat/64.png`;
                        e.target.onerror = null;
                        e.target.src = fallback;
                        setImages((prev) => ({ ...prev, [dest.name]: fallback }));
                    }}/>
                    <h3 className="font-bold text-md">
                        <MapPin className="inline w-4 h-4 mr-1 text-blue-600" />
                        {dest.name}
                    </h3>
                    <p className="text-xs text-gray-500">{dest.interests.join(", ")}</p>
                </div>
            ))}
        </div>
    </div>
);

const ExploreDestinations = () => {
    const [season, setSeason] = useState("All");
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const [images, setImages] = useState({});
    const [destinations, setDestinations] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    let navigate = useNavigate();

    const allInterests = useMemo(() => {
        const interestSet = new Set();
        destinations.forEach((d) => { d.interests?.forEach((i) => interestSet.add(i));});
        return Array.from(interestSet);
    }, [destinations]);

    const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

    const toggleInterest = (interest) => {-
        setSelectedInterests((prev) =>
            prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
        );
    };

    useEffect(() => {
        const fetchCountries = async () => {
            const res = await fetch("https://countriesnow.space/api/v0.1/countries");
            const data = await res.json();
            const formatted = data.data.map((country) => ({
                name: country.country,
                cities: country.cities,
                region: country.region,
                interests: getInterestsForCountry(country.country, country.region || "Unknown"),
                season: getSeasonForCountry(country.country, country.region)
            }));
            setDestinations(formatted);
        };
        fetchCountries();
    }, []);
  
    useEffect(() => {
        const fetchImages = async () => {
            const limitedDestinations = destinations.slice(0, 250);
          
            const fetches = limitedDestinations.map(async (dest) => {
                if (images[dest.name]) return { [dest.name]: images[dest.name] };
          
                const query = `${dest.name} travel`;
                try {
                    const res = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`);
                    const data = await res.json();
                    let imageUrl;
          
                    if (data.hits && data.hits.length > 0) {
                        imageUrl = data.hits[0].webformatURL;
                    } else {
                        imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(dest.name + ' travel')}`;
                    }
          
                    return { [dest.name]: imageUrl };
                } catch (err) {
                    console.error(`Image fetch failed for ${dest.name}`, err);
                    return { [dest.name]: `https://source.unsplash.com/featured/?${encodeURIComponent(dest.name + ' travel')}` };
                }
            });
            const results = await Promise.all(fetches);
            const merged = Object.assign({}, ...results);
            setImages((prev) => ({ ...prev, ...merged }));
        };          
        if (destinations.length > 0) fetchImages();
    }, [destinations]);
  
    const filteredDestinations = destinations.filter((d) => {
        const matchSeason = season === "All" || (Array.isArray(d.season) && d.season.includes(season));
        const matchInterests = selectedInterests.length === 0 || selectedInterests.some((i) => d.interests.includes(i));
        const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchSeason && matchInterests && matchSearch;
    });

    return (
        <div className="p-6 space-y-6">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 cursor-pointer"> ← Back to Dashboard</button>
            {/* Filters Row */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative">
                    {/* Left: Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <SlidersHorizontal className="w-4 h-4" />
                            Season:
                            <select value={season} onChange={(e) => setSeason(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                                <option>All</option>
                                <option>Spring</option>
                                <option>Summer</option>
                                <option>Fall</option>
                                <option>Winter</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <Compass className="w-4 h-4" />
                            Interests:
                            <button onClick={() => setShowFilters(!showFilters)} className="text-sm px-3 py-1 rounded-full bg-gray-100 border border-gray-300 hover:bg-gray-200 cursor-pointer">
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </button>
                            {selectedInterests.length > 0 && (
                                <button onClick={() => setSelectedInterests([])} className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 cursor-pointer">
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Center: Absolutely centered search bar */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search countries..." className="w-[350px] px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                    </div>

                    {/* Right: Map Button */}
                    <div className="ml-auto">
                        <button onClick={() => setViewMode(viewMode === "list" ? "map" : "list")} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200 cursor-pointer">
                            {viewMode === "list" ? "Switch to Map" : "Switch to List"}
                        </button>
                    </div>
                </div>
      
                {/* Interest Filters */}
                {showFilters && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {allInterests.map((interest) => (
                            <button key={interest} onClick={() => toggleInterest(interest)} className={`text-sm px-3 py-1 rounded-full border cursor-pointer ${ selectedInterests.includes(interest) ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-600" }`}>
                                {interest}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Destination View */}
            {viewMode === "list" ? (
                <div className="space-y-12">
                    {Object.entries(categorizeDestinations(filteredDestinations)).map(
                        ([title, items]) => (
                            <CategorySlider key={title} title={title} items={items} images={images} setImages={setImages}/>
                        )
                    )}
                </div>
            ) : (
                <div className="mt-8 h-96 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                    🗺️ Interactive Map Coming Soon
                </div>
            )}
        </div>
    );      
};

export default ExploreDestinations;
