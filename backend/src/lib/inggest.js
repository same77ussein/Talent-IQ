import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/User.js";

export const inngest = new Inngest({
  id: "talent-iq",
});

const syncUser = inngest.createFunction(
  { name: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, firstName, lastName, image_url } = event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${firstName || ""} ${lastName || ""}`.trim(),
      profileImage: image_url,
    };
    await User.create(newUser);
  },
);

const deleteUser = inngest.createFunction(
  { name: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.findOneAndDelete({ clerkId: id });
  },
);
export const functions = [syncUser, deleteUser];
