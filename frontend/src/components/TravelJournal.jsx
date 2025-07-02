import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const TravelJournal = () => {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const { tripId } = useParams();

  const saveEntry = () => {
    if (!text) return;
    setEntries([...entries, { date: new Date().toLocaleDateString(), text }]);
    setText('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Travel Journal</h2>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Write about your day..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button onClick={saveEntry} className="mt-2 bg-purple-500 text-white px-3 py-1 rounded">
        Save Entry
      </button>
      <div className="mt-4 space-y-2">
        {entries.map((entry, idx) => (
          <div key={idx} className="border p-2 rounded">
            <p className="text-sm text-gray-500">{entry.date}</p>
            <p>{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TravelJournal;