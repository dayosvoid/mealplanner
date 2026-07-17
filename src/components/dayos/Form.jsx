import React, { useEffect, useState } from "react";
import {
  IoMdAddCircleOutline,
  IoMdClose,
  IoMdCloseCircle,
} from "react-icons/io";
import { handleCreateMeal, handleUpdateMeal } from "../../apiCalls/meal";
import { FaFileUpload } from "react-icons/fa";

const Form = ({ initialData = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    mealName: "",
    image: "",
    category: "",
    weekday: "",
    calories: "",
    description: "",
    preparation: "",
  });
  const [ingredient, setIngredient] = useState({
    ingredientName: "",
    qty: "",
    unit: "cups",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [ingredientList, setIngredientList] = useState([]);
  const isEditMode = Boolean(initialData);

  // Raw file binary reference tracker
  const [imageFile, setImageFile] = useState(null);

  const previewImage = (file) => {
    setImageFile(file);
    setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData({ ...formData, image: null });
  };

  // Auto-fill form data when component mounts in Edit Mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        mealName: initialData.name || initialData.mealName || "",
        image: initialData.image || initialData.dishImage || "",
        category: initialData.category || "",
        weekday: initialData.weekDay || initialData.weekday || "",
        calories: initialData.calories ?? "",
        description: initialData.description || "",
        preparation: initialData.prepNotes || initialData.preparation || "",
      });
      setIngredientList(initialData.ingredients || []);
    }
  }, [initialData]);

  const validateForm = () => {
    let ValidationErrors = {};
    let isValid = true;

    if (!formData.mealName || !formData.mealName.trim()) {
      ValidationErrors.mealName = "Meal name is required";
      isValid = false;
    }

    if (!formData.category) {
      ValidationErrors.category = "Please select a meal category";
      isValid = false;
    }

    if (!formData.weekday) {
      ValidationErrors.weekday = "Please pick weekday";
      isValid = false;
    }

    if (
      formData.calories &&
      (isNaN(formData.calories) || Number(formData.calories) <= 0)
    ) {
      ValidationErrors.calories = "Calories must be a positive number";
      isValid = false;
    }

    if (ingredientList.length === 0) {
      ValidationErrors.ingredients = "Please add at least one ingredient to your meal";
      isValid = false;
    }

    setFormError(ValidationErrors);
    return isValid;
  };

  const handleAddIngredient = () => {
    if (!ingredient.ingredientName.trim()) return;

    setIngredientList((prev) => [...prev, ingredient]);
    setIngredient({
      ingredientName: "",
      qty: "",
      unit: "cups",
    });
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // ⚡ 1. Build and format sub-arrays properly
      const processedIngredients = ingredientList.map((ing) => ({
        name: ing.ingredientName,
        quantity: Number(ing.qty) || 1,
        unit: ing.unit === "g" ? "grams" : ing.unit,
        groceryCategory: "Other",
      }));

      // ⚡ 2. Construct multi-part streaming payload container
      const dataPayload = new FormData();
      dataPayload.append("name", formData.mealName);
      dataPayload.append("category", formData.category);
      dataPayload.append("weekDay", formData.weekday.toLowerCase());
      dataPayload.append("description", formData.description);
      dataPayload.append("prepNotes", formData.preparation);
      dataPayload.append("calories", formData.calories ? Number(formData.calories) : "");
      
      // Stringify sub-schemas so multer captures them as structural form fields safely
      dataPayload.append("ingredients", JSON.stringify(processedIngredients));

      // Append binary payload key stream if chosen
      if (imageFile) {
        dataPayload.append("image", imageFile);
      } else if (formData.image) {
        // Keeps the existing Cloudinary string reference if updating metadata without changing image
        dataPayload.append("image", formData.image);
      }

      let response;

      if (isEditMode) {
        response = await handleUpdateMeal(initialData._id, dataPayload);
      } else {
        response = await handleCreateMeal(dataPayload);
      }

      if (response && response.success) {
        if (onSuccess) onSuccess(response.data);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong while saving your meal.";
      console.error("Meal Form Error:", message);

      setFormError((prev) => ({
        ...prev,
        server: message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-gray-800 font-semibold my-4">
      <form onSubmit={HandleSubmit} className="flex flex-col gap-4 text-sm">
        {/* Top Section */}
        <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray/20 flex flex-col gap-4">
          {/* Meal Name Input */}
          <div className="relative">
            <label htmlFor="MealName" className="text-sm font-semibold text-gray-700">
              Meal Name
              <input
                type="text"
                name="MealName"
                placeholder="e.g jollof rice with plantain and turkey"
                value={formData.mealName}
                onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                className="w-full mt-1.5 text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-2 focus:border-green-600"
              />
            </label>
            {formError.mealName && (
              <p className="absolute bottom-[-18px] text-xs text-red-500 font-medium mt-1">
                {formError.mealName}
              </p>
            )}
          </div>

          {/* Core Selectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            <div className="relative flex flex-col gap-1.5">
              <label htmlFor="Category" className="text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                name="Category"
                id="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-green-600 cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
              {formError.category && (
                <p className="absolute bottom-[-18px] text-xs text-red-500 font-medium mt-1">
                  {formError.category}
                </p>
              )}
            </div>

            <div className="relative flex flex-col gap-1.5">
              <label htmlFor="weekday" className="text-sm font-semibold text-gray-700">
                Week Day
              </label>
              <select
                name="weekday"
                id="weekday"
                value={formData.weekday}
                onChange={(e) => setFormData({ ...formData, weekday: e.target.value })}
                className="w-full text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-green-600 cursor-pointer"
              >
                <option value="">Select Weekday</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
              {formError.weekday && (
                <p className="absolute bottom-[-18px] text-xs text-red-500 font-medium mt-1">
                  {formError.weekday}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="Calories" className="text-sm font-semibold text-gray-700">
                Calories <span className="text-xs font-normal text-gray-400">(Optional)</span>
              </label>
              <input
                type="number"
                id="Calories"
                name="Calories"
                placeholder="e.g. 350"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="w-full text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-green-800"
              />
              {formError.calories && (
                <p className="text-xs text-red-500 font-medium mt-1">{formError.calories}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="pt-2">
            <label htmlFor="Description" className="text-sm font-semibold text-gray-700">
              Description
              <input
                type="text"
                name="Description"
                placeholder="Briefly describe this delicious meal..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-1.5 text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-green-600"
              />
            </label>
          </div>
        </div>

        {/* Middle Section (Ingredients Form) */}
        <div className="relative bg-white py-4 p-4 space-y-4 rounded-lg shadow-lg shadow-gray/20">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Ingredients</h3>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center gap-1.5 text-xs font-semibold text-green-900 border border-green-900/20 bg-green-50/50 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              <IoMdAddCircleOutline size={16} />
              <span>Add Ingredient</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end w-full pb-4">
            <div className="md:col-span-6 flex flex-col gap-1.5">
              <label htmlFor="IngredientName" className="text-sm font-semibold text-gray-600">
                Ingredient Name
              </label>
              <input
                type="text"
                id="IngredientName"
                placeholder="e.g., seasoning"
                value={ingredient.ingredientName}
                onChange={(e) => setIngredient({ ...ingredient, ingredientName: e.target.value })}
                className="w-full text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-1.5">
              <label htmlFor="Quantity" className="text-sm font-semibold text-gray-600">
                Qty
              </label>
              <input
                type="text"
                id="Quantity"
                placeholder="1"
                value={ingredient.qty}
                onChange={(e) => setIngredient({ ...ingredient, qty: e.target.value })}
                className="w-full text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-1.5">
              <label htmlFor="Unit" className="text-sm font-semibold text-gray-600">
                Unit
              </label>
              <select
                name="Unit"
                id="Unit"
                value={ingredient.unit}
                onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}
                className="w-full text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-green-600 bg-white cursor-pointer"
              >
                <option value="">Select unit</option>
                <option value="cups">cups</option>
                <option value="g">grams (g)</option>
                <option value="ml">ml</option>
                <option value="tbsp">tbsp</option>
                <option value="pcs">pieces</option>
              </select>
            </div>
            {formError.ingredients && (
              <p className="absolute bottom-[2px] text-xs text-red-500 font-medium">
                {formError.ingredients}
              </p>
            )}
          </div>

          {/* Ingredient Pills List */}
          {ingredientList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {ingredientList.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 bg-green-50 text-green-900 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200/40"
                >
                  <span>{item.ingredientName}</span>
                  {item.qty && (
                    <span className="text-green-700/70 font-medium">
                      ({item.qty} {item.unit})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIngredientList((prev) => prev.filter((_, i) => i !== index))}
                    className="hover:bg-green-200/50 rounded-full p-0.5 ml-0.5 transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-xl shadow-gray/20">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="Preparation" className="text-sm font-semibold text-gray-700">
                Preparation Steps
              </label>
              <textarea
                name="Preparation"
                id="Preparation"
                rows="4"
                placeholder="Step 1. Chop vegetables...&#10;Step 2. Marinate chicken..."
                value={formData.preparation}
                onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}
                className="w-full text-sm font-normal bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-green-600 resize-none min-h-[100px]"
              />
            </div>

            {/* Image Upload Area */}
            <div>
              {!formData?.image ? (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="fileInput"
                    className="inline-flex items-center justify-between gap-1.5 text-xs font-semibold text-green-900 border border-green-900/20 bg-green-50/50 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition cursor-pointer select-none active:scale-[0.98] max-w-max"
                  >
                    <div className="flex items-center gap-1.5">
                      <IoMdAddCircleOutline size={16} />
                      <span>Add Image</span>
                    </div>
                    <FaFileUpload size={14} className="text-green-700/60" />
                  </label>

                  <input
                    type="file"
                    id="fileInput"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        previewImage(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="relative border border-gray-200 rounded-lg overflow-hidden max-w-[200px] shadow-sm">
                  <img
                    src={formData.image}
                    alt="meal preview"
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage} // Fixed dynamic state variable reference casing bug here
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <IoMdCloseCircle size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-col md:flex-row justify-start gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-2.5 bg-green-900 hover:bg-green-800 disabled:bg-green-900/50 text-white rounded-xl text-sm font-semibold transition shadow-sm active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? "Saving..." : isEditMode ? "Update Meal" : "Create Meal"}
            </button>

            <button
              type="button"
              className="w-full px-5 py-2.5 border-4 border-gray-100 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;