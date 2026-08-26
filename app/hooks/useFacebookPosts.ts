import { useState, useEffect } from 'react';

export function useFacebookPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  const refetch = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  };

  return { posts, loading, refetch };
}