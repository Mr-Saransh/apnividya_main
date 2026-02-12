"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import screenfull from "screenfull";
import { cn } from "@/lib/utils";

interface CustomVideoPlayerProps {
    url: string;
    title?: string;
    onNext?: () => void;
    hasNext?: boolean;
    autoPlay?: boolean;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export function CustomVideoPlayer({ url, title, onNext, hasNext, autoPlay = false }: CustomVideoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const playerRef = useRef<any>(null);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    // Extract video ID from URL
    const getVideoId = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(url);

    useEffect(() => {
        setMounted(true);

        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            initializePlayer();
        };

        if (window.YT && window.YT.Player) {
            initializePlayer();
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [videoId]); // Re-init if video changes

    const initializePlayer = () => {
        if (!videoId || playerRef.current) return;

        playerRef.current = new window.YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                autoplay: autoPlay ? 1 : 0,
                controls: 0, // Strict: Hide controls
                disablekb: 1, // Strict: Disable keyboard
                fs: 0, // Strict: Disable fullscreen button
                modestbranding: 1,
                rel: 0, // No related videos
                showinfo: 0,
                playsinline: 1,
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    const startProgressTracking = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        progressInterval.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                const time = playerRef.current.getCurrentTime();
                const dur = playerRef.current.getDuration();
                setCurrentTime(time);
                setDuration(dur);
            }
        }, 1000);
    };

    const stopProgressTracking = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
    };

    const onPlayerReady = (event: any) => {
        setLoading(false);
        if (autoPlay) {
            event.target.playVideo();
        }
    };

    const onPlayerStateChange = (event: any) => {
        // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
        if (event.data === 1) {
            setIsPlaying(true);
            startProgressTracking();
        }
        if (event.data === 2) {
            setIsPlaying(false);
            stopProgressTracking();
        }
        if (event.data === 0) {
            setIsPlaying(false);
            stopProgressTracking();
            if (hasNext && onNext) onNext();
        }
    };

    const togglePlay = () => {
        if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
        }
    };

    const toggleMute = () => {
        if (playerRef.current && typeof playerRef.current.mute === 'function') {
            if (isMuted) {
                playerRef.current.unMute();
                setIsMuted(false);
            } else {
                playerRef.current.mute();
                setIsMuted(true);
            }
        }
    };

    // Fix: Re-initialize player when videoId changes
    useEffect(() => {
        setMounted(true);

        const initPlayer = () => {
            // Destroy existing player if it exists
            if (playerRef.current) {
                try {
                    if (typeof playerRef.current.destroy === 'function') {
                        playerRef.current.destroy();
                    }
                } catch (e) {
                    console.warn("Error destroying player", e);
                }
                playerRef.current = null;
            }

            // small delay to ensure DOM is ready
            setTimeout(() => {
                if (window.YT && window.YT.Player && videoId) {
                    playerRef.current = new window.YT.Player('youtube-player', {
                        height: '100%',
                        width: '100%',
                        videoId: videoId,
                        playerVars: {
                            autoplay: autoPlay ? 1 : 0,
                            controls: 0,
                            disablekb: 1,
                            fs: 0,
                            modestbranding: 1,
                            rel: 0,
                            showinfo: 0,
                            playsinline: 1,
                        },
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }
            }, 100);
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }

        return () => {
            // Cleanup on unmount or id change
            if (playerRef.current) {
                try {
                    if (typeof playerRef.current.destroy === 'function') {
                        playerRef.current.destroy();
                    }
                } catch (e) { /* ignore */ }
                playerRef.current = null;
            }
            stopProgressTracking();
        };
    }, [videoId]);

    const toggleFullscreen = () => {
        if (containerRef.current && screenfull.isEnabled) {
            screenfull.toggle(containerRef.current);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (playerRef.current) {
            playerRef.current.seekTo(time, true);
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || !isFinite(seconds)) return "0:00";
        const date = new Date(seconds * 1000);
        const mm = date.getUTCMinutes();
        const ss = date.getSeconds().toString().padStart(2, '0');
        return `${mm}:${ss}`;
    };

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(screenfull.isFullscreen);
        if (screenfull.isEnabled) {
            screenfull.on('change', handleFullscreenChange);
            return () => screenfull.off('change', handleFullscreenChange);
        }
    }, []);


    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
        >
            {/* The Player Div (Replaced by IFrame) */}
            <div id="youtube-player" className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Strict Overlay: Capture all clicks */}
            <div
                className="absolute inset-0 z-10 cursor-pointer bg-transparent select-none outline-none"
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
                style={{ WebkitTapHighlightColor: 'transparent' }}
            />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                </div>
            )}

            {/* Simpler Custom Controls */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col justify-end transition-opacity duration-300",
                !isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                {/* Progress Bar */}
                <div className="w-full mb-3 flex items-center gap-2">
                    <span className="text-xs text-white/80 w-10 text-right">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                    />
                    <span className="text-xs text-white/80 w-10">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:text-blue-400 transition">
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>

                        <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="text-white hover:text-blue-400 transition">
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>

                        {/* Speed Control */}
                        <select
                            className="bg-black/50 text-white text-xs rounded border border-white/20 p-1"
                            onChange={(e) => {
                                const speed = parseFloat(e.target.value);
                                if (playerRef.current) playerRef.current.setPlaybackRate(speed);
                            }}
                            defaultValue="1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <option value="0.25">0.25x</option>
                            <option value="0.5">0.5x</option>
                            <option value="1">1x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                        </select>

                        <span className="text-white/80 text-sm font-medium truncate max-w-[200px]">{title}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="text-white hover:text-blue-400 transition">
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
