'use client';

import { useState } from 'react';
import { PostList } from './components/PostList';
import { DuplicateModal } from './components/DuplicateModal';
import { AddFacebookPost } from './components/AddFacebookPost';
import { IncompletePostsList } from './components/IncompletePostsList';
import { LogoutButton } from './components/LogoutButton';
import { useFacebookPosts } from './hooks/useFacebookPosts';
import { useDuplicate } from './hooks/useDuplicate';

export default function Home() {
  const { posts, loading, refetch } = useFacebookPosts();
  const [selected, setSelected] = useState<any>(null);
  const [igPostId, setIgPostId] = useState('');
  const { duplicate, saving, error, setError } = useDuplicate();

  const handleDuplicate = async () => {
    if (await duplicate(selected, igPostId)) {
      setSelected(null);
      setIgPostId('');
      refetch();
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-400 mb-2">PromoGenius Reels</h1>
          <p className="text-gray-400">Gerencie posts Facebook e duplique para Instagram</p>
        </div>
        <LogoutButton />
      </div>
      
      <AddFacebookPost onAdd={refetch} />
      <IncompletePostsList posts={posts} onRefresh={refetch} />
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