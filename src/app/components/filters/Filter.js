import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const Filter = ({ categories, onFilterChange }) => {
  const searchParams = useSearchParams(); // To get current URL query params
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const category = searchParams.get("category") || ""; // Get category from query params
    setSelectedCategory(category);
  }, [searchParams]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onFilterChange(category); // Notify parent component about category change
  };

  return (
    <div className="filter-component p-4 bg-white shadow-md rounded-md w-1/5">
      <label
        htmlFor="category-filter"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Filter by Category:
      </label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
      >
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
