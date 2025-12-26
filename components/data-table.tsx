'use client';
import { useState, useEffect } from 'react';

type DataItem = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

const DataTable = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const controller = new AbortController();

    // Fetch data from an API or use static data
    const fetchData = async () => {
      const limit = 10;

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`,
          {
            signal: controller.signal,
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();

    return () => controller.abort();
  }, [page]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>body</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(item => (
            <tr key={item.id}>
              <th>{item.id}</th>
              <th>{item.title}</th>
              <th>{item.body}</th>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:cursor-pointer"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:cursor-pointer"
          onClick={() => setPage(prev => prev + 1)}
          disabled={100 <= page * data.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;

{
  /* <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Body</th>
          </tr>
        </thead>
        <tbody>
          {data.slice((page - 1) * pageSize, page * pageSize).map(item => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.title}</td>
              <td className="border border-gray-300 px-4 py-2">{item.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          onClick={() => setPage(prev => prev + 1)}
          disabled={page * pageSize >= data.length}
        >
          Next
        </button>
      </div> */
}
