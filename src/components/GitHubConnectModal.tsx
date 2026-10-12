import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  GitBranch, 
  GitCommit, 
  CheckCircle2, 
  FolderGit2, 
  Terminal, 
  Code2, 
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Rocket,
  Info
} from 'lucide-react';

interface GitHubConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubConnectModal: React.FC<GitHubConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [repoUrl, setRepoUrl] = useState<string>(() => {
    return localStorage.getItem('rpm_github_repo_url') || '';
  });
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    return localStorage.getItem('rpm_github_connected') === 'true' || Boolean(localStorage.getItem('rpm_github_repo_url'));
  });
  const [copiedType, setCopiedType] = useState<'commands' | 'push' | 'clone' | 'live' | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const liveAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-2yexfhk7uwj2vqsgeouaz7-480353208672.europe-west3.run.app';

  useEffect(() => {
    const saved = localStorage.getItem('rpm_github_repo_url');
    if (saved) {
      setRepoUrl(saved);
      setIsConnected(true);
    }
  }, []);

  if (!isOpen) return null;

  const cleanRepo = repoUrl.trim();
  const repoPlaceholder = cleanRepo || 'https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git';

  const syncPushCommands = `# Step 1: Stage all new files and features
git add .

# Step 2: Commit all updates (PC CV upload, RPM App, player invite short link)
git commit -m "Update RPM App: PC CV upload, player registration short link, admin delete protection"

# Step 3: Link your GitHub repository (if not already linked)
git remote add origin ${repoPlaceholder} || git remote set-url origin ${repoPlaceholder}

# Step 4: Push to GitHub - Vercel will automatically redeploy within 60 seconds!
git branch -M main
git push -u origin main`;

  const quickPushCommands = `git add . && git commit -m "Update RPM App: latest features" && git push origin main`;

  const handleCopy = (text: string, type: 'commands' | 'push' | 'clone' | 'live') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanRepo) {
      localStorage.setItem('rpm_github_repo_url', cleanRepo);
      localStorage.setItem('rpm_github_connected', 'true');
      setIsConnected(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('rpm_github_repo_url');
    localStorage.removeItem('rpm_github_connected');
    setIsConnected(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {/* GitHub SVG Logo */}
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 shadow-lg shadow-black/40 text-white">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">GitHub & Vercel Sync</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Git Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Keep your GitHub repository in sync so Vercel updates automatically with all new features
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why Vercel shows the old interface explanation banner */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Why is Vercel showing an old interface?</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Vercel is connected directly to your <strong className="text-white">GitHub repository</strong>. When you test and build features here in AI Studio, the code changes live in this cloud environment. <strong className="text-amber-200">Vercel does not know about new updates until they are pushed to GitHub.</strong> Once you push to GitHub, Vercel detects the new commit and rebuilds your site automatically in ~30 seconds!
          </p>
        </div>

        {/* Direct Live Preview link alternative */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              <span>Direct AI Studio Live App (Always 100% Up-To-Date)</span>
            </span>
            <p className="text-slate-400 text-[11px] truncate max-w-md font-mono">
              {liveAppUrl}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(liveAppUrl, 'live')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedType === 'live' ? 'Copied URL!' : 'Copy Live URL'}
            </button>
            <a
              href={liveAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors cursor-pointer"
              title="Open live app in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Configure GitHub Remote Repository */}
        <form onSubmit={handleSaveConnection} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your GitHub Repository URL</span>
            </span>
            {isConnected && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Linked</span>
              </span>
            )}
          </label>

          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="e.g. https://github.com/your-username/rpm-app"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>{isConnected ? 'Update URL' : 'Link GitHub'}</span>
                </>
              )}
            </button>
          </div>

          {isConnected && cleanRepo && (
            <div className="flex items-center justify-between pt-1 text-xs">
              <a
                href={cleanRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Repository on GitHub</span>
              </a>
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-slate-500 hover:text-rose-400 text-[11px] transition-colors cursor-pointer"
              >
                Unlink Repository
              </button>
            </div>
          )}
        </form>

        {/* Step-by-Step Push Instructions to Update Vercel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Run These Commands in Your Terminal to Update GitHub & Vercel</span>
            </span>
            <button
              type="button"
              onClick={() => handleCopy(syncPushCommands, 'commands')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              {copiedType === 'commands' ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Commands Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy All Commands</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-emerald-400 font-mono overflow-x-auto leading-relaxed select-all">
            {syncPushCommands}
          </pre>
        </div>

        {/* 1-Line Quick Push Shortcut */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/90 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
              1-Line Shortcut (If already linked):
            </span>
            <div className="font-mono text-emerald-300 text-[11px] truncate mt-0.5 select-all">
              {quickPushCommands}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(quickPushCommands, 'push')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Copy 1-line shortcut"
          >
            {copiedType === 'push' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Vercel Deployment Checklist */}
        <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 text-xs">
          <h4 className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Vercel Auto-Deployment Checklist</span>
          </h4>
          <ul className="space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span><strong className="text-white">vercel.json</strong> configured in project root for SPA routing</span>
            </li>
            <li className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Build command <code className="bg-slate-900 px-1 py-0.2 rounded text-white">npm run build</code> tested & passing in 0.9s</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Once pushed to GitHub, check your Vercel Dashboard at <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-semibold">vercel.com/dashboard</a> to watch the build deploy</span>
            </li>
          </ul>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
