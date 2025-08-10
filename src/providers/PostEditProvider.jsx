import { useState } from "react";
import { PostEditContext } from "../context";

export default function PostEditProvider({ children }) {
  const [editModal, setEditModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  return (
    <PostEditContext.Provider
      value={{ editModal, setEditModal, postToEdit, setPostToEdit }}
    >
      {children}
    </PostEditContext.Provider>
  );
}
