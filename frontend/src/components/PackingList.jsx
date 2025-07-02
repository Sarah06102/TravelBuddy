import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const PackingList = () => {
  const [list, setList] = useState([]);
  const [item, setItem] = useState('');
  const { tripId } = useParams();

  const addItem = () => {
    if (!item) return;
    setList([...list, { item, packed: false }]);
    setItem('');
  };

  const togglePacked = (index) => {
    const newList = [...list];
    newList[index].packed = !newList[index].packed;
    setList(newList);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Packing List</h2>
      <input
        className="border p-2 rounded w-full"
        placeholder="Add item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <button onClick={addItem} className="mt-2 bg-green-500 text-white px-3 py-1 rounded">
        Add
      </button>
      <ul className="mt-4">
        {list.map((entry, idx) => (
          <li
            key={idx}
            className={entry.packed ? 'line-through text-gray-500' : ''}
            onClick={() => togglePacked(idx)}
          >
            {entry.item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PackingList;