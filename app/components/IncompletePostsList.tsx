import { Edit2 } from 'lucide-react';
import { useState } from 'react';

export function IncompletePostsList({ posts, onRefresh }: any) {
  const [editing, setEditing] = useState<any>(null);
  const [product, setProduct] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const incomplete = posts.filter((p: any) => !p.product_name || !p.affiliate_url);

  const handleEdit = (post: any) => {
    setEditing(post);
    setProduct(post.product_name || '');
    setUrl(post.affiliate_url || '');
  };

  const handleSave = async () => {
    if (!product || !url) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/update-post/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: product, affiliate_url: url })
      });

      if (res.ok) {
        setEditing(null);
        onRefresh();
      }
    } finally {
      setSaving(false);
    }
  };

  if (incomplete.length === 0) return null;

  return (
    <>
      <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
        <p className="text-sm text-yellow-400">
          {incomplete.length} post(s) incompleto(s) — preencha os dados antes de duplicar
        </p>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        {incomplete.map((post: any) => (
          <div key={post.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-yellow-600/30">
            <div className="flex-1">
              <p className="text-sm text-gray-300">{post.channel.toUpperCase()}</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-3">{post.caption}</p>
              <p className="text-xs text-gray-500 mt-1">
                {!post.product_name && 'Falta: Produto'} {!post.product_name && !post.affiliate_url && '•'} {!post.affiliate_url && 'Falta: Link'}
              </p>
            </div>
            <button
              onClick={() => handleEdit(post)}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition"
            >
              <Edit2 size={16} />
              Preencher
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 border border-orange-900/20">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Completar Dados</h3>

            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Nome do produto"
              className="w-full px-4 py-2 bg-gray-800 border border-orange-900/30 rounded-lg mb-3 text-white"
            />

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Link de afiliado"
              className="w-full px-4 py-2 bg-gray-800 border border-orange-900/30 rounded-lg mb-4 text-white"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}