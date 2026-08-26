import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { product_name, affiliate_url } = await req.json();

    const { error } = await supabase
      .from('social_posts')
      .update({ product_name, affiliate_url })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}