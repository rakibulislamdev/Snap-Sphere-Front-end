import CreatePost from "./CreatePost";

export default function CreatePostModal({ isOpen, onClose, postToEdit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto overflow-x-scroll">
        <CreatePost onClose={onClose} postToEdit={postToEdit} />
      </div>
    </div>
  );
}
