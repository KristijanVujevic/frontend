"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const UserProfile = () => {
  const [user, setUser] = useState(null); // State to hold user data
  const [likedProducts, setLikedProducts] = useState([]); // State for liked products
  const [error, setError] = useState(null); // State for error handling
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [newUsername, setNewUsername] = useState(""); // State for new username

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No user is logged in.");
          return;
        }

        // Decode the token to get user info
        const decoded = jwtDecode(token);
        const userId = decoded.id; // Adjust based on your JWT payload structure

        // Fetch full user profile from the backend
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please log in again.");
          } else if (response.status === 404) {
            setError("User not found.");
          } else {
            throw new Error("Failed to fetch user data.");
          }
          return;
        }

        const data = await response.json();
        setUser(data.user); // Set the user data
        setNewUsername(data.user.username); // Set the initial username for editing

        // Fetch liked products
        if (data.user.favorites && data.user.favorites.length > 0) {
          const productResponse = await fetch(`/api/favorites`, {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token for authentication
            },
          });
          if (!productResponse.ok) {
            throw new Error("Failed to fetch liked products.");
          }
          const products = await productResponse.json();
          setLikedProducts(products); // Set liked products
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  // Function to handle username update
  const handleUpdateUsername = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No user is logged in.");
        return;
      }

      // Send PATCH request to update username
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        throw new Error("Failed to update username.");
      }

      const data = await response.json();
      setUser((prevUser) => ({ ...prevUser, username: newUsername })); // Update user state with new username
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating username:", error);
      setError("Failed to update username.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
        <div className="flex items-center space-x-4">
          <img
            className="w-16 h-16 rounded-full"
            src={"https://avatar.iran.liara.run/public"}
            alt="User Avatar"
          />
          <div>
            <h2 className="text-xl font-semibold text-blue-700">
              Welcome,{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border-b-2 border-blue-500 focus:outline-none"
                />
              ) : (
                user.username
              )}
            </h2>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium text-blue-700">
            Profile Information:
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-blue-400">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {isEditing ? (
            <button
              onClick={handleUpdateUsername}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Liked Products Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Liked Products
        </h3>
        {likedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {likedProducts.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-lg shadow-lg"
              >
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={`Image of ${product.name}`}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h4 className="text-lg font-medium mt-2 text-blue-900">
                  {product.name || product.brand}
                </h4>
                <p className="text-blue-500 font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No liked products yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
