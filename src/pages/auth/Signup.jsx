import React from "react";
import bgImage from "../../assets/images/bgImage.avif";
import SignupForm from "../../components/auth/SignupForm";

const Signup = () => {
  return (
    <section className="h-screen flex justify-center items-center bg-green-50 font-serif px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1200px] w-full shadow-2xl rounded-3xl overflow-hidden">
        <div
          className="flex flex-col justify-between p-8 h-[350px] lg:h-[750px] bg-cover bg-center text-white bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
          <div>
            <h1 className="text-3xl font-bold">MealPlanner</h1>
            <h2 className="pt-3 text-md max-w-md">
              Organized, healthy, and deeply inviting. Start your journey to
              planned wellness today.
            </h2>
          </div>

          <div>
            <h2 className="italic text-lg">
              “This app replaced my hurried grocery runs with planned, peaceful
              wellness.”
            </h2>
          </div>
        </div>

        <SignupForm />
      </div>
    </section>
  );
};

export default Signup;
