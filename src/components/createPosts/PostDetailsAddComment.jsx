import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Field from "../common/Field";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.png";

export default function PostDetailsAddComment({
  post,
  onEditComment,
  setOnEditComment,
}) {
  const { api } = useAxios();
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");

  // Update comment input when editing a comment
  useEffect(() => {
    setComment(onEditComment?.text ?? "");
  }, [onEditComment]);

  // Mutation for adding or updating comment
  const { mutate: submitComment, isLoading } = useMutation({
    mutationFn: async (commentData) => {
      const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

      if (onEditComment) {
        // Update existing comment
        const response = await api.patch(
          `${baseUrl}/posts/comment/${onEditComment._id}`,
          commentData
        );
        return response.data;
      } else {
        // Add new comment
        const response = await api.post(
          `${baseUrl}/posts/${post._id}/comment`,
          commentData
        );
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetails", post._id]);
      toast.success(onEditComment ? "Comment updated" : "Comment posted");
      setComment("");
      if (onEditComment && setOnEditComment) {
        setOnEditComment(null);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to post comment");
    },
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      toast.error("Comment cannot be empty");
      return;
    }

    submitComment({ text: trimmedComment });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleCommentSubmit}
      className="p-3 flex items-center border-t"
    >
      {/* User Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 mr-2">
        <img
          src={!auth?.user?.avatar ? defaultAvatar : `${auth?.user?.avatar}`}
          alt={auth?.user?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Comment Input */}
      <div className="flex-1 flex items-center space-x-2">
        <Field className="flex-1">
          <textarea
            disabled={isLoading}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            value={comment}
            name="comment"
            id="comment"
            rows={1}
            placeholder="Add a comment..."
            className="text-sm w-full outline-none resize-none overflow-hidden"
            style={{ height: "auto", minHeight: "20px" }}
          />
        </Field>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !comment.trim()}
          className={`
            text-sm font-semibold 
            ${comment.trim() ? "text-blue-500" : "text-blue-300"}
            ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-600"
            }
          `}
        >
          {onEditComment ? "Update" : "Post"}
        </button>
      </div>
    </form>
  );
}
