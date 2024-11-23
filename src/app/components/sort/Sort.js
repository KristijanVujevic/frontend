import React from "react";

const Sort = ({ onSortChange }) => {
  const handleSort = (type) => {
    let sortBy = "name"; // Default sort field is 'name'
    let sortOrder = "asc"; // Default sort order is ascending

    if (type === "alphabetical") {
      sortBy = "brand";
      sortOrder = "asc";
    } else if (type === "priceLowToHigh") {
      sortBy = "price";
      sortOrder = "asc";
    } else if (type === "priceHighToLow") {
      sortBy = "price";
      sortOrder = "desc";
    }

    // Pass sorting parameters back to the parent component
    onSortChange(sortBy, sortOrder);
  };

  return (
    <div className="flex space-x-4 mb-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded text-gray-800"
        onClick={() => handleSort("alphabetical")}
      >
        Sort Alphabetically by Brand
      </button>
      <button
        className="px-4 py-2 bg-gray-200 rounded text-gray-800"
        onClick={() => handleSort("priceLowToHigh")}
      >
        Price Low to High
      </button>
      <button
        className="px-4 py-2 bg-gray-200 rounded text-gray-800"
        onClick={() => handleSort("priceHighToLow")}
      >
        Price High to Low
      </button>
    </div>
  );
};

export default Sort;
