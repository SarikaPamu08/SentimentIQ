'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useProject } from '@/components/layout/project-context';

export default function LoginPage() {
  const router = useRouter();
  const { loadDemoData } = useProject();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // If Supabase is not configured yet or credentials invalid
        if (authError.message.includes('FetchError') || authError.message.includes('Invalid API key') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
          // Switch to demo mode seamlessly
          loadDemoData();
          router.push('/');
          return;
        }
        setError(authError.message);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loadDemoData();
    router.push('/');
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Sign in to your account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your sentiment tracking dashboards and AI reports
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4">
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="analyst@brand.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-950"
          isLoading={isLoading}
        >
          <LogIn className="w-4 h-4 mr-1.5" />
          Sign In
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0f172a] px-2 text-slate-500 font-medium">Or explore</span>
        </div>
      </div>

      {/* Quick demo sign in */}
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={handleDemoSignIn}
        className="w-full border-indigo-800/60 text-indigo-300 hover:bg-indigo-950/40 text-xs"
      >
        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
        Explore with Demo Account & Data
      </Button>

      <p className="text-center text-xs text-slate-400 pt-2">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5">
          Sign up <ArrowRight className="w-3 h-3" />
        </Link>
      </p>
    </div>
  );
}
