import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  alpha,
  Fade,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, VolumeOff, VolumeUp } from '@mui/icons-material';

const VideoOverlay = ({
  open,
  onClose,
  videoSrc,
  messages = [],
  messageInterval = 3000,
  showCloseButton = false,
  isLightTheme = false,
  colors = {},
  glassmorphism = {},
  autoPlay = true,
  loop = true,
  muted = true,
  overlay = true,
  maxWidth = '600px',
  aspectRatio = '16/9',
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Rotate messages
  useEffect(() => {
    if (!messages.length || !open) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, messageInterval);

    return () => clearInterval(interval);
  }, [messages.length, messageInterval, open]);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setCurrentMessageIndex(0);
      setIsLoading(true);
      setError(null);
    }
  }, [open]);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = useCallback((url) => {
    if (!url) return null;
    
    // Handle embed URLs
    const embedMatch = url.match(/embed\/([^?]+)/);
    if (embedMatch) return embedMatch[1];
    
    // Handle watch URLs
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return watchMatch[1];
    
    // Handle short URLs
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) return shortMatch[1];
    
    return null;
  }, []);

  const isYouTubeUrl = videoSrc && (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be'));
  const youtubeVideoId = isYouTubeUrl ? getYouTubeVideoId(videoSrc) : null;

  // Initialize YouTube player
  const initializeYouTubePlayer = useCallback(() => {
    if (!containerRef.current || !youtubeVideoId) return;

    // Create a div for the player
    const playerDiv = document.createElement('div');
    playerDiv.id = `youtube-player-${Date.now()}`;
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(playerDiv);

    try {
      playerRef.current = new window.YT.Player(playerDiv.id, {
        height: '100%',
        width: '100%',
        videoId: youtubeVideoId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          loop: loop ? 1 : 0,
          playlist: loop ? youtubeVideoId : undefined,
          mute: isMuted ? 1 : 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            setIsLoading(false);
            if (autoPlay) {
              event.target.playVideo();
            }
          },
          onError: (event) => {
            console.error('YouTube player error:', event.data);
            setError('Failed to load video');
            setIsLoading(false);
          },
          onStateChange: (event) => {
            // Handle state changes if needed
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsLoading(false);
            }
          }
        }
      });
    } catch (err) {
      console.error('Error creating YouTube player:', err);
      setError('Failed to initialize player');
      setIsLoading(false);
    }
  }, [youtubeVideoId, autoPlay, loop, isMuted]);

  // Load YouTube API
  useEffect(() => {
    if (!isYouTubeUrl || !open || !youtubeVideoId) return;

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initializeYouTubePlayer();
      return;
    }

    // Load the API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Set up the callback
    window.onYouTubeIframeAPIReady = () => {
      initializeYouTubePlayer();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isYouTubeUrl, open, youtubeVideoId, initializeYouTubePlayer]);

  const handleVideoLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setError('Failed to load video');
  };

  const toggleMute = () => {
    if (playerRef.current && playerReady) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
    }
    setIsMuted(!isMuted);
  };

  if (!open) return null;

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: overlay ? alpha('#000', 0.8) : 'transparent',
          backdropFilter: overlay ? 'blur(10px)' : 'none',
          p: 4,
        }}
        onClick={overlay && onClose ? onClose : undefined}
      >
        {/* Close button in top right corner of screen */}
        {onClose && (
          <IconButton
            onClick={onClose}
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 10,
              color: '#fff',
              bgcolor: alpha('#000', 0.5),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#fff', 0.2)}`,
              '&:hover': {
                bgcolor: alpha('#000', 0.7),
                border: `1px solid ${alpha('#fff', 0.3)}`,
              },
            }}
            size="medium"
          >
            <Close />
          </IconButton>
        )}
        
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth,
            background: isLightTheme 
              ? alpha('#ffffff', 0.98)
              : alpha(colors.glassWhite || '#ffffff', 0.1),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isLightTheme 
              ? alpha('#000', 0.1)
              : alpha('#ffffff', 0.1)}`,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: isLightTheme
              ? `0 20px 60px ${alpha('#000', 0.1)}`
              : `0 20px 60px ${alpha(colors.accent || '#6366f1', 0.3)}`,
          }}
        >


          {/* Mute button - only show for non-YouTube videos */}
          {!isYouTubeUrl && (
            <IconButton
              onClick={toggleMute}
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                zIndex: 10,
                color: '#fff',
                bgcolor: alpha('#000', 0.5),
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: alpha('#000', 0.7),
                },
              }}
              size="small"
            >
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          )}

          {/* Video container */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio,
              bgcolor: '#000',
              overflow: 'hidden',
            }}
          >
            {/* Loading state */}
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#000', 0.7),
                  zIndex: 5,
                }}
              >
                <CircularProgress 
                  sx={{ 
                    color: colors.accent || '#6366f1',
                    opacity: 0.8,
                  }} 
                />
              </Box>
            )}

            {/* Error state */}
            {error && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha('#000', 0.9),
                  zIndex: 5,
                }}
              >
                <Typography
                  sx={{
                    color: '#ef4444',
                    fontSize: '14px',
                  }}
                >
                  {error}
                </Typography>
              </Box>
            )}

            {/* Video */}
            {isYouTubeUrl ? (
              <div 
                ref={containerRef}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'inherit',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                }}
              />
            ) : (
              <video
                src={videoSrc}
                autoPlay={autoPlay}
                loop={loop}
                muted={isMuted}
                playsInline
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </Box>

          {/* Messages */}
          {messages.length > 0 && (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                background: isLightTheme
                  ? alpha('#f8f9fa', 0.9)
                  : alpha(colors.background || '#000', 0.5),
                borderTop: `1px solid ${isLightTheme 
                  ? alpha('#000', 0.1)
                  : alpha('#ffffff', 0.1)}`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: isLightTheme 
                        ? colors.textPrimary || '#000'
                        : colors.textPrimary || '#fff',
                      fontWeight: 500,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {messages[currentMessageIndex]}
                  </Typography>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 2,
                }}
              >
                {messages.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: index === currentMessageIndex
                        ? colors.accent || '#6366f1'
                        : alpha(colors.textSecondary || '#666', 0.3),
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default VideoOverlay;