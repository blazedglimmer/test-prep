'use client';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

const SearchInput = () => {
  /* Implement search input functionality here using sampleData */
  const [searchInput, setSearchInput] = useState('');
  const [sampleData, setSampleData] = useState<SampleDataItem[]>([]);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    // This effect could be used to fetch data based on debounced search input
    const fetchData = async () => {
      const users = await fetch(
        'https://jsonplaceholder.typicode.com/users?name_like=' +
          debouncedSearch
      );
      const data = await users.json();
      setSampleData(data);
    };

    const fetchAllUsersData = async () => {
      const users = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await users.json();
      setSampleData(data);
    };

    if (debouncedSearch) {
      fetchData();
    } else {
      fetchAllUsersData();
    }
  }, [debouncedSearch]);

  return (
    <div className="relative p-4 rounded-lg shadow-md">
      <label className="block mb-2 font-medium" id="search-label">
        Search:
      </label>
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded w-full mb-4"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        aria-labelledby="search-label"
      />
      <label className="block mb-2 font-medium">Results:</label>
      <ul className="max-h-60 overflow-y-auto border rounded p-2">
        {sampleData?.map(item => (
          <li key={item.id} className="border-b py-2">
            <p className="font-semibold">
              {item.id} {item.name}
            </p>
            <p className="text-sm text-gray-600">{item.email}</p>
            <p className="text-sm text-gray-500">{item.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchInput;

type SampleDataItem = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};
