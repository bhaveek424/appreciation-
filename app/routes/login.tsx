import React, { useState } from "react";
import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: e.target.value,
    }));
  };

  return (
    <Layout>
      <div className="h-full flex justify-center items-center flex-col gap-y-4">
        <h2 className="text-5xl font-extrabold text-yellow-300">
          Welcome to Appreciation!
        </h2>
        <p className="font-semibold text-slate-300">
          Log In To Give Some Praise!
        </p>

        <form className="rounded-2xl bg-gray-200 p-6 w-96">
          {/* Email */}
          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
          />

          {/**Password */}
          <FormField
            htmlFor="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            type="password"
          />

          {/* Submit */}
          <div className="w-full text-center">
            <input
              type="submit"
              value="Sign In"
              className="rounded-xl cursor-pointer mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
}
