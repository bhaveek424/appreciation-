import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Modal } from "~/components/modal";
import { getUserById } from "~/utils/users.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { userId } = params;
  if (typeof userId !== "string") {
    return redirect("/home");
  }

  const user = await getUserById(userId);
  return json({ user });
};
export default function KudoModal() {
  const { user } = useLoaderData();
  return (
    <Modal isOpen={true}>
      <h2>{user.profile.firstName}</h2>
    </Modal>
  );
}
