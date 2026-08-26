import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { product_name, affiliate_url, caption, channel } = await req.json();

    const { error } = await supabase
      .from('social_posts')
      .insert([{
        product_name,
        affiliate_url,
        caption,
        channel,
        published_at: new Date().toISOString(),
        likes: 0,
        comments: 0,
        views: 0
      }]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Add post error:', err);
    return NextResponse.json({ error: 'Failed to add post' }, { status: 500 });
  }
}