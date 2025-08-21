import React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import RecyclableYouTubePlayer from './RecyclableYouTubePlayer'; // adjust path as needed
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { Youtube } from 'lucide-react-native';
import { getSafeAreaInsetValue } from 'app/util/useSafeAreaInsetsStyle';

const windowDimensions = Dimensions.get('window');
const screenHeight = windowDimensions?.height || 800; // Default fallback height
const screenWidth = windowDimensions?.width || 400; // Default fallback width

/**
 * Extract YouTube video ID from a URL
 * @param {string} url - The YouTube URL
 * @returns {string|null} - The extracted video ID or null
 */
const extractYouTubeId = (url) => {
  if (!url) return null;
  
  // Handle standard YouTube URLs
  const standardRegex = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(standardRegex);
  if (match && match[1] && match[1].length === 11) return match[1];
  
  // Handle youtu.be short links
  const shortRegex = /^.*(?:youtu.be\/)([^#\&\?]*).*/;
  const shortMatch = url.match(shortRegex);
  if (shortMatch && shortMatch[1] && shortMatch[1].length === 11) return shortMatch[1];
  
  return null;
};

/**
 * Get a safe string field or default value
 */
function getSafeField(value, defaultValue = '') {
  if (typeof value !== 'string') return defaultValue;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === 'undefined') {
    return defaultValue;
  }
  return value;
}

/**
 * Memoized component for individual jailbar
 */
const JailBar = React.memo(({ position, width }) => (
  <TouchableOpacity 
    style={[
      styles.jailbar,
      { 
        left: position,
        width: width 
      }
    ]}
    activeOpacity={1}
    hitSlop={{top: 0, bottom: 0, left: 0, right: 1}}
    pointerEvents="auto"
  />
));

// Pre-calculate jailbar positions for common screen sizes to avoid repeated calculations
// the jail bars are for picking up screen interactions
const getJailBars = (() => {
  // Cache for different screen widths
  const cache = {};
  
  return (screenWidth) => {
    // Return cached result if available
    if (cache[screenWidth]) {
      return cache[screenWidth];
    }
    
    const totalBars = 25;
    const barWidth = 6.2; // Width of each bar in pixels
    
    // Calculate the width of each "cell" (bar + space) to distribute evenly
    const cellWidth = screenWidth / totalBars;
    
    const bars = [];
    for (let i = 0; i < totalBars; i++) {
      // Position each bar in the center of its "cell"
      const leftPosition = (i * cellWidth) + ((cellWidth - barWidth) / 2);
      
      bars.push(
        <JailBar 
          key={`bar-${i}`}
          position={leftPosition}
          width={barWidth}
        />
      );
    }
    
    // Store in cache
    cache[screenWidth] = bars;
    return bars;
  };
})();

/**
 * createFrame - Factory function to produce a frame containing a recyclable WebView.
 *
 * @param {object} video - The video object with URL, title, etc.
 * @param {number} index - Unique index/key for the frame.
 * @returns {JSX.Element} A frame element with borders.
 */
export const createFrame = (video, index, isActive) => {
  // State to track overlay visibility
  const [showOverlay, setShowOverlay] = React.useState(true);
  // this value come from our safe area value top, we get the numeric value to dynamically adjust the screen height for the video
  const topInsetValue = getSafeAreaInsetValue('top', { ios: -1 }); 


  // Reset overlay visibility when index changes (new frame becomes active)
  React.useEffect(() => {
    if (isActive) {
      setShowOverlay(true);
    }
  }, [isActive]);
  
  // Handle empty video case
  if (!video) {
    return (
      <View key={`empty-${index}`} style={[styles.frameContainer, styles.errorContainer]}>
        <Text style={styles.errorText}>No video data</Text>
      </View>
    );
  }
  
  // Extract YouTube ID from URL
  const youtubeId = video.youtubeId || extractYouTubeId(video.URL);
  
  // Handle invalid video ID case
  if (!youtubeId) {
    return (
      <View key={`invalid-${index}`} style={[styles.frameContainer, styles.errorContainer]}>
        <Text style={styles.errorText}>Invalid video URL</Text>
        <Text style={styles.errorDetail}>{video.title || 'Unknown title'}</Text>
      </View>
    );
  }
  
  // Get safe fields
  const title = getSafeField(video.title, 'Untitled Video');
  const author = getSafeField(video.postedBy || video.instructor || video.author, 'Unknown Creator');
  const description = getSafeField(video.description, '');
  const likes = video.likes || 0;
  
  // Get pre-calculated jailbars
  const jailBars = getJailBars(screenWidth);
  
  // Event handlers
  const handleLikePress = () => {
    console.log('Like pressed for video:', video.id);
  };
  
  const handleDislikePress = () => {
    console.log('Dislike pressed for video:', video.id);
  };
  
  const handleCommentPress = () => {
    console.log('Comment pressed for video:', video.id);
  };
  
  const handleSharePress = () => {
    console.log('Share pressed for video:', video.id);
  };

  // Handle YouTube navigation
  const handleNavigationToYouTube = () => {
    setShowOverlay(false);
  };

  return (
    <View key={`video-${video.id || index}`} style={styles.frameContainer}>
      <RecyclableYouTubePlayer
        videoId={youtubeId}
        height={Math.max(0, screenHeight - (topInsetValue || 0))}
        width={screenWidth}
        isActive={isActive}
        play={isActive}
        onNavigationToYouTube={handleNavigationToYouTube}
      />
      
      {/* Jailbar overlay with pointer-events handling */}
      <View style={styles.jailbarsContainer} pointerEvents="box-none">
        {jailBars}
      </View>
      
      {/* YouTube label */}
      <View style={styles.sourceTag}>
        <Youtube color="red" size={16} />
        <Text style={styles.sourceTagText}>YouTube</Text>
      </View>

      {/* Video info overlay */}
      {showOverlay && (
        <View style={styles.videoInfoOverlay}>
          {/* Video info with gesture handling */}
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{title}</Text>
            <Text style={styles.authorName}>{author}</Text>
            <Text style={styles.videoDescription}>{description}</Text>
          </View>

          {/* Interaction Buttons */}
          <View style={styles.interactionButtons}>
            <TouchableOpacity style={styles.interactionButton} onPress={handleLikePress}>
              <View style={styles.iconContainer}>
                <AntDesign name="like2" size={28} color="white" />
              </View>
              <Text style={styles.interactionText}>{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.interactionButton} onPress={handleDislikePress}>
              <View style={styles.iconContainer}>
                <AntDesign name="dislike2" size={28} color="white" />
              </View>
              <Text style={styles.interactionText}>Dislike</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.interactionButton} onPress={handleCommentPress}>
              <View style={styles.iconContainer}>
                <FontAwesome name="comment" size={28} color="white" />
              </View>
              <Text style={styles.interactionText}>Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.interactionButton} onPress={handleSharePress}>
              <View style={styles.iconContainer}>
                <Ionicons name="share-outline" size={28} color="white" />
              </View>
              <Text style={styles.interactionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  frameContainer: {
    height: screenHeight,
    width: '100%',
    marginBottom: 10, // optional spacing between frames
    backgroundColor: 'black',
    position: 'relative',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  errorDetail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  sourceTag: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceTagText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  videoInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 0,
    zIndex: 5,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    padding: 16,
    // backgroundColor: 'rgba(208, 18, 18, 0.7)',
    pointerEvents: 'auto', // Enable pointer events for the gesture
  },
  videoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  authorName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  videoDescription: {
    color: 'white',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  interactionButtons: {
    position: 'absolute',
    right: 0,
    bottom: 105,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.0)',
    borderRadius: 12,
    padding: 0,
  },
  interactionButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  interactionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Jailbar styles
  jailbarsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    // No background color so spaces between bars are completely transparent
  },
  jailbar: {
    position: 'absolute',
    top: 0,
    height: '100%',
    // backgroundColor: 'rgba(208, 18, 18, 0.7)', // Same color as videoInfo
  },
});