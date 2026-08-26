import { Plus } from 'lucide-react';
import { useState } from 'react';

export function AddFacebookPost({ onAdd }: any) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState('');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!product || !url) {
      alert('Preencha produto e link de afiliado');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/add-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: product,
          affiliate_url: url,
          caption: caption || 'Achei na SHOPEE 🧡 Comenta "QUERO"',
          channel: 'facebook'
        })
      });

      if (res.ok) {
        setProduct('');
        setUrl('');
        setCaption('');
        setOpen(false);
        onAdd();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium mb-6"
      >
        <Plus size={18} />
        Novo Post Facebook
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 border border-orange-900/20">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">Novo Post Facebook</h3>

            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Nome do produto"
              className="w-full px-4 py-2 bg-gray-800 border border-orange-900/30 rounded-lg mb-3 text-white placeholder-gray-500"
            />

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Link de afiliado"
              className="w-full px-4 py-2 bg-gray-800 border border-orange-900/30 rounded-lg mb-3 text-white placeholder-gray-500"
            />

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Legenda (opcional)"
              className="w-full px-4 py-2 bg-gray-800 border border-orange-900/30 rounded-lg mb-4 text-white placeholder-gray-500 min-h-24"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}