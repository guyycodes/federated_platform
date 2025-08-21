// Test-WebView-Pool.jsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const windowDimensions = Dimensions.get('window');
const screenHeight = windowDimensions?.height || 800; // Default fallback height
const FRAME_MARGIN_BOTTOM = 10;

/**
 * WebViewPool - A component that efficiently manages a pool of WebViews.
 * It recycles web views to reduce resource consumption.
 */
export const WebViewPool = ({
  renderItem,
  totalCount,
  visibleIndex,
  animatingToIndex = null,
  poolSize = 5,
  getItemKey,
}) => {
  // Calculate pool indices, centered around the visible index
  const poolStartIndex = Math.max(0, Math.min(totalCount - poolSize, visibleIndex - Math.floor(poolSize / 2)));
  const poolIndices = Array.from({ length: Math.min(poolSize, totalCount) }, (_, i) => poolStartIndex + i);

  // Track recycling keys for proper WebView recycling
  const [recycleKeys, setRecycleKeys] = useState({});
  const previousVisibleIndexRef = useRef(visibleIndex);
  const previousIndicesRef = useRef([]);

  useEffect(() => {
    const indicesChanged = !arraysEqual(poolIndices, previousIndicesRef.current);
    if (indicesChanged) {
      console.log(
        `[WebViewPool] Pool changed: ${previousIndicesRef.current.join(',')} -> ${poolIndices.join(',')}`
      );
      previousIndicesRef.current = [...poolIndices];
    }
  }, [poolIndices]);

  // Update recycle keys when the visible index changes
  useEffect(() => {
    if (visibleIndex !== previousVisibleIndexRef.current) {
      const isJump = Math.abs(visibleIndex - previousVisibleIndexRef.current) > 1;
      console.log(
        `[WebViewPool] Visible index changed: ${previousVisibleIndexRef.current} -> ${visibleIndex}${isJump ? ' (jump)' : ''}`
      );
      setRecycleKeys(prev => {
        const newKeys = { ...prev };
        if (isJump) {
          poolIndices.forEach(idx => {
            const wasVisible = Math.abs(idx - previousVisibleIndexRef.current) <= 1;
            const isNowVisible = Math.abs(idx - visibleIndex) <= 1;
            if (!wasVisible && isNowVisible) {
              newKeys[idx] = (newKeys[idx] || 0) + 1;
              console.log(`[WebViewPool] Recycling WebView at index ${idx}`);
            }
          });
        }
        previousVisibleIndexRef.current = visibleIndex;
        return newKeys;
      });
    }
  }, [visibleIndex, poolIndices]);

  return (
    <View style={styles.container}>
      {poolIndices.map((poolIndex) => {
        const recycleKey = recycleKeys[poolIndex] || 0;
        const isActive = poolIndex === visibleIndex || (animatingToIndex !== null && poolIndex === animatingToIndex);
        const effectiveVisibleIndex = animatingToIndex !== null ? animatingToIndex : visibleIndex;
        const key = `${getItemKey(poolIndex)}-recycle-${recycleKey}`;
        const distance = Math.abs(poolIndex - effectiveVisibleIndex);

        if (poolIndex === visibleIndex) {
          const expectedKey = `${getItemKey(visibleIndex)}-recycle-${recycleKeys[visibleIndex] || 0}`;
          console.log("Current frame key consistency:", key === expectedKey);
        }

        return (
          <View
            key={key}
            style={[
              styles.itemContainer,
              { 
                top: poolIndex * (screenHeight + FRAME_MARGIN_BOTTOM),
                zIndex: isActive ? 10 : (distance === 1 ? 5 : 1),
                opacity: isActive ? 1 : (distance === 1 ? 0.99 : 0),
                display: distance > 1 ? 'none' : 'flex'
              }
            ]}
          >
            
            {renderItem({ index: poolIndex, isActive, recycleKey: key })}
          </View>
        );
      })}

      {/* Debug info – comment out in production */}
      {/* {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Pool: {poolStartIndex} to {poolStartIndex + poolIndices.length - 1}{'\n'}
            Visible: {visibleIndex}
          </Text>
        </View>
      )} */}
    </View>
  );
};

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  itemContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: screenHeight,
  },
  debugInfo: {
    position: 'absolute',
    top: 100,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 5,
    zIndex: 100,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  },
});

export default WebViewPool;
