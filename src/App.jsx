import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import MealMedia from "./pages/mealmedia/MealMedia";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MealDetail from "./components/dayos/MealDetail";
import AddMeal from "./pages/dayos/AddMeal";
import EditMeal from "./pages/dayos/EditMeal";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/" />
        <Route element={<Signup />} path="signup" />

        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          path="/dashboard"
        />

        <Route
          element={
            <ProtectedRoute>
              <MealMedia />
            </ProtectedRoute>
          }
          path="/meals"
        />

        <Route
          element={
            <ProtectedRoute>
              <AddMeal />
            </ProtectedRoute>
          }
          path="/createMeal"
        />

        <Route
          element={
            <ProtectedRoute>
              <EditMeal />
            </ProtectedRoute>
          }
          path="/editMeal/:id"
        />

        <Route
          element={
            <ProtectedRoute>
              <MealDetail />
            </ProtectedRoute>
          }
          path="/mealdetail/:id"
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
