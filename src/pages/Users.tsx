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

const Users: React.FC = () => {
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
              ...AuthService.getAuthHeaders(), // ✅ add token
            },
          }
        );
        const data = await response.json();
        if (response.ok && data.users) {
          setUsers(data.users.filter((u: User) => u.role === "user"));
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">S.No</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email / Phone</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user._id}>
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">
                {user.email || user.phone || "N/A"}
              </td>
              <td className="p-2 border">
                {user.isActive ? "Active ✅" : "Inactive ❌"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
