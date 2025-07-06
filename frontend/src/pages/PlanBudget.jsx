import { DollarSign, Trash2, TrendingUp, Wallet } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';

const categoryOptions = [
    { value: 'Flight', label: 'Flight' },
    { value: 'Food', label: 'Food' },
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Transport', label: 'Transport' },
];
  

const PlanBudget = () => {
    const navigate = useNavigate();
    const [totalBudget, setTotalBudget] = useState("");
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ category: "", amount: "", note: "" });
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState("");
    const selectedTrip = trips.find(t => t._id === selectedTripId);
    const [saveStatus, setSaveStatus] = useState("");

    const handleAddExpense = () => {
        if (!form.category || !form.amount) return;
        setExpenses([...expenses, { ...form, amount: parseFloat(form.amount) }]);
        setForm({ category: "", amount: "", note: "" });
    };

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudget - totalSpent;

    const handleDelete = (indexToRemove) => {
        const newList = expenses.filter((_, i) => i !== indexToRemove); 
        setExpenses(newList);
    };

    const handleReset = () => {
        const confirmReset = window.confirm("Are you sure you want to reset the planner? This will clear all data.");
        if (confirmReset) {
            setTotalBudget(0);
            setExpenses([]);
            setForm({ category: "", amount: "", note: "" });
        }
    };

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/trips", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                console.log("Fetched trips:", data);
                setTrips(data);
            } catch (err) {
                console.error("Failed to fetch trips", err);
            }
        };
        fetchTrips();
    }, []);
      
    useEffect(() => {
        const save = async () => {
            if (!selectedTripId || totalBudget === "" || isNaN(totalBudget)) return;
            setSaveStatus("saving");
            try {
                await fetch(`http://localhost:3000/api/trips/${selectedTripId}/budget`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ budget: totalBudget, expenses }),
                });
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus(""), 2000);
            } catch (err) {
                console.error("Failed to save", err);
                setSaveStatus("error");
            }
        };
        save();
    }, [totalBudget, expenses, selectedTripId]);
    
    useEffect(() => {
        const fetchTripBudget = async () => {
            if (!selectedTripId) return;
            try {
                const res = await fetch(`http://localhost:3000/api/trips/${selectedTripId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (data.budget) setTotalBudget(data.budget);
                if (data.expenses) setExpenses(data.expenses);
            } catch (err) {
                console.error("Failed to load trip budget/expenses", err);
            }
        };
        fetchTripBudget();
    }, [selectedTripId]);

    return (
        <div className="p-6 space-y-4">
            <div className="relative">
                <div className="flex items-center">
                    <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 cursor-pointer"> ← Back to Dashboard</button>
                    {saveStatus && (
                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <div className={`text-sm rounded-full px-4 py-1 ml-4 ${saveStatus === "saving" ? "text-blue-600 bg-blue-100 border border-blue-600 p-2" : saveStatus === "saved" ? "text-green-600 bg-green-100 border border-green-600 p-2" : "text-red-500 bg-red-100 border border-red-600 p-2"}`}>
                                {saveStatus === "saving" && "Saving..."}
                                {saveStatus === "saved" && "Saved!"}
                                {saveStatus === "error" && "Failed to save."}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <h1 className="text-2xl font-bold">Trip Budget Planner</h1>
            
            {/* Trip Selector */}
            <div className="flex items-center gap-4 flex-wrap">
                <select value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)} className="border p-2 rounded">
                    <option value="">Use without selecting trip</option>
                    {trips.map(trip => (
                        <option key={trip._id} value={trip._id}>
                        {trip.name}
                        </option>
                    ))}
                </select>
                {selectedTrip && (
                        <h2 className="text-xl text-gray-600">Planning for: <span className="text-emerald-600">{selectedTrip.name}</span></h2>
                )}
            </div>
            
            {/* Budget Input */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
                <label className="block font-medium mb-2">Set Total Budget ($)</label>
                <input type="number" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/4" placeholder="Enter your budget"/>
            </div>

            {/* Add Expense Form */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold">Add Expense</h2>
                </div>
                <div className="flex flex-wrap gap-4">
                    <CreatableSelect className="w-full sm:w-1/4" placeholder="Category" isClearable options={categoryOptions} value={form.category ? { label: form.category, value: form.category } : null} onChange={(selectedOption) => setForm({ ...form, category: selectedOption ? selectedOption.value : '' })}/>
                    <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/4"/>
                    <input type="text" placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-1/4"/>
                    <button onClick={handleAddExpense} className="bg-emerald-400 text-white px-7 py-2 rounded-full hover:bg-emerald-600 transition cursor-pointer">Add</button>
                </div>
            </div>

            {/* Budget Summary */}
            <div className="grid sm:grid-cols-3 gap-4 text-center">
                
                <div className="bg-green-100 p-4 rounded-xl text-center">
                    <div className="flex justify-center items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <h3 className="text-lg font-medium">Total Budget</h3>
                    </div>
                    <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                </div>

                <div className="bg-yellow-100 p-4 rounded-xl text-center">
                    <div className="flex justify-center items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                        <h3 className="text-lg font-medium">Total Spent</h3>
                    </div>
                    <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
                </div>

                <div className="bg-blue-100 p-4 rounded-xl text-center">
                    <div className="flex justify-center items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 text-blue-600" />
                        <h3 className="text-lg font-medium">Remaining</h3>
                    </div>
                    <p className="text-2xl font-bold">${remaining.toLocaleString()}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="flex justify-center mt-6">
                <div className="w-full sm:w-2/3 h-3 rounded-full bg-gray-100 border border-gray-300 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500 ease-in-out" style={{ width: totalBudget > 0 && totalSpent > 0 ? `${Math.min(100, (totalSpent / totalBudget) * 100)}%` : "0%", }}/>
                </div>
            </div>

            {expenses.length > 0 && (
                <p className="text-center text-gray-600 mt-4">
                    You’ve spent <span className="text-blue-600"><strong>{((totalSpent / totalBudget) * 100).toFixed(1)}%</strong></span> of your <span className="text-emerald-600"><strong>${totalBudget.toLocaleString()}</strong></span> budget across <span className="text-red-600"><strong>{expenses.length}</strong></span> expenses.
                </p>
            )}

            {/* Expense List */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
                <div className="flex justify-between items-center mt-2">
                    <h2 className="text-xl font-semibold mb-4">Expenses</h2>
                    <button onClick={handleReset} className="text-sm text-red-600 px-4 py-1.5 rounded-full border border-red-300 hover:bg-red-100 transition cursor-pointer">
                        Reset Planner
                    </button>
                </div>

                {expenses.length === 0 ? (
                    <p className="text-gray-500">No expenses added yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {expenses.map((e, idx) => (
                            <li key={idx} className="border-b pb-2 flex justify-between items-start mt-5">
                                <div>
                                    <p className="font-medium">{e.category}</p>
                                    {e.note && (
                                        <p className="text-sm text-gray-500">{e.note}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-right text-emerald-600 font-semibold">-${e.amount.toFixed(2)}</p>
                                    <button onClick={() => handleDelete(idx)}>
                                        <Trash2 className="w-4 h-4 text-red-500 hover:scale-110 transition cursor-pointer" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PlanBudget;