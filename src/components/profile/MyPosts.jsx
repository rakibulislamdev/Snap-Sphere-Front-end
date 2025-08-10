import { Link } from "react-router-dom";

export default function MyPosts({ userProfile }) {
  const posts = userProfile?.posts || [];

  return (
    <section>
      <h3 className="font-semibold text-lg mb-4">Posts</h3>

      <div className="grid grid-cols-3 gap-1">
        {posts.length > 0 ? (
          posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => (
              <Link key={post._id} to={`/posts/${post._id}`}>
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full grid-image"
                  />
                </div>
              </Link>
            ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 py-4">
            No posts yet
          </p>
        )}
      </div>
    </section>
  );
}
