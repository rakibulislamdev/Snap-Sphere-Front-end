import { useState } from "react";

export default function Caption({ post }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safely access caption with optional chaining
  const caption = post?.caption?.trim() || "";

  // Configuration for caption display
  const MAX_LENGTH = 100;

  // If no caption, return null
  if (!caption) {
    return null;
  }

  // Determine if caption needs truncation
  const isLongCaption = caption.length > MAX_LENGTH;

  // Toggle caption expansion
  const toggleCaption = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="px-3 mt-2">
      <p className="text-sm">
        <span className="font-semibold">
          {/* Render full or truncated caption based on state */}
          {isExpanded || !isLongCaption
            ? caption
            : `${caption.slice(0, MAX_LENGTH)}`}
        </span>

        {/* Ellipsis for long captions */}
        {isLongCaption && !isExpanded && (
          <span className="text-gray-500">...</span>
        )}

        {/* Show more/less button for long captions */}
        {isLongCaption && (
          <button
            onClick={toggleCaption}
            className="text-gray-500 text-sm ml-2 hover:underline focus:outline-none"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </p>
    </div>
  );
}
