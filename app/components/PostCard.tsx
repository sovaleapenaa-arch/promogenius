import { Copy } from 'lucide-react';

export function PostCard({ post, onDuplicate }: any) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{post.product_name}</p>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.caption}</p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(post.published_at).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <button
        onClick={() => onDuplicate(post)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg whitespace-nowrap"
      >
        <Copy size={16} />
        Duplicar
      </button>
    </div>
  );
}