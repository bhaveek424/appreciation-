import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import React, { useEffect, useRef, useState } from "react";
import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";
import { login, register } from "~/utils/auth.server";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.server";
import { useActionData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  // login checking
  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: "Invalid Form Data", form: action }, { status: 400 });
  }

  // registeration checking
  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: "Invalid Form Data", form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );

  switch (action) {
    case "login": {
      return await login({ email, password });
    }
    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
};
export default function Login() {
  const actionData = useActionData(); // helps to use the error data provided by the server/auth
  const [formError, setFormError] = useState(actionData?.error || "");
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [action, setAction] = useState("login");
  const firstLoad = useRef(true);
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.lastName || "",
    lastName: actionData?.fields?.firstName || "",
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

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      };
      setErrors(newState);
      setFormError("");
      setFormData(newState);
    }
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = true;
  }, []);

  return (
    <Layout>
      <div className="h-full flex justify-center items-center flex-col gap-y-4">
        <button
          onClick={() => setAction(action == "login" ? "register" : "login")}
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>
        <h2 className="text-5xl font-extrabold text-yellow-300">
          Welcome to Appreciation!
        </h2>
        <p className="font-semibold text-slate-300">
          {action === "login"
            ? "Log in To Give Some Praise!"
            : "Sign Up To Get Started!"}
        </p>

        <form method="post" className="rounded-2xl bg-gray-200 p-6 w-96">
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {formError}
          </div>
          {/* Email */}
          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
            error={errors?.email}
          />

          {/**Password */}
          <FormField
            htmlFor="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            type="password"
            error={errors?.password}
          />
          {action !== "login" ? (
            <>
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                error={errors?.firstName}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                error={errors?.lastName}
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
            </>
          ) : null}

          {/* Submit */}
          <div className="w-full text-center">
            <button
              type="submit"
              name="_action" //Not sure how this works, but this get the job done for telling backend server what we are doing
              value={action}
              className="rounded-xl cursor-pointer mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1">
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
