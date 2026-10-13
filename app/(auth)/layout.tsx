import * as React from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-[#0b0f17]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2.5 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-900/40">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Sentiment<span className="text-indigo-400">IQ</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 max-w-xs">
            AI-powered social media sentiment tracking, brand intelligence, and trend analytics.
          </p>
        </div>

        {/* Auth form card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          Protected by Supabase Row-Level Security & Google Gemini AI
        </div>
      </div>
    </div>
  );
}
