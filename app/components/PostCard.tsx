import { Copy, Clock } from 'lucide-react';

export function PostCard({ post, onDuplicate }: any) {
  const date = new Date(post.published_at);
  const dateStr = date.toLocaleDateString('pt-BR');
  const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="border border-orange-900/20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 flex justify-between items-start gap-4 hover:border-orange-600/40 transition">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-orange-400">{post.product_name}</p>
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{post.caption}</p>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <Clock size={14} />
          <span>{dateStr} às {timeStr}</span>
        </div>
      </div>
      <button
        onClick={() => onDuplicate(post)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg whitespace-nowrap transition"
      >
        <Copy size={16} />
        Duplicar
      </button>
    </div>
  );
}