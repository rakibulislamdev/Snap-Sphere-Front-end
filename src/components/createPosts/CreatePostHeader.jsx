import { LeftArrowIcon } from "../../utils/svg";

export default function CreatePostHeader({ onCreatePost, onClose }) {
  return (
    <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 ">
      <button onClick={onClose} className="p-1 cursor-pointer">
        <LeftArrowIcon />
      </button>
      <h1 className="text-base font-semibold">Create new post</h1>
      <button
        onClick={onCreatePost}
        className="cursor-pointer text-blue-500 font-semibold"
      >
        Post
      </button>
    </header>
  );
}
