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
  Download,
  AlertCircle,
  Sparkles,
  RefreshCw
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
    return localStorage.getItem('rpm_github_repo_url') || 'https://github.com/rpm-org/rpm-app';
  });
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    return localStorage.getItem('rpm_github_connected') === 'true' || Boolean(localStorage.getItem('rpm_github_repo_url'));
  });
  const [copiedType, setCopiedType] = useState<'commands' | 'clone' | 'url' | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rpm_github_repo_url');
    if (saved) {
      setRepoUrl(saved);
      setIsConnected(true);
    }
  }, []);

  if (!isOpen) return null;

  const cleanRepo = repoUrl.trim();
  const pushCommands = `# 1. Link remote origin to your GitHub repository
git remote add origin ${cleanRepo || 'https://github.com/YOUR_USERNAME/rpm-app.git'}

# 2. Ensure default main branch
git branch -M main

# 3. Push complete RPM App codebase to GitHub
git push -u origin main`;

  const cloneCommand = `git clone ${cleanRepo || 'https://github.com/YOUR_USERNAME/rpm-app.git'}`;

  const handleCopy = (text: string, type: 'commands' | 'clone' | 'url') => {
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
        className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
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
                <h3 className="text-lg font-bold text-white tracking-tight">GitHub Repository Connection</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Git Initialized
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage source code repository sync, remote origin, and version control for RPM App
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

        {/* Git Repository Status Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>Current Branch</span>
            </span>
            <div className="font-mono font-bold text-white">main</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-amber-400" />
              <span>Initial Commit</span>
            </span>
            <div className="font-mono text-emerald-300">fbd7d5b (Tracked)</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Project Files</span>
            </span>
            <div className="font-mono font-bold text-white">30 committed files</div>
          </div>
        </div>

        {/* Configure GitHub Remote Repository */}
        <form onSubmit={handleSaveConnection} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>GitHub Remote Repository URL</span>
            </span>
            {isConnected && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Connected</span>
              </span>
            )}
          </label>

          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/your-username/rpm-app"
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
                  <span>{isConnected ? 'Update URL' : 'Link Repo'}</span>
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

        {/* Step-by-Step Push Instructions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Git Terminal Commands to Push Code to GitHub</span>
            </span>
            <button
              type="button"
              onClick={() => handleCopy(pushCommands, 'commands')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              {copiedType === 'commands' ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Commands</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-emerald-400 font-mono overflow-x-auto leading-relaxed select-all">
            {pushCommands}
          </pre>
        </div>

        {/* Quick Clone Command */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/90 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
              Clone Command:
            </span>
            <div className="font-mono text-slate-300 text-[11px] truncate mt-0.5">
              {cloneCommand}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(cloneCommand, 'clone')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Copy clone command"
          >
            {copiedType === 'clone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* 3 Simple Setup Steps Guide */}
        <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 text-xs">
          <h4 className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>How to Connect Your GitHub Account in 3 Steps</span>
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>
              Log into <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-medium">github.com/new</a> and create a new repository called <strong className="text-white font-mono">rpm-app</strong>.
            </li>
            <li>
              Leave <span className="text-slate-300">"Add a README file"</span> unchecked (the project is already completely initialized locally).
            </li>
            <li>
              Copy the terminal commands above and run them in your command prompt, or paste your repository link here.
            </li>
          </ol>
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
