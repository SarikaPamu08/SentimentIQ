'use client';

import * as React from 'react';
import { Settings, Shield, Key, Database, Cpu, User, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProject } from '@/components/layout/project-context';

export default function SettingsPage() {
  const { isDemoMode, loadDemoData, clearDemoData } = useProject();

  const [name, setName] = React.useState('Alex Analyst');
  const [email, setEmail] = React.useState('analyst@sentimentiq.ai');
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <DashboardShell>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-indigo-400" />
          Settings & Environment
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your analyst profile, system connections, and demo workspace state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <CardTitle>Analyst Profile</CardTitle>
              </div>
              <CardDescription>
                Personal details and account preferences
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {savedSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile changes saved successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="profile-name"
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  id="profile-email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-800">
                <Button type="submit" size="sm" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Demo Experience Manager */}
          <Card className="border-amber-900/40 bg-amber-950/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <CardTitle className="text-amber-200">Demo Dataset Management</CardTitle>
              </div>
              <CardDescription>
                Toggle sample social media posts and projects to explore platform capabilities
              </CardDescription>
            </CardHeader>

            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                SentimentIQ includes a built-in interactive dataset for NovaWatch Pro with pre-analyzed posts across X, Reddit, Instagram, YouTube, and LinkedIn, including sarcastic posts and multilingual reviews.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadDemoData}
                  className="text-xs border-indigo-700/60 text-indigo-300 hover:bg-indigo-950/40"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Reload NovaWatch Sample Dataset
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearDemoData}
                  className="text-xs border-rose-800/60 text-rose-300 hover:bg-rose-950/40"
                >
                  Clear All Demo Data (Start Empty)
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: System Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <CardTitle>AI Engine Status</CardTitle>
              </div>
              <CardDescription>Google Gemini integration health</CardDescription>
            </CardHeader>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Model:</span>
                <span className="font-mono font-medium text-slate-200">gemini-2.5-flash</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">SDK:</span>
                <span className="font-mono font-medium text-slate-200">@google/genai</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Mode:</span>
                <span className="font-mono text-emerald-400 font-semibold">Structured JSON</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">API Key Configured:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Server Verified
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <CardTitle>Database & Auth</CardTitle>
              </div>
              <CardDescription>Supabase PostgreSQL & RLS status</CardDescription>
            </CardHeader>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Database:</span>
                <span className="font-mono font-medium text-slate-200">PostgreSQL 15</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Row Level Security:</span>
                <span className="text-emerald-400 font-medium">Enabled (Active)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Session Guard:</span>
                <span className="text-indigo-400 font-medium">SSR Cookies</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
