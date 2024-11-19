import React from "react";

const favoriteProducts = [
  { id: 1, name: "Product 1", isFavorite: true },
  { id: 2, name: "Product 2", isFavorite: true },
  { id: 3, name: "Product 3", isFavorite: false },
  { id: 4, name: "Product 4", isFavorite: true },
];

const FavoritesPage = () => {
  const favoriteItems = favoriteProducts.filter(
    (product) => product.isFavorite
  );

  return (
    <div>
      <h1>Favorite Products</h1>
      <ul>
        {favoriteItems.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
