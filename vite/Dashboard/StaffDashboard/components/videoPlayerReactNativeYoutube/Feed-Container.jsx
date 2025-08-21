// EnhancedScrollingHeader.jsx
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createFrame } from './Frame-Factory';
import { WebViewPool } from './WebView-Pool';
import { useContentController } from 'app/context/ContentController';
import { useSafeAreaInsetsStyle } from 'app/util/useSafeAreaInsetsStyle';

const windowDimensions = Dimensions.get('window');
const screenHeight = windowDimensions?.height || 800; // Default fallback height
const FRAME_MARGIN_BOTTOM = 10;

const EnhancedScrollingHeader = ({
  onClose = () => {},
  visible,
  selectedContent,
  initialVideoId,
  title,
  isStretchingFeed = false
}) => {
  const router = useRouter();
  const safeAreaStyleTop = useSafeAreaInsetsStyle(['top'], 'padding', { top: { ios: -1} });
  
  const {
    isVideoFeedReady,
    isStretchingFeedReady,
    getVideoFeedState,
    getStretchingFeed,
    navigateToVideo,
    navigateToStretchingVideo,
    loadMoreVideos,
    refreshVideos,
    clearStretchingFeed,
  } = useContentController();

  // Get feed state from ContentController - clearly separate stretching vs regular feed
  const feedState = useMemo(() => {
    
    // Check if we should use the stretching feed
    if (isStretchingFeed) {
      console.log('[EnhancedScrollingHeader] Using specialized stretching feed');
      return getStretchingFeed();
    }
    
    // Regular feed from context
    if (isVideoFeedReady && !isStretchingFeed) {
      console.log('[EnhancedScrollingHeader] Using regular feed');
      return getVideoFeedState();
    }
    return { videos: [], activeVideos: [], isLoading: true };
  }, [isVideoFeedReady, getVideoFeedState, getStretchingFeed, isStretchingFeed]);

  // APPROACH 1: Process regular video feed with randomization
  const processRegularVideos = useCallback((feedVideos, initialVideoId) => {
    console.log('[EnhancedScrollingHeader] Processing regular video feed with randomization');
    
    // If there are no videos or initialVideoId is not provided, just return the original array
    if (feedVideos.length === 0 || !initialVideoId) {
      return feedVideos;
    }
    
    // Find the initial video
    const initialVideoIndex = feedVideos.findIndex(video => video.id === initialVideoId);
    
    // If initial video is not found, just randomize all videos
    if (initialVideoIndex === -1) {
      console.log('[EnhancedScrollingHeader] Initial video not found, randomizing all videos');
      return [...feedVideos].sort(() => Math.random() - 0.5);
    }
    
    // Remove the initial video from the array
    const initialVideo = feedVideos[initialVideoIndex];
    const remainingVideos = feedVideos.filter((_, index) => index !== initialVideoIndex);
    
    // Randomize the remaining videos
    console.log('[EnhancedScrollingHeader] Randomizing videos after initial video');
    const randomizedVideos = [...remainingVideos].sort(() => Math.random() - 0.5);
    
    // Return the initial video followed by randomized videos
    return [initialVideo, ...randomizedVideos];
  }, []);

  // APPROACH 2: Process stretching video feed - preserve order exactly as received
  const processStretchingVideos = useCallback((feedVideos, initialVideoId) => {
    console.log('[EnhancedScrollingHeader] Processing stretching video feed');
    
    // If there are no videos, just return the empty array
    if (feedVideos.length === 0) {
      return feedVideos;
    }
    
    // For stretching feeds, we want to preserve the exact order from the filter
    // but ensure the initialVideoId is first if it exists
    if (initialVideoId) {
      const initialVideoIndex = feedVideos.findIndex(video => video.id === initialVideoId);
      
      if (initialVideoIndex > 0) {
        // If initial video exists but isn't first, move it to the front
        // while maintaining the relative order of other videos
        console.log('[EnhancedScrollingHeader] Moving initial video to front of stretching feed');
        const initialVideo = feedVideos[initialVideoIndex];
        const videosWithoutInitial = feedVideos.filter((_, index) => index !== initialVideoIndex);
        return [initialVideo, ...videosWithoutInitial];
      }
    }
    
    // Otherwise return the feed exactly as is
    return feedVideos;
  }, []);

  // Select the appropriate video processing function based on feed source
  const videos = useMemo(() => {
    const feedVideos = feedState.videos || [];
    
    // First check if we're coming from the stretching route
    if (isStretchingFeed) {
      // For stretching feeds, use the dedicated stretching processing function
      console.log('[EnhancedScrollingHeader] Using specialized stretching video processing');
      return processStretchingVideos(feedVideos, initialVideoId);
    } else {
      // For regular feeds, use the randomization approach
      return processRegularVideos(feedVideos, initialVideoId);
    }
  }, [
    feedState.videos, 
    initialVideoId, 
    isStretchingFeed,
    processRegularVideos, 
    processStretchingVideos
  ]);

  // Track visible index and loading state
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const initialIndexSetRef = useRef(false);
  const scrollViewRef = useRef(null);

  // Set the initial index if initialVideoId is provided
  useEffect(() => {
    if (initialVideoId && videos.length > 0 && !initialIndexSetRef.current) {
      const index = videos.findIndex(video => video.id === initialVideoId);
      if (index !== -1) {
        console.log(
          `[EnhancedScrollingHeader] Setting initial index to ${index} for video ID ${initialVideoId}`
        );
        setVisibleIndex(index);
        initialIndexSetRef.current = true;

        // Scroll to the initial frame without triggering animation loops
        setTimeout(() => {
          if (scrollViewRef.current) {
            const yOffset = index * (screenHeight + FRAME_MARGIN_BOTTOM);
            scrollViewRef.current.scrollTo({ y: yOffset, animated: false });
          }
        }, 100);
      }
    }
  }, [initialVideoId, videos.length]);

  // Maintain a ref of visibleIndex to check when to load more videos
  const visibleIndexRef = useRef(visibleIndex);
  useEffect(() => {
    visibleIndexRef.current = visibleIndex;
  }, [visibleIndex]);

  // Trigger loading more videos when nearing the end - REGULAR FEED ONLY
  const checkAndLoadMoreVideos = useCallback(() => {
    if (!videos.length || isStretchingFeed) return; // Skip for stretching feed
    
    const nearEnd = videos.length - visibleIndexRef.current <= 5;
    if (feedState.hasMore && nearEnd && !isLoadingMore && !feedState.isLoading) {
      setIsLoadingMore(true);
      loadMoreVideos().finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [videos, feedState.hasMore, feedState.isLoading, isLoadingMore, loadMoreVideos, isStretchingFeed]);

  // Use a ref to avoid duplicate actions on the same index
  const lastNavigatedIndexRef = useRef(-1);

  // This function prints "isActive" when a frame becomes active
  const handleIsActive = useCallback(() => {
    console.log('isActive');
  }, []);

  // Combined effect to handle visibleIndex changes (snap events and initial load)
  useEffect(() => {
    if (visibleIndex !== lastNavigatedIndexRef.current) {
      lastNavigatedIndexRef.current = visibleIndex;
      // Print isActive on each new active frame
      handleIsActive();
      // If initial index has been set, navigate to the video
      if (initialIndexSetRef.current) {
        // Use the appropriate navigation function based on feed type
        if (isStretchingFeed) {
          navigateToStretchingVideo(visibleIndex);
        } else {
          navigateToVideo(visibleIndex);
        }
      }
      // Check if more videos need to be loaded (regular feed only)
      if (!isStretchingFeed) {
        checkAndLoadMoreVideos();
      }
    }
  }, [
    visibleIndex, 
    navigateToVideo,
    navigateToStretchingVideo, 
    checkAndLoadMoreVideos, 
    handleIsActive,
    isStretchingFeed
  ]);

  // Scroll handler to check for loading more videos while scrolling
  const handleScroll = (event) => {
    // Skip for stretching feed
    if (isStretchingFeed) return;
    
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    if (
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 100 &&
      !loadingMoreRef.current
    ) {
      loadingMoreRef.current = true;
      checkAndLoadMoreVideos();
      setTimeout(() => {
        loadingMoreRef.current = false;
      }, 500);
    }
  };

  // Update visibleIndex when scrolling stops (snap effect)
  const handleMomentumScrollEnd = (event) => {
    const { contentOffset } = event.nativeEvent;
    let newIndex = Math.round(
      (contentOffset.y) / (screenHeight + FRAME_MARGIN_BOTTOM)
    );
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= videos.length) newIndex = videos.length - 1;
    if (newIndex !== visibleIndex) {
      setVisibleIndex(newIndex);
    }
  };

  // Pre-calculate snap offsets for the ScrollView
  const snapOffsets = useMemo(() => {
    return videos.map((_, index) => index * (screenHeight + FRAME_MARGIN_BOTTOM));
  }, [videos]);

  // Render a frame using our frame factory.
  // Here, the active state is computed inside WebViewPool (based on visibleIndex)
  // and passed down as the "isActive" parameter.
  const renderItem = useCallback(({ index, isActive, recycleKey }) => {
    const video = videos[index];
    console.log(`Rendering frame ${index} isActive: ${isActive}`);
    return createFrame(video, index, isActive);
  }, [videos]);

  // Key generator for frames
  const getItemKey = useCallback((index) => {
    const video = videos[index];
    return video ? `video-${video.id || index}` : `empty-${index}`;
  }, [videos]);

  // Calculate total content height
  const contentHeight = videos.length * (screenHeight + FRAME_MARGIN_BOTTOM);

  // Close handler integrated with router
  const handleClose = useCallback(() => {
    console.log('[EnhancedScrollingHeader] handleClose => closing');
    
    // Clear stretching feed state if this is a stretching feed
    if (isStretchingFeed) {
      console.log('[EnhancedScrollingHeader] Clearing stretching feed state');
      clearStretchingFeed();
    }
    
    onClose();
    router.back();
  }, [onClose, router, isStretchingFeed, clearStretchingFeed]);

  // Render loading or error states if necessary
  if (feedState.isLoading && videos.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Preparing videos...</Text>
      </View>
    );
  }

  if (!feedState.isLoading && videos.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No videos found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshVideos}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, safeAreaStyleTop]}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>

      {/* Loading More Indicator - only show for regular feed */}
      {isLoadingMore && !isStretchingFeed && (
        <View style={styles.loadingMoreIndicator}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContainer, { height: contentHeight }]}
        onScroll={isStretchingFeed ? undefined : handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        snapToOffsets={snapOffsets}
        decelerationRate="fast"
      >
        {/* Render frames via the WebViewPool.
            WebViewPool computes and passes the "isActive" flag to each frame
            based on the visibleIndex prop. */}
        <WebViewPool
          renderItem={renderItem}
          totalCount={videos.length}
          visibleIndex={visibleIndex}
          poolSize={5}
          getItemKey={getItemKey}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: '20%',
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 7,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingMoreIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingMoreText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default EnhancedScrollingHeader;
