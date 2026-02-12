"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
    videoId: string;
    onProgress?: (progress: number) => void;
    onEnded?: () => void;
}

export function VideoPlayer({ videoId, onProgress, onEnded }: VideoPlayerProps) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getYouTubeId = (urlOrId: string) => {
        if (!urlOrId) return "";
        const id = urlOrId.trim();

        // If it contains "youtube.com" or "youtu.be", extract ID
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = id.match(regex);
        if (match) return match[1];

        // If it looks like a raw ID (11 chars, no slash), return it
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;

        // Fallback: return as is (might be ID with params)
        return id;
    };

    const embedId = getYouTubeId(videoId);

    if (!mounted) {
        return (
            <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!embedId) {
        return (
            <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center text-white">
                <p>Invalid Video URL</p>
            </div>
        );
    }

    return (
        <div
            className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 group"
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Transparent Overlay to block Title/Share clicks */}
            <div className="absolute top-0 left-0 w-full h-[15%] z-20 bg-transparent" />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-10 pointer-events-none">
                    <Loader2 className="h-10 w-10 animate-spin" />
                </div>
            )}
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${embedId}?autoplay=0&controls=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=1`}
                title="YouTube video player"
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                onLoad={() => setLoading(false)}
                className="absolute inset-0 w-full h-full z-0"
            />
        </div>
    );
}
