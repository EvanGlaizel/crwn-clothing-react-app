import { createContext, useState, useEffect } from "react";

const addCartItem = (cartItems, productToAdd) => 
{
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToAdd.id)

    if (existingCartItem)
    {
        return cartItems.map((cartItem) => 
        {
            if (cartItem.id === existingCartItem.id)
            {
                return {...cartItem, quantity: cartItem.quantity+1}
            }
            else
            {
                return cartItem
            }
        })
    }

    return [...cartItems, {...productToAdd, quantity: 1}]
}

const removeCartItem = (cartItems, productToRemove) => 
{
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToRemove.id)

    if (existingCartItem)
    {
        if (existingCartItem.quantity === 1)
        {
            return cartItems.filter(cartItem => cartItem.id !== productToRemove.id);
        }

        return cartItems.map((cartItem) => 
        {
            if (cartItem.id === existingCartItem.id)
            {
                return {...cartItem, quantity: cartItem.quantity-1};
            }
            else
            {
                return cartItem;
            }
        })
    }

    return cartItems;
}

const clearCartItem = (cartItems, productToClear) => 
    {
        const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToClear.id)
    
        if (existingCartItem)
        {
            return cartItems.filter(cartItem => cartItem.id !== productToClear.id);
        }
    
        return cartItems;
    }

export const CartContext = createContext
({
    isCartOpen: false,
    setIsCartOpen: () => {},
    cartItems: [],
    addItemToCart: () => {},
    removeItemFromCart: () => {},
    clearItemFromCart: () => {},
    cartCount: 0,
    cartCost: 0
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartCost, setCartCost] = useState(0);

  useEffect(() => 
  {
    const newCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0)
    setCartCount(newCartCount);

    const newCartCost = cartItems.reduce((total, cartItem) => total + (cartItem.price * cartItem.quantity), 0)
    setCartCost(newCartCost);
  }, [cartItems])

  const addItemToCart = (productToAdd) => 
  {
    setCartItems(addCartItem(cartItems, productToAdd));
  }

  const removeItemFromCart = (productToRemove) => 
  {
    setCartItems(removeCartItem(cartItems, productToRemove));
  }

  const clearItemFromCart = (productToClear) => 
  {
    setCartItems(clearCartItem(cartItems, productToClear));
  }

  const value = { isCartOpen, setIsCartOpen, addItemToCart, removeItemFromCart, clearItemFromCart, cartItems, cartCount, cartCost };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};