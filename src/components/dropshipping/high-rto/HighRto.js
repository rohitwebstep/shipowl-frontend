"use client"
import { useState } from 'react';

const highRtoPincodes = [
  { pincode: '110044', city: 'Delhi', reason: 'High return rate' },
  { pincode: '400072', city: 'Mumbai', reason: 'Address not reachable' },
  { pincode: '600001', city: 'Chennai', reason: 'Fake orders reported' },
  { pincode: '700001', city: 'Kolkata', reason: 'COD refusals' },
  { pincode: '500001', city: 'Hyderabad', reason: 'Frequent delivery issues' },
];

export default function HighRto() {
  const [filter, setFilter] = useState('');

  const filteredPincodes = highRtoPincodes.filter((item) =>
    item.pincode.includes(filter) || item.city.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl  bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">High RTO Pincodes</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by pincode or city..."
            className="w-full sm:w-80 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="">
          <table className="w-full text-left text-sm border rounded-md overflow-auto">
            <thead className="bg-orange-400 text-white">
              <tr>
                <th className="px-4 py-3 border-l">Pincode</th>
                <th className="px-4 py-3 border-l">City</th>
                <th className="px-4 py-3 border-l">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredPincodes.length > 0 ? (
                filteredPincodes.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 border-l font-medium">{item.pincode}</td>
                    <td className="px-4 py-3 border-l">{item.city}</td>
                    <td className="px-4 py-3 border-l text-gray-600">{item.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No matching pincodes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
