import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { FormField } from "~/components/form-field";
import { Modal } from "~/components/modal";
import { SelectBox } from "~/components/select-box";
import { getUser } from "~/utils/auth.server";
import { departments } from "~/utils/constants";

export const loader: LoaderFunction = async ({ request }) => {
  // get user and return it as json
  const user = await getUser(request);
  return json({ user });
};
export default function ProfileModal() {
  const { user } = useLoaderData();
  const [formData, setFormData] = useState({
    firstName: user?.profile.firstName,
    lastName: user?.profile.lastName,
    department: user?.profile.department,
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };
  return (
    <Modal isOpen={true} className="w-1/3">
      <div className="p-3">
        <h2 className="text-4xl font-semibold text-blue-600 text-center mb-4">
          Your Profile
        </h2>
        <div className="flex">
          <div className="w-1/3"></div> {/* Image Uploader */}
          <div className="flex-1">
            <form>
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
              />

              <SelectBox
                className="w-full rounded-xl px-3 py-2 text-gray-400"
                id="department"
                label="Department"
                name="department"
                options={departments}
                value={formData.department}
                onChange={(e) => handleInputChange(e, "department")}
              />
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
