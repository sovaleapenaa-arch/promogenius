import { X } from 'lucide-react';

export function DuplicateModal({
  isOpen,
  igPostId,
  onIgPostIdChange,
  onDuplicate,
  onClose,
  saving,
  error
}: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 border border-orange-900/20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-orange-400">Duplicar para Instagram</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-lg transition">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <label className="block text-xs font-semibold text-orange-300 mb-2 uppercase tracking-wide">
          ID do post Instagram
        </label>
        <input
          type="text"
          value={igPostId}
          onChange={(e) => onIgPostIdChange(e.target.value)}
          placeholder="Ex: 18214894255338014"
          className="w-full px-4 py-3 text-sm bg-gray-800 border border-orange-900/30 rounded-lg mb-4 text-white placeholder-gray-500 focus:border-orange-600 focus:outline-none transition"
        />

        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 border border-red-900/40 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-700 text-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onDuplicate}
            disabled={saving}
            className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition font-medium"
          >
            {saving ? 'Salvando...' : 'Duplicar'}
          </button>
        </div>
      </div>
    </div>
  );
}