import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching Facebook posts...');
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('channel', 'facebook')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Posts:', data?.length);
    return NextResponse.json(data);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: String(err) },
      { status: 500 }
    );
  }
}