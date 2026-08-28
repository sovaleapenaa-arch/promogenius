'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        console.log('Login attempt:', email);

        try {
            console.log('Supabase instance:', supabase);
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            console.log('Sign in response:', { data, error: signInError });

            if (signInError) throw signInError;
            if (data.user) {
                console.log('Login success, redirecting...');
                router.push('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(String(err).split('\n')[0]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-8 max-w-sm w-full border border-orange-900/20">
                <h1 className="text-2xl font-bold text-orange-400 mb-6 text-center">PromoGenius</h1>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2 bg-gray-700 border border-orange-900/30 rounded-lg mb-3 text-white placeholder-gray-500"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full px-4 py-2 bg-gray-700 border border-orange-900/30 rounded-lg mb-4 text-white placeholder-gray-500"
                />

                {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </div>
        </div>
    );
}