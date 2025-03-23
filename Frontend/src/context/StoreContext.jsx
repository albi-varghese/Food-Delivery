import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(null);
  const [food_list, setFoodList] = useState([]);
  const url = "https://food-del-backend-rhqy.onrender.com";
  const navigate = useNavigate(); // Hook for navigation

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const verifyToken = async (savedToken) => {
    try {
      const response = await axios.get(url + "/api/user/verify", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (response.data.success) {
        setToken(savedToken);
        return true;
      } else {
        localStorage.removeItem("token");
        return false;
      }
    } catch {
      localStorage.removeItem("token");
      return false;
    }
  };

  const loadCartData = async (validToken) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { Authorization: `Bearer ${validToken}` } });
    setCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        const isValid = await verifyToken(savedToken);
        if (isValid) {
          await loadCartData(savedToken);
        } else {
          navigate("/login"); // Redirect to login if the token is invalid
        }
      } else {
        navigate("/login"); // Redirect to login if no token exists
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
