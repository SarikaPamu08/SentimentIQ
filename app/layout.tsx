import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/layout/app-providers';

export const metadata: Metadata = {
  title: 'SentimentIQ — AI Sentiment Tracker for Social Media',
  description: 'AI-powered social media sentiment tracking, brand perception intelligence, and actionable recommendations powered by Google Gemini and Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
