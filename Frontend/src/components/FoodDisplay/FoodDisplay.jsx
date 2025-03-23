import { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  // ✅ Prevent error: Ensure `food_list` is always an array
  if (!Array.isArray(food_list)) {
    return <p>Loading food items...</p>;
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.length === 0 ? (
          <p>No food items available</p> // ✅ Handle empty food list
        ) : (
          food_list.map((item, index) =>
            category === "All" || category === item.category ? (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
