import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('gamerzone_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gamerzone_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => setCart(prev => [...prev, product]);
  
  const clearCart = () => setCart([]);
  
  const removeFromCart = (id) => {
    const idx = cart.findLastIndex(item => item.id === id);
    if (idx !== -1) {
      const newCart = [...cart];
      newCart.splice(idx, 1);
      setCart(newCart);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}