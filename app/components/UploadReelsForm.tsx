'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const WEBHOOK_URL = 'https://flowwebhook.bsprime.com.br/webhook/promogenius-upload';

export default function UploadReelsForm() {
  const [video, setVideo] = useState<File | null>(null);
  const [productName, setProductName] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Selecione um arquivo de vídeo válido' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!video || !productName || !affiliateUrl || !caption || !scheduledAt) {
      setMessage({ type: 'error', text: 'Preencha todos os campos' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Upload vídeo no Supabase Storage
      const filename = `${Date.now()}-${video.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reels')
        .upload(filename, video, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload falhou: ${uploadError.message}`);
      }

      // 2. Gerar video_url pública
      const video_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/reels/${filename}`;

      // 3. Converter scheduled_at de PT-BR para UTC (soma 3 horas)
      const scheduledDate = new Date(scheduledAt);
      scheduledDate.setHours(scheduledDate.getHours() - 3);
      const scheduledAtUTC = scheduledDate.toISOString();

      // 4. POST webhook com APENAS campos necessários
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          video_url,
          product_name: productName,
          affiliate_url: affiliateUrl,
          caption,
          scheduled_at: scheduledAtUTC,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao agendar publicação');
      }

      setMessage({ type: 'success', text: 'Publicação agendada com sucesso!' });
      setVideo(null);
      setProductName('');
      setAffiliateUrl('');
      setCaption('');
      setScheduledAt('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao processar'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-400 mb-2">PromoGenius Reels</h1>
        <p className="text-gray-300 mb-8">Agende publicações automáticas para Instagram e Facebook</p>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 space-y-6 border border-orange-900/20">
          {/* Upload de Vídeo */}
          <div className="border-2 border-dashed border-orange-600/40 rounded-lg p-8 hover:border-orange-600 transition cursor-pointer">
            <label className="flex flex-col items-center gap-3 cursor-pointer">
              <Upload className="w-8 h-8 text-orange-400" />
              <span className="text-orange-300 font-medium">
                {video ? `✓ ${video.name}` : 'Arraste o vídeo ou clique para selecionar'}
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Produto */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Produto</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Cesto de Roupa Dobrável"
              className="w-full bg-gray-700 border border-orange-900/20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-600"
            />
          </div>

          {/* Link Afiliado */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Link Afiliado</label>
            <input
              type="url"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              placeholder="https://shopee.com.br/..."
              className="w-full bg-gray-700 border border-orange-900/20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-600"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Descrição</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escreva a descrição do produto..."
              rows={4}
              className="w-full bg-gray-700 border border-orange-900/20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-600"
            />
          </div>

          {/* Data e Hora (horário local do navegador, será convertido pra UTC) */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Agendar para (horário local)</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full bg-gray-700 border border-orange-900/20 rounded px-4 py-2 text-white focus:outline-none focus:border-orange-600"
            />
            <p className="text-xs text-gray-400 mt-1">
              Será publicado em Instagram e Facebook simultaneamente
            </p>
          </div>

          {/* Mensagem */}
          {message && (
            <div className={`flex items-center gap-2 p-4 rounded ${message.type === 'success'
                ? 'bg-green-900/20 text-green-300 border border-green-600/20'
                : 'bg-red-900/20 text-red-300 border border-red-600/20'
              }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 rounded transition"
          >
            {loading ? 'Processando...' : 'Agendar Publicação'}
          </button>
        </form>
      </div>
    </div>
  );
}