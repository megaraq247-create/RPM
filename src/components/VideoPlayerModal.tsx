import React from 'react';
import { X, ExternalLink, Play, Clock, Film } from 'lucide-react';
import { PlayerMediaVideo } from '../types';
import { getEmbedVideoUrl } from '../utils/helpers';

interface VideoPlayerModalProps {
  video: PlayerMediaVideo | null;
  playerName?: string;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  playerName,
  onClose,
}) => {
  if (!video) return null;

  const { embedUrl, isEmbeddable, originalUrl } = getEmbedVideoUrl(video.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{video.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                {playerName && <span className="text-emerald-400 font-medium">{playerName}</span>}
                {playerName && <span aria-hidden="true">·</span>}
                <span className="capitalize">{video.type}</span>
                {video.duration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {video.duration}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Canvas */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {isEmbeddable && embedUrl ? (
            embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') ? (
              <video
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={embedUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-emerald-400">
                <Play className="w-8 h-8 ml-1" />
              </div>
              <h4 className="text-white font-semibold mb-2">External Video Link</h4>
              <p className="text-xs text-slate-400 mb-6">
                This media link cannot be embedded directly in the player frame. You can view it directly via the source link below:
              </p>
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Launch External Video
              </a>
            </div>
          )}
        </div>

        {/* Video Details & Scouting Notes */}
        {video.notes && (
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-xs">
            <span className="font-semibold text-slate-300 mr-2">Coach & Analyst Notes:</span>
            <span className="text-slate-400">{video.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};
