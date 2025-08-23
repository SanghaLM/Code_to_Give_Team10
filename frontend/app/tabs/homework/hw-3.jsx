
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Image, PanResponder, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const bananaImg = 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg';
const appleImg = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg';
const orangeImg = 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg';

export default function Hw3Screen() {
  const router = useRouter();
  const [dropped, setDropped] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const dropZone = useRef(null);
  const [dropZoneLayout, setDropZoneLayout] = useState(null);
  const pan = useRef([new Animated.ValueXY(), new Animated.ValueXY(), new Animated.ValueXY()]).current;

  // Only banana is correct (index 0)
  const images = [
    { src: bananaImg, label: 'Banana' },
    { src: appleImg, label: 'Apple' },
    { src: orangeImg, label: 'Orange' },
  ];

  const panResponders = images.map((img, idx) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !dropped,
      onPanResponderGrant: () => {
        setDraggingIdx(idx);
        pan[idx].setOffset({
          x: pan[idx].x._value,
          y: pan[idx].y._value,
        });
        pan[idx].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: pan[idx].x, dy: pan[idx].y },
      ], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        pan[idx].flattenOffset();
        const handleMiss = () => {
          Animated.spring(pan[idx], {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        };

        // Try to measure drop zone on screen and use gesture coordinates
        if (dropZone.current && dropZone.current.measure) {
          dropZone.current.measure((fx, fy, width, height, px, py) => {
            const dropX = gesture.moveX || (e && e.nativeEvent && e.nativeEvent.pageX);
            const dropY = gesture.moveY || (e && e.nativeEvent && e.nativeEvent.pageY);
            if (
              dropX >= px &&
              dropX <= px + width &&
              dropY >= py &&
              dropY <= py + height
            ) {
              if (idx === 0) {
                // correct drop
                setDropped(true);
                // reset pan position so the draggable disappears cleanly
                pan[idx].setValue({ x: 0, y: 0 });
              } else {
                handleMiss();
              }
            } else {
              handleMiss();
            }
          });
        } else if (dropZoneLayout) {
          // fallback to layout-based check (may be relative)
          const { pageX, pageY } = e.nativeEvent;
          const { x, y, width, height } = dropZoneLayout;
          if (
            pageX >= x &&
            pageX <= x + width &&
            pageY >= y &&
            pageY <= y + height
          ) {
            if (idx === 0) {
              setDropped(true);
              pan[idx].setValue({ x: 0, y: 0 });
            } else {
              handleMiss();
            }
          } else {
            handleMiss();
          }
        } else {
          // no drop zone info, snap back
          handleMiss();
        }

        setDraggingIdx(null);
      },
    })
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>
        <Text style={styles.moduleInfo}>Booklet 2, Module 4 - Fruits</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.instruction}>Match the word</Text>
        <View style={styles.wordRow}>
          <Text style={styles.word}>banana</Text>
          <View
            ref={dropZone}
            onLayout={e => setDropZoneLayout(e.nativeEvent.layout)}
            style={[styles.dropZone, dropped && { backgroundColor: '#34C759' }]}
          >
            {dropped && (
              <Image source={{ uri: bananaImg }} style={styles.droppedImg} />
            )}
          </View>
        </View>
        <View style={styles.audioIcon}>
          <Ionicons name="volume-high" size={32} color="#fff" />
        </View>
        {/* Images to drag */}
        <View style={styles.imagesRow}>
          {images.map((img, idx) => (
            // If dropped and this is the banana, don't render it in the row
            !(dropped && idx === 0) ? (
              <Animated.View
                key={img.label}
                style={[styles.draggableImg, pan[idx].getLayout(), draggingIdx === idx && { zIndex: 2 }]}
                {...panResponders[idx].panHandlers}
              >
                <Image source={{ uri: img.src }} style={styles.img} />
              </Animated.View>
            ) : null
          ))}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable
          style={[styles.nextButton, !dropped && { opacity: 0.5 }]}
          onPress={() => {
            if (!dropped) return;
            // reset state so this screen is unselected when returned to
            setDropped(false);
            setDraggingIdx(null);
            // reset pan positions
            pan.forEach(p => p.setValue({ x: 0, y: 0 }));
            router.push('/tabs/homework/hw-4');
          }}
          disabled={!dropped}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9500',
    width: '75%',
    borderRadius: 4,
  },
  moduleInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instruction: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  word: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 20,
    textAlign: 'center',
  },
  dropZone: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bbb',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  droppedImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  audioIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 20,
  },
  draggableImg: {
    width: 70,
    height: 70,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'flex-end',
  },
  nextButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
