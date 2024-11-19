import React from "react";

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center space-x-4">
          <img
            className="w-16 h-16 rounded-full"
            src="https://via.placeholder.com/150"
            alt="User Avatar"
          />
          <div>
            <h2 className="text-xl font-semibold text-blue-700">John Doe</h2>
            <p className="text-gray-600">Shopper</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium text-blue-700">
            Profile Information
          </h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-blue-400">john.doe@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phone:</span>
              <span className="text-blue-400">(123) 456-7890</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Address:</span>
              <span className="text-blue-400">123 Main St, Anytown, USA</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
