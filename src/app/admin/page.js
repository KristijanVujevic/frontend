"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Correct import

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
        // Optionally redirect to login if error occurs
        if (error.message === "No token provided. Please login.") {
          router.push("/auth/signin");
        }
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to run once on mount

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token provided. Please login.");
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user.");
      }

      // Update the state to remove the deleted user
      setUsers(users.filter((user) => user._id !== userId));
      setTotalCount(totalCount - 1);
      setSuccessMessage("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 flex justify-center">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {successMessage && (
              <p className="text-green-500 text-center">{successMessage}</p>
            )}
            <p className="text-xl font-semibold mb-4 text-gray-900">
              Total Users: {totalCount}
            </p>
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-600">
                      Username: {user.username}
                    </p>
                    <p className="text-gray-600">E-mail: {user.email}</p>
                  </div>
                  <button
                    className="ml-4 text-white bg-red-500 rounded px-4 py-2"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete User
                  </button>
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
