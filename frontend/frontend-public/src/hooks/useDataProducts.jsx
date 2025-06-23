import { useState, useEffect } from "react";
import { useProducts } from "./ProductHooks/useProducts";

const useDataProducts = () => {
  const { products } = useProducts();

  // Carrito: cargar desde localStorage al iniciar
  const [productsCart, setProductsCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(productsCart));
  }, [productsCart]);

  // Función para agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    setProductsCart((prevCart) => {
      // Buscar si producto ya está en carrito
      const existingProductIndex = prevCart.findIndex(
        (p) => p.idProduct === product._id
      );

      if (existingProductIndex !== -1) {
        // Actualizar cantidad y subtotal
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantity;
        updatedCart[existingProductIndex].subtotal =
          updatedCart[existingProductIndex].quantity * product.price;
        return updatedCart;
      } else {
        // Agregar nuevo producto
        return [
          ...prevCart,
          {
            idProduct: product._id,
            quantity: quantity,
            subtotal: product.price * quantity,
          },
        ];
      }
    });
  };

  return {
    addToCart,
    products,
    productsCart,
    setProductsCart,
  };
};

export default useDataProducts;