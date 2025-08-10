import { useContext } from "react";
import { PostEditContext } from "../context";

export default function usePostEdit() {
  return useContext(PostEditContext);
}
