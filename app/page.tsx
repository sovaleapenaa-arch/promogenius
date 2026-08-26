'use client';

import { useState } from 'react';
import { PostList } from './components/PostList';
import { DuplicateModal } from './components/DuplicateModal';
import { useFacebookPosts } from './hooks/useFacebookPosts';
import { useDuplicate } from './hooks/useDuplicate';

export default function Home() {
  const { posts, loading } = useFacebookPosts();
  const [selected, setSelected] = useState<any>(null);
  const [igPostId, setIgPostId] = useState('');
  const { duplicate, saving, error, setError } = useDuplicate();

  const handleDuplicate = async () => {
    if (await duplicate(selected, igPostId)) {
      setSelected(null);
      setIgPostId('');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <PostList
        posts={posts}
        onDuplicate={(post: any) => {
          setSelected(post);
          setIgPostId('');
          setError(null);
        }}
      />
      <DuplicateModal
        isOpen={!!selected}
        igPostId={igPostId}
        onIgPostIdChange={setIgPostId}
        onDuplicate={handleDuplicate}
        onClose={() => setSelected(null)}
        saving={saving}
        error={error}
      />
    </div>
  );
}