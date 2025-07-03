import React, { useState } from 'react'
import { Listbox } from '@headlessui/react'

const tripTemplates = [
    { name: "Weekend Getaway", destination: "Niagara Falls, Canada" },
    { name: "Romantic Escape", destination: "Venice, Italy" },
    { name: "Business Trip", destination: "New York, USA" },
    { name: "Family Vacation", destination: "Cancún, Mexico" }
];
  
const smartSuggestions = ["Paris, France", "Tokyo, Japan", "Bali, Indonesia"];

const CreateTripModal = ({ isOpen, onClose, onTripCreated }) => {
    const statuses = ["Planning", "Upcoming", "Ongoing", "Completed"];
    const [selected, setSelected] = useState(statuses[0]);
    const [tripName, setTripName] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState("");
    const [actualSpent, setActualSpent] = useState("");

    const handleTemplateSelect = (template) => {
        setTripName(template.name);
        setDestination(template.destination);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tripName || !destination || !startDate || !endDate || !budget || isNaN(budget)) {
            setFormError("Please fill out all fields correctly.");
            return;
        }
        
        setFormError("");
        
        const newTrip = {
            name: tripName,
            destination,
            startDate,
            endDate,
            budget: parseFloat(budget),
            status: selected,
            description,
        };
        
        try {
            const res = await fetch("http://localhost:3000/api/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(newTrip),
            });
        
            if (res.ok) {
                console.log("Trip created!");
                onTripCreated?.();
                onClose(); 
            } else {
                const error = await res.json();
                setFormError(error.error || "Failed to create trip");
            }
        } catch (err) {
            console.error("Error creating trip:", err);
            setFormError("Unexpected error occurred.");
        }
    };

    if (!isOpen) {
        return <div style={{ display: 'none' }} />;
    }
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md h-[600px] overflow-y-auto text-center relative shadow-xl flex flex-col justify-between">
            <div className="w-full">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer">&times;</button>
                </div>
                <h1 className="text-2xl font-semibold leading-snug">Create New Trip</h1>
                
                {/* Templates */}
                <div className="my-4">
                    <p className="text-sm font-medium text-left mb-1">Use a Template:</p>
                    <div className="flex flex-wrap gap-2">
                        {tripTemplates.map((tpl) => (
                            <button key={tpl.name} onClick={() => handleTemplateSelect(tpl)} className="px-3 py-1 text-sm border rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer">
                                {tpl.name}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-7">

                    <div>
                        <label className="block font-medium mb-1 text-left">Trip Name</label>
                        <input type="text" placeholder="My Amazing Adventure" name="name" value={tripName} onChange={(e) => setTripName(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    
                    <div>
                        <label className="block font-medium mb-1 text-left">Destination</label>
                        <input type="text" placeholder="Paris, France" name="location" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                        <datalist id="destination-suggestions">
                            {smartSuggestions.map((city) => <option key={city} value={city} />)}
                        </datalist>
                    </div>
                    
                    <div className="flex flex-row gap-8">
                        <div>
                            <label className="block font-medium mb-1 text-left">Start Date</label>
                            <input type="date" name="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"/>
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-left">End Date</label>
                            <input type="date" name="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"/>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-left">Budget</label>
                        <input type="number" placeholder="2500.00" name="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    
                    {selected === "Completed" && (
                            <>
                                <div>
                                    <label className="block font-medium mb-1 text-left">Actual Spent</label>
                                    <input type="number" value={actualSpent} onChange={(e) => setActualSpent(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                            </>
                    )}

                    <div>
                        <label className="block font-medium mb-1 text-left">Status</label>
                        <Listbox value={selected} onChange={setSelected}>
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer">
                                {selected}
                                </Listbox.Button>

                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm">
                                    {statuses.map((status, idx) => (
                                        <Listbox.Option key={idx} value={status}>
                                            {({ active, selected }) => (
                                                <div className={`px-2 py-1 ${idx !== statuses.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                                    <div className={`rounded-md px-4 py-2 mb-1 mt-1 text-center transition-colors duration-150 cursor-pointer ${active ? 'bg-indigo-500 text-white' : 'text-black'} ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                        {status}
                                                    </div>
                                                </div>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-left">Description</label>
                        <textarea placeholder="Tell us about your trip plans..." name="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>

                    {formError && (
                        <div className="bg-red-100 text-red-700 rounded-md p-2 text-sm mb-4">
                            {formError}
                        </div>
                    )}
                    
                    <div className="flex justify-center">
                        <button className="bg-blue-500 text-white rounded-xl w-full py-3 font-medium hover:bg-blue-600 transition cursor-pointer">
                            Create Trip
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CreateTripModal