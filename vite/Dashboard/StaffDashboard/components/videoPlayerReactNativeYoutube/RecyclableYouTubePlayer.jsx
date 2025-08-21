import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// Constants
const PLAYER_STATES = {
  '-1': 'unstarted',
  '0': 'ended',
  '1': 'playing',
  '2': 'paused',
  '3': 'buffering',
  '5': 'cued',
};

const PLAYER_ERROR = {
  '2': 'invalid_parameter',
  '5': 'HTML5_error',
  '100': 'video_not_found',
  '101': 'embed_not_allowed',
  '150': 'embed_not_allowed',
};

/**
 * RecyclableYouTubePlayer - A specialized YouTube player designed for recycling in WebViewPool
 * 
 * This player carefully manages the YouTube iframe API initialization to prevent conflicts
 * and ensure proper security token handling when WebViews are recycled.
 */
const RecyclableYouTubePlayer = forwardRef(({
  videoId,
  height,
  width,
  play = false,
  isActive = false,
  recycleKey,
  onReady = () => {},
  onStateChange = (state, stateCode) => {
    if (isActive) {
      const ts = getTimestamp();
      console.log(`[SYNC ${ts}] 🎮 Player ${index} state changed: ${state} (${stateCode})`);
      
      if (state === 'playing') {
        setIsPlaying(true);
        setYoutubeReady(true);
      } else if (state === 'paused') {
        setIsPlaying(false);
      }
    }
  },
  onError = () => {},
  style,
  webViewStyle,
  onNavigationToYouTube = () => {},
}, ref) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState(null);
  const webViewRef = useRef(null);
  const commandQueue = useRef([]);
  const startupDelayRef = useRef(null);
  
  // Track component mounting to prevent setState on unmounted component
  const isMountedRef = useRef(true);
  
  // Reset state when recycleKey changes (component is recycled)
  useEffect(() => {
    if (webViewRef.current) {
      // Reset player state
      setIsLoading(true);
      setIsPlayerReady(false);
      setPlayerError(null);
      
      // Clear any queued commands
      commandQueue.current = [];
      
      // Clear any pending timeouts
      if (startupDelayRef.current) {
        clearTimeout(startupDelayRef.current);
      }
    }
    
    return () => {
      // Clean up on unmount or recycle
      if (startupDelayRef.current) {
        clearTimeout(startupDelayRef.current);
      }
    };
  }, [recycleKey, videoId]);
  
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    return () => {
      // Clear mounted flag on unmount
      isMountedRef.current = false;
    };
  }, []);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    playVideo: () => {
      executePlayerCommand('playVideo');
    },
    pauseVideo: () => {
      executePlayerCommand('pauseVideo');
    },
    seekTo: (seconds, allowSeekAhead = true) => {
      executePlayerCommand('seekTo', [seconds, allowSeekAhead]);
    },
    mute: () => {
      executePlayerCommand('mute');
    },
    unMute: () => {
      executePlayerCommand('unMute');
    },
    isReady: isPlayerReady
  }));
  
  // Queue or execute player commands based on readiness
  const executePlayerCommand = useCallback((command, args = []) => {
    if (!isPlayerReady || !webViewRef.current) {
      console.log(`[RecyclableYT] Queueing command ${command} (player not ready)`);
      commandQueue.current.push({ command, args });
      return;
    }
    
    try {
      sendPlayerCommand(command, args);
    } catch (error) {
      console.error(`[RecyclableYT] Error executing command ${command}:`, error);
    }
  }, [isPlayerReady]);
  
  // Send commands to the YouTube player
  const sendPlayerCommand = useCallback((command, args = []) => {
    if (webViewRef.current) {
      try {
        const message = JSON.stringify({
          eventName: command,
          args,
          id: recycleKey
        });
        webViewRef.current.postMessage(message);
        console.log(`[RecyclableYT] Command sent: ${command}`);
      } catch (error) {
        console.error(`[RecyclableYT] Error sending command ${command}:`, error);
      }
    }
  }, [recycleKey]);
  
  // Process queued commands when player becomes ready
  const processCommandQueue = useCallback(() => {
    if (!isPlayerReady || !webViewRef.current) return;
    
    // Process any queued commands
    if (commandQueue.current.length > 0) {
      console.log(`[RecyclableYT] Processing ${commandQueue.current.length} queued commands`);
      
      // Use a copy of the queue to avoid potential issues with modifications during iteration
      const queueCopy = [...commandQueue.current];
      commandQueue.current = [];
      
      queueCopy.forEach(({ command, args }) => {
        sendPlayerCommand(command, args);
      });
    }
  }, [isPlayerReady, sendPlayerCommand]);
  
  // Effect to process command queue when player becomes ready
  useEffect(() => {
    if (isPlayerReady) {
      processCommandQueue();
    }
  }, [isPlayerReady, processCommandQueue]);
  
  // Effect to handle play/pause based on props
  useEffect(() => {
    if (!isActive || !webViewRef.current) return;
    
    if (play && isPlayerReady) {
      executePlayerCommand('playVideo');
    } else if (!play && isPlayerReady) {
      executePlayerCommand('pauseVideo');
    }
  }, [play, isActive, isPlayerReady, executePlayerCommand]);
  //
  // YouTube player HTML template
  const getYoutubeIframeHTML = useCallback((videoId) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
              background-color: #000;
            }
            #player {
              width: 100%;
              height: 100%;
              background-color: #000;
            }
            .container {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #000;
              position: relative;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div id="player"></div>
          </div>
          <script>
            // Flag to track if the API is being initialized
            window.isAPIInitializing = false;
            // Flag to track if the player is ready
            window.isPlayerReady = false;
            // Store the unique instance ID
            window.instanceId = "${recycleKey}";
            // Store commands that come in before player is ready
            window.pendingCommands = [];
            
            // Verify bridge is working
            try {
              console.log("WebView initializing, testing bridge for video: ${videoId}");
              setTimeout(function() {
                postMessageToReact('debug', { message: 'Bridge verification', videoId: '${videoId}' });
              }, 500);
            } catch (e) {
              console.error("Bridge verification failed:", e);
            }
            
            // Notify React Native
            function postMessageToReact(eventType, data = {}) {
              try {
                if (window.ReactNativeWebView) {
                  const message = JSON.stringify({
                    eventType,
                    ...data,
                    id: window.instanceId
                  });
                  console.log("Sending to React Native:", eventType, data);
                  window.ReactNativeWebView.postMessage(message);
                  return true;
                } else {
                  console.error("ReactNativeWebView not available!");
                  return false;
                }
              } catch (e) {
                console.error("Error in postMessageToReact:", e);
                return false;
              }
            }
            
            // Process any pending commands
            function processPendingCommands() {
              if (window.player && window.isPlayerReady && window.pendingCommands.length > 0) {
                console.log('Processing ' + window.pendingCommands.length + ' pending commands');
                var commands = [...window.pendingCommands];
                window.pendingCommands = [];
                
                for (var i = 0; i < commands.length; i++) {
                  try {
                    var cmd = commands[i];
                    if (window.player[cmd.name]) {
                      window.player[cmd.name].apply(window.player, cmd.args || []);
                    }
                  } catch (e) {
                    console.error('Error processing command:', e);
                  }
                }
              }
            }
            
            // Add YouTube logo and link click detection
            function addYouTubeNavigationListener() {
              try {
                // Override anchor click events to detect YouTube navigation
                document.addEventListener('click', function(e) {
                  const target = e.target;
                  
                  // Walk up the DOM tree to find anchor or button elements
                  let element = target;
                  let checkDepth = 5; // Check up to 5 parent levels
                  while (element && checkDepth > 0) {
                    // Check if this is a link to YouTube
                    if (element.tagName === 'A' && element.href && 
                        (element.href.includes('youtube.com') || element.href.includes('youtu.be'))) {
                      postMessageToReact('navigationToYouTube');
                      console.log('YouTube link clicked');
                      break;
                    }
                    
                    // Check if this is a button with text about watching on YouTube
                    if (element.textContent && 
                        (element.textContent.includes('YouTube') || 
                         element.textContent.includes('Watch on'))) {
                      postMessageToReact('navigationToYouTube');
                      console.log('YouTube button clicked');
                      break;
                    }
                    
                    element = element.parentElement;
                    checkDepth--;
                  }
                }, true);
                
                // Create a simple overlay button for easier YouTube navigation detection
                // This won't be visible but will help catch events the user is attempting
                const youtubeButton = document.createElement('button');
                youtubeButton.onclick = function() {
                  postMessageToReact('navigationToYouTube');
                  console.log('Watch on YouTube clicked');
                  // Optionally, open YouTube
                  // window.open('https://youtube.com/watch?v=${videoId}', '_blank');
                };
                document.body.appendChild(youtubeButton);
                
                // Override window.open to detect YouTube navigation
                const originalOpen = window.open;
                window.open = function(url, target) {
                  if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                    postMessageToReact('navigationToYouTube');
                    console.log('YouTube navigation via window.open');
                  }
                  return originalOpen.apply(this, arguments);
                };
              } catch (e) {
                console.error('Error setting up YouTube navigation listener:', e);
              }
            }
            
            // Safely initialize the YouTube API
            function initYouTubeAPI() {
              if (window.isAPIInitializing) return;
              
              window.isAPIInitializing = true;
              
              if (typeof YT === 'undefined' || !YT.Player) {
                // Load the API
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
              } else {
                // API already loaded, create player directly
                createYouTubePlayer();
              }
            }
            
            // Create the YouTube player instance
            function createYouTubePlayer() {
              if (window.player) {
                try {
                  window.player.destroy();
                } catch (e) {
                  console.error('Error destroying previous player:', e);
                }
                window.player = null;
              }
              
              try {
                // Try to ensure the player element exists
                if (!document.getElementById('player')) {
                  console.error('Player element not found');
                  const playerDiv = document.createElement('div');
                  playerDiv.id = 'player';
                  document.querySelector('.container').appendChild(playerDiv);
                }
                
                window.player = new YT.Player('player', {
                  videoId: '${videoId}',
                  playerVars: {
                    autoplay: ${isActive && play ? 1 : 0},
                    controls: 1,
                    showinfo: 1,        // Changed to 1 to show video info and social controls
                    rel: 0,             
                    modestbranding: 0,  // Optional: Changed to 0 for full branding
                    playsinline: 1,
                    iv_load_policy: 3,
                    fs: 1,              // You might want to enable fullscreen (1) for better experience
                    enablejsapi: 1,
                    autohide: 0,        // Added to keep controls visible
                    origin: '*'
                  },
                  events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError,
                    'onPlaybackQualityChange': onPlaybackQualityChange
                  }
                });
              } catch (e) {
                console.error('Error creating YouTube player:', e);
                postMessageToReact('playerError', { 
                  data: 'initialization_error',
                  message: e.message
                });
              }
            }
            
            // YouTube API callbacks
            function onYouTubeIframeAPIReady() {
              console.log('YouTube API ready');
              createYouTubePlayer();
            }
            
            function onPlayerReady(event) {
              console.log('Player ready event received');
              window.isPlayerReady = true;
              
              // Add a small delay for better stability
              setTimeout(function() {
                postMessageToReact('playerReady');
                processPendingCommands();
                addYouTubeNavigationListener();
                if (${__DEV__}) {
                  addDebugErrorButton();
                }
              }, 100);
            }
            
            function onPlayerStateChange(event) {
              postMessageToReact('playerStateChange', { data: event.data });
            }

            function onPlaybackQualityChange(event) {
              postMessageToReact('playerQualityChange', { data: event.data });
            }
            
            function onPlayerError(event) {
              const errorMsg = 'YouTube Player Error: ' + event.data;
              console.error(errorMsg);
              
              // More verbose error reporting
              const sent = postMessageToReact('playerError', { 
                data: event.data,
                timestamp: new Date().getTime(),
                videoId: '${videoId}'
              });
              
              console.log("Error message sent successfully:", sent);
              
              // Attempt to show an error message directly in the WebView as fallback
              try {
                const errorDiv = document.createElement('div');
                // errorDiv.style.position = 'absolute';
                // errorDiv.style.top = '50%';
                // errorDiv.style.left = '10%';
                // errorDiv.style.right = '10%';
                // errorDiv.style.transform = 'translateY(-50%)';
                // errorDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
                // errorDiv.style.color = 'white';
                // errorDiv.style.padding = '20px';
                // errorDiv.style.borderRadius = '5px';
                // errorDiv.style.textAlign = 'center';
                // errorDiv.style.zIndex = '1000';
                // errorDiv.innerHTML = '<p style="font-size:16px;">Error ' + event.data + ': ' + 
                //   (event.data === 150 ? "This video doesn't allow embedding" : "Error loading video") + 
                //   '</p><p style="font-size:14px;margin-top:10px;opacity:0.8;">Try another video</p>';
                // document.body.appendChild(errorDiv);
              } catch (e) {
                console.error("Failed to display error in WebView:", e);
              }
            }
            
            // Handle messages from React Native
            window.addEventListener('message', function(e) {
              try {
                var message = JSON.parse(e.data);
                
                // Verify this message is for this instance
                if (message.id && message.id !== window.instanceId) {
                  console.log('Ignoring message for different instance');
                  return;
                }
                
                // If player is ready, execute command immediately
                if (window.player && window.isPlayerReady && message.eventName) {
                  if (window.player[message.eventName]) {
                    window.player[message.eventName].apply(window.player, message.args || []);
                  }
                } 
                // Otherwise queue command for later
                else if (message.eventName) {
                  window.pendingCommands.push({
                    name: message.eventName,
                    args: message.args || []
                  });
                }
              } catch (error) {
                console.error('Error handling message:', error);
              }
            });
            
            // Report page load complete
            window.addEventListener('load', function() {
              postMessageToReact('dom_loaded');
              
              // Delay YouTube API initialization to ensure DOM is ready
              setTimeout(function() {
                initYouTubeAPI();
              }, 200);
            });
            
            // Initialize now if document is already loaded
            if (document.readyState === 'complete') {
              postMessageToReact('dom_loaded');
              
              // Delay YouTube API initialization to ensure DOM is ready
              setTimeout(function() {
                initYouTubeAPI();
              }, 200);
            }
            
            // Add a manual error simulation for testing
            function simulateYouTubeError(errorCode) {
              console.log("Manually simulating YouTube error:", errorCode);
              postMessageToReact('playerError', { 
                data: errorCode,
                simulated: true,
                timestamp: new Date().getTime(),
                videoId: '${videoId}'
              });
            }
            
            // When the player is created, set up a button for error testing
            function addDebugErrorButton() {
              try {
                const debugBtn = document.createElement('button');
                // debugBtn.textContent = 'Test Error 150';
                // debugBtn.style.position = 'absolute';
                // debugBtn.style.bottom = '10px';
                // debugBtn.style.left = '10px';
                // debugBtn.style.zIndex = '9999';
                // debugBtn.style.display = '${__DEV__ ? 'block' : 'none'}';
                // debugBtn.addEventListener('click', function() {
                //   simulateYouTubeError('150');
                // });
                // document.body.appendChild(debugBtn);
                // console.log("Debug error button added");
              } catch (e) {
                console.error("Failed to add debug button:", e);
              }
            }
          </script>
        </body>
      </html>
    `;
  }, [videoId, recycleKey, isActive, play, __DEV__]);
  
  // Handle messages from the WebView
  const handleWebViewMessage = useCallback((event) => {
    if (!isMountedRef.current) return;
    
    try {
      if (!event.nativeEvent || !event.nativeEvent.data) {
        console.warn('[RecyclableYT] Received empty message from WebView');
        return;
      }
      
      const data = JSON.parse(event.nativeEvent.data);
      
      // Validate this message is for this instance
      if (data.id && data.id !== recycleKey) {
        console.log('[RecyclableYT] Ignoring message from different instance:', data.id);
        return;
      }
      
      console.log(`[RecyclableYT] Received message: ${data.eventType}`, data);
      
      switch (data.eventType) {
        case 'playerReady':
          setIsPlayerReady(true);
          setIsLoading(false);
          onReady();
          break;
          
        case 'playerStateChange':
          if (data.data !== undefined) {
            const playerState = PLAYER_STATES[data.data] || 'unknown';
            onStateChange(playerState, data.data);
            
            // If video is playing, ensure player is marked as ready
            if (data.data === '1' || data.data === 1) {
              setIsPlayerReady(true);
              setIsLoading(false);
            }
          }
          break;
        
        case 'navigationToYouTube':
          console.log('[RecyclableYT] Navigation to YouTube detected - hiding overlay');
          onNavigationToYouTube();
          break;
          
        case 'playerQualityChange':
          // Quality changes sometimes happen when navigating to YouTube
          console.log('[RecyclableYT] Player quality change');
          break;
          
        case 'playerError':
          // More detailed error logging
          const errorCode = data.data;
          const errorType = PLAYER_ERROR[errorCode] || 'unknown_error';
          
          console.warn(
            `[RecyclableYT] Error: ${errorType} (${errorCode})`,
            `videoId: ${videoId}`,
            data
          );
          setPlayerError(errorType);
          onError(errorType, errorCode);
          setIsLoading(false);
          break;
          
        case 'dom_loaded':
          console.log('[RecyclableYT] DOM loaded');
          break;
        
        case 'debug':
          console.log('[RecyclableYT] Debug message:', data.message, data);
          break;
          
        default:
          console.log('[RecyclableYT] Unhandled message type:', data.eventType);
      }
    } catch (error) {
      console.error('[RecyclableYT] Error processing WebView message:', error, event.nativeEvent?.data);
      
      // Attempt to recover and set error state even if message parsing fails
      if (!playerError) {
        setPlayerError('message_processing_error');
        onError('message_processing_error', 'Failed to process message from WebView');
        setIsLoading(false);
      }
    }
  }, [recycleKey, onReady, onStateChange, onError, onNavigationToYouTube, videoId, playerError]);
  
  return (
    <View style={[styles.container, { height, width }, style]}>
      <WebView
        key={`youtube-player-${recycleKey || videoId}`}
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: getYoutubeIframeHTML(videoId) }}
        style={[styles.webView, webViewStyle]}
        onMessage={handleWebViewMessage}
        onNavigationStateChange={(navState) => {
          // Detect navigation to YouTube
          if (navState.url && (
              navState.url.includes('youtube.com') || 
              navState.url.includes('youtu.be')) && 
              !navState.url.includes('iframe_api') &&
              !navState.url.includes('about:blank')) {
            console.log(`[RecyclableYT] Navigation detected to: ${navState.url}`);
            onNavigationToYouTube();
          }
        }}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={true}
        bounces={false}
        allowsFullscreenVideo={false}
        useWebKit={true}
        androidLayerType="hardware"
        startInLoadingState={true}
        onLoadStart={() => {
          if (!isMountedRef.current) return;
          console.log(`[RecyclableYT] WebView load start for video ${videoId}`);
          setIsLoading(true);
        }}
        onLoadEnd={() => {
          if (!isMountedRef.current) return;
          console.log(`[RecyclableYT] WebView load end for video ${videoId}`);
        }}
        onError={(syntheticEvent) => {
          if (!isMountedRef.current) return;
          console.error(`[RecyclableYT] WebView error for video ${videoId}:`, syntheticEvent.nativeEvent);
          setIsLoading(false);
          setPlayerError('webview_error');
          onError('webview_error', syntheticEvent.nativeEvent.description || 'webview_failed');
        }}
        mixedContentMode="always"
        automaticallyAdjustContentInsets={false}
      />
      
      {playerError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {playerError === 'embed_not_allowed' 
              ? "This video doesn't allow embedding"
              : playerError === 'video_not_found'
              ? "Video not found or unavailable"
              : "Error loading video"}
          </Text>
          <Text style={styles.errorSubtext}>Try another video</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    // flex: 1, //////////////////////////////
    // position: 'relative', //////////////////////////////
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    
    // position: 'absolute',//////////////////////////
    // top: 0,//////////////////////////
    // left: 0,//////////////////////////
    // right: 0,//////////////////////////
    // bottom: 0,//////////////////////////
  },
  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
  }
}); 

export default RecyclableYouTubePlayer;