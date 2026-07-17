import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { handleEachMeal } from "../../apiCalls/meal";
import Header from "../navigation/Header";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { BsForkKnife } from "react-icons/bs";

const MealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setIsLoading(true);
        const response = await handleEachMeal(id);
        if (response && response.success) {
          setMeal(response.data);
        }
      } catch (error) {
        console.error("Error pulling single meal metrics:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchMeal();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center text-sm font-semibold text-gray-500">
          Loading meal details...
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center text-sm font-semibold text-red-500">
          Meal not found or has been removed.
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 bg-gray-50/50 min-h-screen">
      <Header />
      <div className="w-full border-b border-gray-200"></div>

      <div className="container text-gray-700 w-11/12 md:w-10/12 mx-auto">
        {/* Navigation Breadcrumb Line */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-6">
          <div className="text-sm font-semibold flex items-center gap-2 text-gray-500">
            <Link to="/dashboard" className="hover:text-green-900 transition-colors">
              Dashboard
            </Link>
            <IoIosArrowForward size={14} className="text-gray-400" />
            <span className="text-gray-800">Meal Detail</span>
          </div>

          <button
            onClick={() => navigate(`/editMeal/${id}`)}
            className="bg-green-900 hover:bg-green-800 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm transition-all cursor-pointer flex gap-2 items-center self-start md:self-auto"
          >
            <GoPencil size={16} />
            <span>Edit Meal</span>
          </button>
        </div>

        {/* Core Detail Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Image and Descriptions */}
          <div className="space-y-4">
            <div className="w-full h-[320px] md:h-[400px] relative rounded-2xl overflow-hidden shadow-sm bg-gray-100">
              <div className="flex gap-2 absolute left-4 top-4 z-10">
                <span className="text-green-950 capitalize font-bold text-xs bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-xs">
                  {meal.category}
                </span>
                {meal.calories && (
                  <span className="text-green-950 font-bold text-xs bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-xs">
                    {meal.calories} Kcal
                  </span>
                )}
              </div>
              <img
                src={meal.image || meal.dishImage}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white border border-gray-100 p-5 flex flex-col gap-4 rounded-2xl shadow-xs">
              <div>
                <span className="text-xs font-bold text-green-800 uppercase tracking-wider block mb-1">
                  {meal.weekDay}
                </span>
                <h2 className="text-2xl font-bold text-green-950 uppercase">
                  {meal.name}
                </h2>
              </div>

              {meal.description && (
                <p className="text-gray-600 font-normal leading-relaxed text-sm">
                  {meal.description}
                </p>
              )}

              {meal.prepNotes && (
                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  <div className="flex gap-2 items-center text-green-950 font-bold">
                    <BsForkKnife size={16} />
                    <h3 className="text-sm">Prep Notes</h3>
                  </div>
                  <div className="bg-green-50/60 p-3.5 text-gray-700 italic border-l-4 border-green-900 rounded-r-xl text-sm leading-relaxed">
                    "{meal.prepNotes}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Ingredients and Metrics */}
          <div className="w-full flex flex-col gap-4">
            
            {/* Ingredients Component Box */}
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs w-full">
              <div className="w-full flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <h3 className="text-xl font-bold text-green-950">Ingredients</h3>
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                  {meal.ingredients?.length || 0} Items
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
                {meal.ingredients && meal.ingredients.length > 0 ? (
                  meal.ingredients.map((ingredient, index) => (
                    <div key={index} className="py-3 flex justify-between items-center text-sm">
                      <p className="font-semibold text-gray-800 capitalize">{ingredient.name}</p>
                      <p className="text-gray-500 font-medium">
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm py-2 italic">No listed ingredients specified.</p>
                )}
              </div>
            </div>

            {/* Micro Nutrition Card Block */}
            <div className="w-full bg-green-950 text-gray-200 rounded-2xl flex flex-col gap-4 p-5 shadow-sm">
              <h3 className="text-lg font-bold">Estimated Macro Values</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-green-900/60 border border-green-800/30 px-4 py-3 flex items-center rounded-xl">
                  <div className="w-full text-center">
                    <p className="font-bold text-lg text-white">{meal.calories || "—"}</p>
                    <p className="text-xs text-green-200/80">Total Calories</p>
                  </div>
                </div>
                <div className="bg-green-900/60 border border-green-800/30 px-4 py-3 flex items-center rounded-xl">
                  <div className="w-full text-center">
                    <p className="font-bold text-lg text-white">Other</p>
                    <p className="text-xs text-green-200/80">Classification</p>
                  </div>
                </div>
              </div>

              <button className="w-full border border-green-800 hover:bg-green-900 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer mt-2">
                View Comprehensive Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;