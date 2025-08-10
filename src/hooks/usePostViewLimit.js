import { useEffect, useRef, useState } from "react";

export default function usePostViewLimit({
  posts = [],
  auth,
  limit = 3,
  onLimitReached,
}) {
  const postRefs = useRef(new Map());
  const [viewedPostIds, setViewedPostIds] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    if (auth?.accessToken) return;

    const handleIntersection = (entries) => {
      const updated = new Set(viewedPostIds);

      for (const entry of entries) {
        if (entry.isIntersecting) {
          const postId = [...postRefs.current.entries()].find(
            ([, el]) => el === entry.target
          )?.[0];

          if (postId && !updated.has(postId)) {
            updated.add(postId);
          }
        }
      }

      if (updated.size !== viewedPostIds.size) {
        setViewedPostIds(updated);
      }

      if (updated.size >= limit) {
        onLimitReached?.();
        observerRef.current?.disconnect();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    postRefs.current.forEach((el) => {
      if (el) observerRef.current.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [posts, auth, viewedPostIds, limit, onLimitReached]);

  // Register ref to element
  const registerPostRef = (postId) => (el) => {
    if (el) postRefs.current.set(postId, el);
  };

  return { registerPostRef };
}
