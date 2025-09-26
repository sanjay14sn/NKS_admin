import React, { useEffect, useState } from "react";
import { AuthService } from "../services/auth";

interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const Electricians: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://nks-backend-mou5.onrender.com/api/auth/users",
          {
            headers: {
              "Content-Type": "application/json",
              ...AuthService.getAuthHeaders(),
            },
          }
        );
        const data = await response.json();
        if (response.ok && data.users) {
          setUsers(
            data.users.filter(
              (u: User) => u.role === "shopowner" || u.role === "electrician"
            )
          );
        }
      } catch (err) {
        console.error("Error fetching electricians:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading electricians...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Electricians / Owners</h2>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between bg-white shadow rounded-lg p-4 border"
          >
            {/* Avatar + Name + Role */}
            <div className="flex items-center gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=random`}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Right Side: Phone + Date + Status + Menu */}
            <div className="flex items-center gap-6">
              {/* Phone + Created Date */}
              <div className="text-right">
                <p className="font-semibold">{user.phone || "No Phone"}</p>
                <p className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Status */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>

              {/* Menu (3 dots) */}
              <button className="ml-2 text-gray-500 hover:text-gray-700">
                ⋮
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Electricians;
