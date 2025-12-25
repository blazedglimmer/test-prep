'use client';
import { useState } from 'react';
const sampleData = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Developer',
  },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol@example.com',
    role: 'Manager',
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'Developer',
  },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Designer' },
  {
    id: 6,
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'Developer',
  },
  {
    id: 7,
    name: 'Grace Wilson',
    email: 'grace@example.com',
    role: 'Manager',
  },
  {
    id: 8,
    name: 'Henry Moore',
    email: 'henry@example.com',
    role: 'Designer',
  },
];

const SearchInput = () => {
  /* Implement search input functionality here using sampleData */
  const [inputValue, setInputValue] = useState('');

  const filteredData = sampleData.filter(item =>
    item.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div>
      <label className="block mb-2 font-medium" id="search-label">
        Search:
      </label>
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded w-full mb-4"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        aria-labelledby="search-label"
      />
      <label className="block mb-2 font-medium">Results:</label>
      <ul>
        {filteredData?.map(item => (
          <li key={item.id} className="border-b py-2">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-600">{item.email}</p>
            <p className="text-sm text-gray-500">{item.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchInput;
