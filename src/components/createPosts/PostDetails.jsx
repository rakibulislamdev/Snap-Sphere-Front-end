import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Link, useNavigate, useParams } from "react-router-dom"; // react-router-dom এ পরিবর্তন
import defaultAvatar from "../../assets/defaultAvatar.png";
import PostDetailsAddComment from "./PostDetailsAddComment";
import {
  DeepCommentIcon,
  DeepLikeIcon,
  DeepShareIcon,
  DeleteIcon,
  EditIcon,
  LikeFillIcon,
  ThreeDotsIcon,
} from "../../utils/svg";
import MorePosts from "./MorePosts";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import getTimeDateYear from "../../utils/getTimeDateYear";
import formatPostDate from "../../utils/formatPostDate";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import usePostEdit from "../../hooks/usePostEdit";

export default function PostDetails() {
  const { id } = useParams();
  const { api } = useAxios();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [toggleDropdown, setToggleDropdown] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editTargetComment, setEditTargetComment] = useState(null);
  const { editModal, setEditModal, setPostToEdit } = usePostEdit();
  const queryClient = useQueryClient();

  const {
    data: postDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["postDetails", id],
    queryFn: async () => {
      const response = await api.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${id}`
      );
      return response.data;
    },
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { mutate: likePost } = useMutation({
    mutationFn: async ({ postId }) => {
      const response = await api.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${postId}/like`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetails", id]);
    },
  });

  const handleLikePost = (postId) => {
    likePost({ postId });
  };

  const handleSharePost = async (postId) => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Post URL copied to clipboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy post URL");
    }
  };

  const handleDropdownToggle = (commentId) => {
    setToggleDropdown(commentId === toggleDropdown ? null : commentId);
  };

  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId) => {
      const response = await api.delete(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/comment/${commentId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetails", id]);
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete comment");
    },
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: async (postId) => {
      const response = await api.delete(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${postId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.removeQueries(["postDetails", id]);
      navigate("/");
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete post");
    },
  });

  const handleDeletePost = (postId) => {
    deletePost(postId);
  };

  const postToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId);
  };

  const handleEditComment = (comment) => {
    setEditTargetComment(comment);
    setToggleDropdown(null);
  };

  const handleEditPost = (postDetails) => {
    setPostToEdit(postDetails);
    setEditModal(true);
    setIsDropdownOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError && error?.response?.status === 404) {
    return (
      <div className="text-center py-16 text-lg">
        This post is no longer available.
      </div>
    );
  }

  return (
    <div className="py-10 ml-[var(--sidebar-width)] px-4">
      <div className="bg-white border border-gray-300 overflow-hidden mb-8 mx-auto max-w-5xl">
        {postDetails && (
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-black flex items-center">
              <img
                loading="lazy"
                src={
                  !postDetails?.image ? defaultAvatar : `${postDetails.image}`
                }
                alt={postDetails?.caption}
                className="w-full post-image"
              />
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-300 relative">
                <Link to={`/profile/${postDetails?.user?._id}`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        loading="lazy"
                        src={
                          !postDetails?.user?.avatar
                            ? defaultAvatar
                            : `${postDetails?.user?.avatar}`
                        }
                        alt={postDetails?.user?.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="ml-2">
                      <span className="font-semibold text-sm">
                        {postDetails?.user?.name}
                      </span>
                      <div className="text-[10px] text-gray-600">
                        {formatPostDate(postDetails?.createdAt)}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Post Dropdown */}
                <div className="relative">
                  {postDetails?.user?._id === auth?.user?._id && (
                    <button
                      onClick={postToggleDropdown}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ThreeDotsIcon />
                    </button>
                  )}

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-md z-50">
                      <button
                        onClick={() => handleEditPost(postDetails)}
                        className="flex justify-evenly items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeletePost(postDetails._id)}
                        className="flex justify-evenly items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <DeleteIcon className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div className="p-3">
                <p className="text-sm">{postDetails?.caption}</p>
              </div>

              {/* Comments Section */}
              <div className="comments-section flex-grow p-3 border-b border-gray-300">
                <h3 className="font-bold pb-4">Comments</h3>

                {postDetails?.comments
                  ?.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )
                  .map((comment) => (
                    <div key={comment._id} className="flex mb-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r mr-2">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white p-[1px]">
                          <img
                            loading="lazy"
                            src={
                              !comment?.user?.avatar
                                ? defaultAvatar
                                : `${comment.user.avatar}`
                            }
                            alt={comment?.user?.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Link to={`/profile/${comment?.user?._id}`}>
                            <div className="flex items-center">
                              <span className="font-semibold text-sm">
                                {comment?.user?.name}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {getTimeDateYear(comment?.createdAt)}
                              </span>
                            </div>
                          </Link>

                          {/* Comment Dropdown */}
                          <div className="relative group">
                            {comment?.user?._id === auth?.user?._id && (
                              <button
                                onClick={() =>
                                  handleDropdownToggle(comment._id)
                                }
                                className="text-gray-600 hover:text-gray-800 cursor-pointer"
                              >
                                <ThreeDotsIcon />
                              </button>
                            )}

                            {toggleDropdown === comment._id && (
                              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-300 shadow-lg rounded-md z-50">
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="w-full flex items-center justify-evenly text-left px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  <EditIcon /> Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment._id)
                                  }
                                  className="w-full flex items-center justify-evenly  text-left px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                  <DeleteIcon /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm mt-2 text-gray-800">
                          {comment?.text}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Post Actions */}
              <div className="p-3 border-b border-gray-300">
                <div className="flex justify-between mb-2">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLikePost(postDetails?._id)}
                      className="cursor-pointer"
                    >
                      {postDetails?.likes.find(
                        (user) => user._id === auth?.user?._id
                      ) ? (
                        <LikeFillIcon />
                      ) : (
                        <DeepLikeIcon />
                      )}
                    </button>
                    <button>
                      <DeepCommentIcon />
                    </button>
                    <button
                      onClick={() => handleSharePost(postDetails?._id)}
                      className="cursor-pointer"
                    >
                      <DeepShareIcon />
                    </button>
                  </div>
                </div>

                <div className="mb-1">
                  <p className="text-sm font-semibold">
                    {postDetails?.likes.length} likes
                  </p>
                </div>

                <div className="mb-2">
                  <p className="text-xs text-gray-500">
                    {getTimeDateYear(postDetails?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Add Comment */}
              <PostDetailsAddComment
                post={postDetails}
                onEditComment={editTargetComment}
                setOnEditComment={setEditTargetComment}
              />
            </div>
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={editModal}
        postToEdit={postDetails}
        onClose={() => {
          setEditModal(false);
          setPostToEdit(null);
        }}
      />

      <MorePosts postDetails={postDetails} />
    </div>
  );
}
