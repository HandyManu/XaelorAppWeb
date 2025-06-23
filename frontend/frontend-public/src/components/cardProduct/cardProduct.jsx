import { useState } from "react";
import toast from "react-hot-toast";

// addToCart recibe el producto y la cantidad
const CardProduct = ({ product, addToCart }) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(
      `Producto ${product.name || product.model} agregado al carrito con éxito. Cantidad: ${quantity}`
    );
  };

  return (
    <div
      key={product?._id}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <img
        src={product?.image || product?.photos?.[0] || "/Images/Xaelör Noir Deluxe.svg"}
        alt={product?.name || product?.model}
        className="w-full h-48 object-cover rounded-t-lg"
        onError={e => { e.target.src = "/Images/Xaelör Noir Deluxe.svg"; }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          {product?.name || product?.model}
        </h3>
        <p className="text-gray-600 text-sm">{product?.description}</p>
      </div>
      <div className="p-4 border-t">
        <p className="text-lg font-semibold text-gray-800">
          Precio:
          <span className="text-gray-600 text-sm"> ${product?.price} </span>
        </p>
        <p className="text-gray-600 text-sm mb-4">Stock: {product?.stock}</p>
        <p className="text-gray-600 text-sm mb-4">
          Categoria: {product?.idCategory?.name}
        </p>
        <label className="block text-gray-700 mb-2">Cantidad: {quantity}</label>
        <input
          type="number"
          min="1"
          max={product?.stock}
          value={quantity}
          className="border rounded px-3 py-1 w-full mb-2"
          onChange={(e) => {
            const qty = parseInt(e.target.value, 10);
            if (qty < 1 || qty > product?.stock) {
              setQuantity(1);
              toast.error(
                `Cantidad insuficiente, solo hay ${product?.stock} disponibles.`
              );
            } else {
              setQuantity(qty);
            }
          }}
        />
        <button
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default CardProduct;