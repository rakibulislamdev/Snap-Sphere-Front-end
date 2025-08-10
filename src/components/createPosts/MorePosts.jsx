import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // react-router-dom এ পরিবর্তন
import useAxios from "../../hooks/useAxios";

export default function MorePosts({ postDetails }) {
  const { api } = useAxios();

  const {
    data: morePosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["morePosts", postDetails?.user?._id],
    queryFn: async () => {
      const response = await api.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/user/${
          postDetails?.user?._id
        }`
      );
      return response.data;
    },
    enabled: !!postDetails?.user?._id, // শুধুমাত্র ব্যবহারকারী আইডি থাকলে কোয়েরি চালাবে
    staleTime: 5 * 60 * 1000, // 5 মিনিট
    cacheTime: 10 * 60 * 1000, // 10 মিনিট
  });

  // অন্যান্য পোস্ট ফিল্টার
  const otherPosts =
    morePosts?.posts?.filter((post) => post._id !== postDetails?._id) || [];

  // লোডিং অবস্থা
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // ত্রুটি অবস্থা
  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Failed to load more posts
      </div>
    );
  }

  // কোন পোস্ট নেই
  if (otherPosts.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No other posts from this user
      </div>
    );
  }

  return (
    <div className="mb-8 mx-auto max-w-5xl">
      <h2 className="text-sm text-gray-500 font-normal mb-4">
        {otherPosts.length > 1 ? "More posts from" : "One more post from"}
        <span className="font-semibold text-black ml-2">
          {postDetails?.user?.name}
        </span>
      </h2>

      <div className="grid grid-cols-3 gap-1">
        {otherPosts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => (
            <Link key={post._id} to={`/posts/${post._id}`} className="group">
              <div className="relative overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_STATIC_BASE_URL}/${post.image}`}
                  alt={post.caption || "Post image"}
                  className="w-full h-full object-cover grid-image 
                    group-hover:scale-105 transition-transform duration-300"
                />

                {/* হোভার এফেক্ট */}
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 
                  group-hover:bg-opacity-20 transition-all duration-300"
                ></div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
