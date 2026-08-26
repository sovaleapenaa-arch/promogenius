import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { facebookPostId, igPostId } = await req.json();
    console.log('Duplicating:', { facebookPostId, igPostId });

    const { data: fbPost } = await supabase
      .from('social_posts')
      .select('*')
      .eq('id', facebookPostId)
      .single();

    if (!fbPost) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const { error } = await supabase
      .from('social_posts')
      .insert([{
        post_id: igPostId,
        channel: 'instagram',
        caption: fbPost.caption,
        affiliate_url: fbPost.affiliate_url,
        product_name: fbPost.product_name,
        published_at: fbPost.published_at,
        likes: 0,
        comments: 0,
        views: 0
      }]);

    if (error) {
      console.error('Insert error:', error);
      throw error;
    }
    
    console.log('Success');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to duplicate', details: String(err) }, { status: 500 });
  }
}