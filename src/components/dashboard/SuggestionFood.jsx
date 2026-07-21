import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HandleAllMeal } from "../../apiCalls/meal";

const SuggestionFood = () => {
  // ⚡ Maintained the exact state name choice
  const [mealsData, setMealsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const response = await HandleAllMeal(weekday)
        
        if (response && response.success) {
          setMealsData(response.data ? response.data : [])};
      } catch (error) {
        console.error("Could not fetch suggestion meals:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  //  The slice operation remains exactly as it was original
  // const slicedMeal = (Array.isArray(mealsData) ? mealsData : []).slice(0, 4);

  if (isLoading) {
    return (
      <section className="flex flex-row gap-3 flex-wrap">
      {mealsData.map((_, i) => (
          <div key={i} className="bg-white w-[300px] h-[290px] rounded-lg shadow-sm animate-pulse flex flex-col p-4">
            <div className="w-full h-[180px] bg-gray-200 rounded-t-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mt-2"></div>
          </div>
        ))}
      </section>
    );
  }

  if (mealsData?.length === 0) {
    return <p className="text-sm text-gray-500 italic">No recommendations available.</p>;
  }

  return (
    <section className="flex flex-row gap-3 flex-wrap">
      {mealsData.map((meal) => (
        <Link
          to={`/mealdetail/${meal._id || meal.id}`}
          key={meal._id || meal.id}
          className="no-underline hover:opacity-95 transition-opacity"
        >
          <div className="bg-white w-[300px] rounded-lg shadow-sm">
            <img
              src={meal.image || meal.imageUrl || meal.dishImage}
              alt={meal.name || meal.title}
              className="w-full h-[180px] object-cover rounded-t-lg"
            />

            <div className="p-4 flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <h6
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    meal.category === "Breakfast" || meal.category === "Lunch"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {meal.category}
                </h6>
                <span className="text-gray-400 cursor-pointer">...</span>
              </div>

              <div>
                <h2 className="font-bold text-green-900 truncate">
                  {meal.name || meal.title}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {meal.description || meal.subtitle}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default SuggestionFood;