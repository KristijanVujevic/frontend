"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Correct import

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token provided. Please login.");
        }

        // Decode the token to check the role
        const decodedToken = jwtDecode(token);

        if (decodedToken.role !== "admin") {
          throw new Error("Access denied. Admins only.");
        }

        const response = await fetch("/api/users/allUsers", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the header
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch users.");
        }

        const data = await response.json();
        setUsers(data.allUsers);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <p className="text-xl font-semibold mb-4 text-gray-900">
              Total Users: {totalCount}
            </p>
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                  <p className="text-lg font-medium text-gray-600">
                    Username: {user.username}
                  </p>
                  <p className="text-gray-600">E-mail: {user.email}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
