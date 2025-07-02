import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Itinerary = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const { tripId } = useParams();

  const addItem = () => {
    if (!input) return;
    setItems([...items, input]);
    setInput('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Itinerary</h2>
      <input
        className="border p-2 rounded w-full"
        placeholder="e.g., Eiffel Tower at 10AM"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addItem} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
        Add Activity
      </button>
      <ul className="mt-4 list-disc list-inside">
        {items.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>
  );
}

export default Itinerary;