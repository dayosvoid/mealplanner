import React from 'react'
import Header from "../../components/navigation/Header";
import Form from "../../components/dayos/Form";

const EditMeal = () => {
    
  return (
    <div className="flex flex-col gap-5">
      {/* <Header /> */}

      <div className="container w-10/12 mx-auto">
        <header>
          <h2 className="text-xl md:text-3xl font-semibold">Edit Meal Details</h2>
          <p className="text-sm text-gray-800"> Orgnise your healthy routine with a new recipe</p>
        </header>

        <Form />
      </div>
    </div>
  )
}

export default EditMeal
