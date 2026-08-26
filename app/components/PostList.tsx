import { PostCard } from './PostCard';

export function PostList({ posts, onDuplicate }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Posts Facebook</h2>
      <p className="text-sm text-gray-600 mb-4">Clique em duplicar para criar a versão Instagram</p>
      <div className="flex flex-col gap-2">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} onDuplicate={onDuplicate} />
        ))}
      </div>
    </div>
  );
}