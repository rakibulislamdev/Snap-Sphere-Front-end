import defaultAvatar from "../../assets/defaultAvatar.png";

export default function LikesModal({ isOpen, onClose, likes }) {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "modalOverlay") onClose();
  };

  return (
    <div
      id="modalOverlay"
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative border border-gray-200">
        <button
          className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Liked by</h2>

        <div className="space-y-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pr-1">
          {likes.length === 0 ? (
            <p className="text-sm text-gray-500">No likes found.</p>
          ) : (
            likes.map((user) => (
              <div key={user._id} className="flex items-center gap-3">
                <img
                  src={!user?.avatar ? defaultAvatar : user?.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
