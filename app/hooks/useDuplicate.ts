import { useState } from 'react';

export function useDuplicate() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duplicate = async (post: any, igPostId: string) => {
    if (!igPostId.trim()) {
      setError('Digite o ID do post do Instagram');
      return false;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facebookPostId: post.id, igPostId })
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      return true;
    } catch (err) {
      setError('Erro ao duplicar');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { duplicate, saving, error, setError };
}