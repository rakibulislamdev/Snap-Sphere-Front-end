import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

export default function MorePosts({ postDetails }) {
  const { api } = useAxios();

  const userId = postDetails?.user?._id;
  const currentPostId = postDetails?._id;

  const {
    data: otherPosts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["morePosts", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await api.get(`/posts/user/${userId}`, {
        params: { exclude: currentPostId },
      });
      return data;
    },
    select: (data) => {
      const posts = Array.isArray(data)
        ? data
        : Array.isArray(data?.posts)
        ? data.posts
        : [];
      return posts
        .filter((p) => String(p._id) !== String(currentPostId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Failed to load more posts
      </div>
    );
  }

  return (
    <div className="mb-8 mx-auto max-w-5xl">
      {otherPosts.length > 0 ? (
        <>
          <h2 className="text-sm text-gray-500 font-normal mb-4">
            More posts from
            <span className="font-semibold text-black ml-2">
              {postDetails?.user?.name}
            </span>
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {otherPosts.map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post._id}`}
                className="group block"
              >
                <div
                  className="
                    relative aspect-square
                    rounded-2xl overflow-hidden
                    ring-1 ring-black/5 bg-white
                    shadow-md
                    transform-gpu transition-transform duration-300 ease-out
                    group-hover:scale-105 group-hover:-translate-y-2
                  "
                >
                  <img
                    src={post.image}
                    alt={post.caption || "Post image"}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          No more posts from this user.{" "}
          <span className="font-semibold text-black ml-2">
            {postDetails?.user?.name}
          </span>
        </p>
      )}
    </div>
  );
}
