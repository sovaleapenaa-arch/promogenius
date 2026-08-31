'use client';

import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader, Clock, Zap } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import React from 'react';

const WEBHOOK_URL = 'https://flowwebhook.bsprime.com.br/webhook/promogenius-upload';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadReelsForm() {
  const [video, setVideo] = useState<File | null>(null);
  const [productName, setProductName] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [igUserId, setIgUserId] = useState('17841414907894883');
  const [pageId, setPageId] = useState('1138600086010974');
  const [offerId, setOfferId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  React.useEffect(() => {
    const savedIgUserId = localStorage.getItem('promogenius_ig_user_id');
    const savedPageId = localStorage.getItem('promogenius_page_id');

    if (savedIgUserId) setIgUserId(savedIgUserId);
    if (savedPageId) setPageId(savedPageId);
  }, []);

  // Salvar no localStorage quando muda
  React.useEffect(() => {
    if (igUserId) localStorage.setItem('promogenius_ig_user_id', igUserId);
  }, [igUserId]);

  React.useEffect(() => {
    if (pageId) localStorage.setItem('promogenius_page_id', pageId);
  }, [pageId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setVideo(file);
        setMessage(null);
      } else {
        setMessage({ type: 'error', text: 'Arquivo deve ser vídeo (MP4, MOV, etc)' });
      }
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setVideo(files[0]);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!video || !productName || !affiliateUrl || !caption || !scheduledAt) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      if (!igUserId || !pageId) {
        throw new Error('Configure ig_user_id e page_id');
      }

      // 1. Upload vídeo pro Supabase Storage
      const filename = `${Date.now()}-${video.name}`;
      const { data, error } = await supabase.storage
        .from('reels')
        .upload(filename, video);

      if (error) throw error;

      const videoUrl = `https://suwlkxyznnjequwkluqn.supabase.co/storage/v1/object/public/reels/${filename}`;

      // 2. Chamar webhook com URL já pronta
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          video_url: videoUrl,
          product_name: productName,
          affiliate_url: affiliateUrl,
          caption,
          scheduled_at: new Date(scheduledAt).toISOString(),
          ig_user_id: igUserId,
          page_id: pageId,
          offer_id: offerId || null
        })
      });

      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

      const data_response = await response.json();
      setMessage({
        type: 'success',
        text: `✅ Reel agendado! Post ID: ${data_response.post_id}`
      });

      // Limpar form
      setVideo(null);
      setProductName('');
      setAffiliateUrl('');
      setCaption('');
      setScheduledAt('');
      setOfferId('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro desconhecido'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 border border-orange-900/20 rounded-lg shadow-2xl p-8 hover:border-orange-600/40 transition">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-orange-400" />
            <h1 className="text-3xl font-bold text-orange-400">PromoGenius Reels</h1>
          </div>
          <p className="text-gray-400 mb-8">Agende vídeos para Instagram e Facebook</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-semibold text-orange-400 mb-2">
                Vídeo *
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                  ? 'border-orange-500 bg-orange-900/20'
                  : 'border-orange-900/20 hover:border-orange-600/40'
                  } ${video ? 'bg-green-900/20 border-green-600/40' : ''}`}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                  id="video-input"
                />
                <label htmlFor="video-input" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                  {video ? (
                    <p className="text-green-400 font-medium">{video.name}</p>
                  ) : (
                    <>
                      <p className="font-medium text-gray-200">Arraste o vídeo aqui</p>
                      <p className="text-sm text-gray-400">ou clique para selecionar (MP4, MOV, até 100MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-orange-400 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: iPhone 15 Pro"
                className="w-full px-4 py-2 border border-orange-900/20 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-600/40 hover:border-orange-600/40 transition"
              />
            </div>

            {/* Affiliate URL */}
            <div>
              <label className="block text-sm font-semibold text-orange-400 mb-2">
                Link Afiliado (Shopee) *
              </label>
              <input
                type="url"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://shopee.com.br/..."
                className="w-full px-4 py-2 border border-orange-900/20 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-600/40 hover:border-orange-600/40 transition"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-semibold text-orange-400 mb-2">
                Legenda *
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Escreva a legenda do reel..."
                rows={4}
                className="w-full px-4 py-2 border border-orange-900/20 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-600/40 hover:border-orange-600/40 transition resize-none"
              />
            </div>

            {/* Agendamento */}
            <div>
              <label className="block text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                <Clock size={16} />
                Data e Hora de Publicação *
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-2 border border-orange-900/20 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-600/40 hover:border-orange-600/40 transition"
              />
            </div>

            {/* IDs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2">
                  IG User ID *
                </label>
                <input
                  type="text"
                  value={igUserId}
                  onChange={(e) => setIgUserId(e.target.value)}
                  placeholder="ID do usuário IG"
                  className="w-full px-4 py-2 border border-orange-900/20 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-600/40 hover:border-orange-600/40 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-orange-400 mb-2">
                  Page ID *
                </label>
                <input
                  type="text"
                  value={pageId}
                  onChange={(e) => setPageId(e.target.value)}
                  placeholder="ID da página FB"
                  className="w-full px-4 py-2 border border-orange-900/20 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-600/40 hover:border-orange-600/40 transition"
                />
              </div>
            </div>

            {/* Offer ID (opcional) */}
            <div>
              <label className="block text-sm font-semibold text-orange-400 mb-2">
                Offer ID (opcional)
              </label>
              <input
                type="text"
                value={offerId}
                onChange={(e) => setOfferId(e.target.value)}
                placeholder="ID da oferta"
                className="w-full px-4 py-2 border border-orange-900/20 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-600/40 hover:border-orange-600/40 transition"
              />
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg flex items-gap-3 border ${message.type === 'success'
                  ? 'bg-green-900/20 text-green-400 border-green-600/40'
                  : 'bg-red-900/20 text-red-400 border-red-600/40'
                  }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-red-400" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-orange-600 hover:border-orange-700"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Agendar Publicação
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}