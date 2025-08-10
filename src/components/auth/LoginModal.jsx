export default function LoginModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#1E1F24] rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Login Required
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          You need to log in to view more posts.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2B2C30]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              window.location.href = "/login";
            }}
            className="px-4 py-2 rounded-lg bg-[#00D991] hover:bg-[#00c783] text-white text-sm font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
