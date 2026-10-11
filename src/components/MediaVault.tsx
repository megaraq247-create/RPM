import React, { useState } from 'react';
import { 
  Film, 
  Camera, 
  Play, 
  ExternalLink, 
  Plus, 
  Clock, 
  Users, 
  Filter, 
  Video,
  Eye,
  X
} from 'lucide-react';
import { Player, PlayerMediaVideo, PlayerMediaPhoto } from '../types';
import { getEmbedVideoUrl } from '../utils/helpers';

interface MediaVaultProps {
  players: Player[];
  onOpenVideo: (video: PlayerMediaVideo, playerName: string) => void;
  onViewPlayer: (player: Player) => void;
  onOpenRegister: () => void;
}

export const MediaVault: React.FC<MediaVaultProps> = ({
  players,
  onOpenVideo,
  onViewPlayer,
  onOpenRegister,
}) => {
  const [mediaType, setMediaType] = useState<'all' | 'videos' | 'photos'>('all');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('all');
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  // Collect all videos
  const allVideos = players.flatMap(p => 
    p.videos.map(v => ({ ...v, player: p }))
  );

  // Collect all photos
  const allPhotos = players.flatMap(p => 
    p.photos.map(ph => ({ ...ph, player: p }))
  );

  const filteredVideos = allVideos.filter(v => {
    if (selectedVideoCategory !== 'all' && v.type !== selectedVideoCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Vault Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-emerald-400" />
            <span>Club Media & Video Vault</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Central repository of player highlight reels, scouting footage, match photos, and tactical breakdowns.
          </p>
        </div>

        {/* Media Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setMediaType('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              mediaType === 'all' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Media ({allVideos.length + allPhotos.length})
          </button>
          <button
            onClick={() => setMediaType('videos')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              mediaType === 'videos' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Highlight Reels ({allVideos.length})</span>
          </button>
          <button
            onClick={() => setMediaType('photos')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              mediaType === 'photos' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Player Pictures ({allPhotos.length})</span>
          </button>
        </div>
      </div>

      {/* VIDEO SECTION */}
      {(mediaType === 'all' || mediaType === 'videos') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Video Highlights & Tactical Reels</span>
            </h3>

            {/* Video Sub-category */}
            <div className="flex items-center gap-1 text-[11px]">
              {['all', 'Highlights', 'Scouting Reel', 'Skills', 'Match Analysis'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedVideoCategory(cat)}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    selectedVideoCategory === cat 
                      ? 'bg-slate-800 text-emerald-400 font-bold' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat === 'all' ? 'All Reels' : cat}
                </button>
              ))}
            </div>
          </div>

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((vid) => (
                <div 
                  key={vid.id}
                  className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={vid.player.avatarUrl} 
                          alt={vid.player.displayName} 
                          className="w-7 h-7 rounded-full object-cover border border-emerald-500/40" 
                        />
                        <div>
                          <div 
                            onClick={() => onViewPlayer(vid.player)}
                            className="font-bold text-xs text-white hover:text-emerald-400 cursor-pointer"
                          >
                            {vid.player.displayName}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{vid.player.primaryPosition} · {vid.player.squadCategory}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {vid.type}
                      </span>
                    </div>

                    {/* Video Visual Card / Launch button */}
                    <div 
                      onClick={() => onOpenVideo(vid, vid.player.displayName)}
                      className="relative aspect-video rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden cursor-pointer group/video"
                    >
                      <img 
                        src={vid.player.photos[0]?.url || vid.player.avatarUrl} 
                        alt="Thumbnail" 
                        className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover/video:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      <div className="relative w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>

                      {vid.duration && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/90 text-white text-[10px] font-mono flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{vid.duration}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{vid.title}</h4>
                      {vid.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{vid.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onOpenVideo(vid, vid.player.displayName)}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Play Highlight</span>
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">Added: {vid.addedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl">
              <Film className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No video reels added yet in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* PHOTO GALLERY SECTION */}
      {(mediaType === 'all' || mediaType === 'photos') && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>High-Definition Player Photography Gallery</span>
          </h3>

          {allPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {allPhotos.map((photo) => (
                <div 
                  key={photo.id}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                  onClick={() => setSelectedPhotoPreview(photo.url)}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.caption || 'Player photo'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">{photo.tag || 'Action'}</span>
                    <p className="text-xs text-white font-bold truncate">{photo.player.displayName}</p>
                    {photo.caption && (
                      <p className="text-[10px] text-slate-300 truncate">{photo.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl">
              <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No photos uploaded across players yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Preview */}
      {selectedPhotoPreview && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoPreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedPhotoPreview} 
              alt="Enlarged preview" 
              className="max-h-[85vh] max-w-full rounded-xl object-contain border border-slate-700" 
            />
            <button
              onClick={() => setSelectedPhotoPreview(null)}
              className="absolute top-3 right-3 p-2 bg-slate-900/80 rounded-full text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
