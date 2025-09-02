import React, { useState } from "react";

const Electricians: React.FC = () => {
  const [search, setSearch] = useState("");

  const electricians = [
    {
      id: 1,
      name: "Sundar Kumar",
      company: "SK Electricals",
      category: "Electrician",
      mobile: "9876543210",
      status: "active",
    },
    {
      id: 2,
      name: "Ravi K",
      company: "Ravi Owners",
      category: "Owner",
      mobile: "9123456789",
      status: "inactive",
    },
  ];

  const filtered = electricians.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Electricians / Owners</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or company..."
          className="w-full md:w-1/3 px-3 py-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Mobile</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, idx) => (
              <tr key={e.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{e.name}</td>
                <td className="px-4 py-2">{e.company}</td>
                <td className="px-4 py-2">{e.category}</td>
                <td className="px-4 py-2">{e.mobile}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      e.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Electricians;
