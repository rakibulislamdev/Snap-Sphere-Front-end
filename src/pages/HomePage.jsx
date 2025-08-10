import { Link, useParams } from "react-router-dom";
import {
  CommentIcon,
  DeleteIcon,
  EditIcon,
  LikeFillIcon,
  LikeIcon,
  ShareIcon,
  ThreeDotsIcon,
} from "../utils/svg";
import useAxios from "../hooks/useAxios";
import { useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import LoadingPostSkeleton from "../components/common/LoadingPostSkeleton";
import defaultAvatar from "../assets/defaultAvatar.png";
import Caption from "../components/caption/Caption";
import PostComment from "../components/postComments/PostComment";
import getTimeDateYear from "../utils/getTimeDateYear";

import { toast } from "react-toastify";
import { useState } from "react";
import LikesModal from "../components/postLikes/LikesModal";
import CreatePostModal from "../components/createPosts/CreatePostModal";
import usePostEdit from "../hooks/usePostEdit";
import LoginModal from "../components/auth/LoginModal";
import usePostViewLimit from "../hooks/usePostViewLimit";
import useGlobalLogin from "../hooks/useGlobalLogin";
import { useAuth } from "../hooks/useAuth";

const pageLimit = 10;

export default function HomePage() {
  const { api } = useAxios();
  const loadMoreRef = useRef(null);
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const { id } = useParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [selectedLikes, setSelectedLikes] = useState([]);
  const { editModal, setEditModal, postToEdit, setPostToEdit } = usePostEdit();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  useGlobalLogin(auth, isLoginModalOpen, setIsLoginModalOpen);

  const {
    data: allPosts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allPosts", id],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/posts/?page=${pageParam}&limit=${pageLimit}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageLimit ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    const onIntersection = (entries) => {
      const loaderItem = entries[0];
      if (loaderItem.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    };

    const observer = new IntersectionObserver(onIntersection);

    if (observer && loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage]);

  const { mutate: likePost } = useMutation({
    mutationFn: async ({ postId }) => {
      const response = await api.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${postId}/like`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allPosts"]);
    },

    onError: (error) => {
      console.error(error);
      toast.error("Failed to like/unlike post");
    },
  });

  const { mutate: deletePost, isLoading: isDeleting } = useMutation({
    mutationFn: async (postId) => {
      try {
        const response = await api.delete(
          `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${postId}`
        );
        return response.data;
      } catch (error) {
        console.error(
          "Delete post error details:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["allPosts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages
            .map((page) => page.filter((post) => post._id !== postId))
            .filter((page) => page.length > 0),
        };
      });

      queryClient.invalidateQueries(["allPosts"]);
      toast.success("Post deleted successfully");
      setIsDropdownOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete post. Please try again."
      );
    },
  });

  const handlePostDelete = (postId) => {
    deletePost(postId);
  };

  const handleLike = (postId) => {
    likePost({ postId });
  };

  const handleSharePost = (postId) => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    try {
      navigator.clipboard.writeText(postUrl);
      toast.success("Post URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy post URL");
      console.error("Failed to copy post URL:", error);
    }
  };

  const handleEditPost = (post) => {
    setPostToEdit(post);
    setEditModal(true);
    setIsDropdownOpen(false);
  };

  const posts = allPosts?.pages?.flat(Infinity) || [];

  const { registerPostRef } = usePostViewLimit({
    posts,
    auth,
    limit: 3,
    onLimitReached: () => {
      setIsLoginModalOpen(true);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 mt-10">
        {[...Array(2)].map((idx) => (
          <LoadingPostSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">{error.message}</div>
    );
  }

  return (
    <>
      {(auth?.accessToken
        ? posts
        : posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
      ).map((post) => (
        <article
          key={post._id}
          ref={registerPostRef(post._id)}
          className="border-gray-200 pb-4 mb-4 max-w-[560px] mx-auto border rounded-md my-10"
        >
          <div className="flex items-center p-3 relative">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs">
              <img
                src={
                  !post?.user?.avatar ? defaultAvatar : `${post?.user?.avatar}`
                }
                alt={post?.user?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-2">
              <Link
                to={`profile/${post?.user?._id}`}
                className="font-semibold text-sm"
              >
                {post.user.name}
              </Link>
              <span className="text-gray-500 text-xs">
                {" "}
                • {getTimeDateYear(post.createdAt)}
              </span>
            </div>

            <div className="ml-auto relative">
              {post?.user?._id === auth?.user?._id && (
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className=" p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                  aria-label="Open options"
                >
                  <ThreeDotsIcon />
                </button>
              )}

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-md z-50 border border-gray-200">
                  <button
                    className="flex items-center justify-evenly w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEditPost(post)}
                  >
                    <EditIcon className="w-4 h-4 mr-2" /> Edit
                  </button>

                  <button
                    className="flex items-center justify-evenly w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePostDelete(post._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span> Deleting...
                      </>
                    ) : (
                      <>
                        <DeleteIcon className="w-4 h-4 mr-2" /> Delete
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <img
              src={`${post?.image}`}
              alt={post?.title}
              className="w-full object-cover max-h-[1000px]"
            />
          </div>
          {/* Post Actions */}
          <div className="flex justify-between p-3">
            <div className="flex space-x-4">
              <button
                onClick={() => handleLike(post._id)}
                className="like-button cursor-pointer"
              >
                {post.likes.find((like) => like._id === auth?.user?._id) ? (
                  <LikeFillIcon />
                ) : (
                  <LikeIcon />
                )}
              </button>
              <button>
                <CommentIcon />
              </button>
            </div>

            <button
              onClick={() => handleSharePost(post._id)}
              className="cursor-pointer"
            >
              <ShareIcon />
            </button>
          </div>

          <div className="px-3">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setSelectedLikes(post?.likes);
                setIsLikesModalOpen(true);
              }}
            >
              <div className="h-6 flex -space-x-2">
                {post?.likes?.slice(0, 3).map((user) => (
                  <img
                    key={user._id}
                    src={!user?.avatar ? defaultAvatar : `${user?.avatar}`}
                    alt={user?.name}
                    className="w-6 h-6 rounded-full"
                  />
                ))}
              </div>

              <p className="text-sm ml-2">
                <span className="font-semibold">
                  {post?.likes.length} likes
                </span>
              </p>
            </div>
          </div>
          <Caption post={post} />
          <PostComment post={post} />
        </article>
      ))}
      <div ref={loadMoreRef} className="text-center py-4">
        {isFetchingNextPage ? (
          <p>Loading...</p>
        ) : (
          !hasNextPage && <p className="text-gray-400 text-sm">No more posts</p>
        )}
      </div>

      <CreatePostModal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setPostToEdit(null);
        }}
        postToEdit={postToEdit}
      />

      {isLikesModalOpen && (
        <LikesModal
          isOpen={isLikesModalOpen}
          onClose={() => setIsLikesModalOpen(false)}
          likes={selectedLikes}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </>
  );
}
