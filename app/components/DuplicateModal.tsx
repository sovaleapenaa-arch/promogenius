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
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Duplicar para Instagram</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">
          ID do post Instagram
        </label>
        <input
          type="text"
          value={igPostId}
          onChange={(e) => onIgPostIdChange(e.target.value)}
          placeholder="Ex: 18214894255338014"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-3"
        />

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onDuplicate}
            disabled={saving}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Duplicar'}
          </button>
        </div>
      </div>
    </div>
  );
}
