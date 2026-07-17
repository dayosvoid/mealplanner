import { axiosInstance } from ".";

import axios from "axios";

export const handleCreateMeal = async (formDataPayload) => {
  const response = await axios.post("/meals/create", formDataPayload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const handleUpdateMeal = async (mealId, payload) => {
  const response = await axiosInstance.put(`/meals/update/${mealId}`, payload, {

   headers: {
      "Content-Type": "multipart/form-data",
    },
    })
  return response.data;
};

export const HandleAllMeal = async () => {
    const response = await axios.get(`meals/allMeals`);
    return response.data 
};

export const handleEachMeal = async (mealId) => {
    const response = await axios.get(`/meals/${mealId}`);
    return response.data 
};