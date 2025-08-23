import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Animated, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Hw4Screen() {
  const router = useRouter();

  const [dropped, setDropped] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const dropZone = useRef(null);
  const options = ['play', 'eat', 'run'];
  const pans = useRef(options.map(() => new Animated.ValueXY())).current;

  const panResponders = options.map((opt, idx) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !dropped,
      onPanResponderGrant: () => {
        setDraggingIdx(idx);
        pans[idx].setOffset({ x: pans[idx].x._value, y: pans[idx].y._value });
        pans[idx].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pans[idx].x, dy: pans[idx].y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        pans[idx].flattenOffset();
        const handleMiss = () => {
          Animated.spring(pans[idx], { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        };

        if (dropZone.current && dropZone.current.measure) {
          dropZone.current.measure((fx, fy, width, height, px, py) => {
            const dropX = gesture.moveX || (e && e.nativeEvent && e.nativeEvent.pageX);
            const dropY = gesture.moveY || (e && e.nativeEvent && e.nativeEvent.pageY);
            if (dropX >= px && dropX <= px + width && dropY >= py && dropY <= py + height) {
              // Only accept if correct answer
              if (options[idx] === 'play') {
                setDropped(true);
                setSelectedWord(options[idx]);
                // reset pan so tile disappears from its position
                pans[idx].setValue({ x: 0, y: 0 });
              } else {
                handleMiss();
              }
            } else {
              handleMiss();
            }
          });
        } else {
          handleMiss();
        }

        setDraggingIdx(null);
      },
    })
  );
  const screenWidth = Dimensions.get('window').width;
  const sentenceFontSize = Math.max(18, Math.min(48, Math.floor(screenWidth / 9)));

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
        <Text style={styles.instruction}>Complete the sentence</Text>
        <View style={styles.sentenceRow}>
          <Text style={[styles.word, { fontSize: sentenceFontSize }]}>I like to </Text>
          <View
            ref={dropZone}
            style={[styles.dropZone, dropped && styles.dropZoneFilled]}
            onLayout={() => { /* measured on drop via ref.measure */ }}
          >
            {dropped ? <Text style={[styles.dropText, { fontSize: Math.max(14, sentenceFontSize - 18) }]}>{selectedWord}</Text> : <Text style={[styles.blank, { fontSize: Math.max(14, sentenceFontSize - 18) }]}>____</Text>}
          </View>
          <Text style={[styles.word, { fontSize: sentenceFontSize }]}> football</Text>
        </View>
        <View style={styles.audioIcon}>
          <Ionicons name="volume-high" size={32} color="#fff" />
        </View>

        <View style={styles.optionsRow}>
          {options.map((opt, idx) => (
            !(dropped && opt === selectedWord) && (
              <Animated.View
                key={opt}
                style={[styles.wordTile, pans[idx].getLayout(), draggingIdx === idx && { zIndex: 2 }]}
                {...panResponders[idx].panHandlers}
              >
                <Text style={styles.tileText}>{opt}</Text>
              </Animated.View>
            )
          ))}
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Pressable
          style={[styles.nextButton, !dropped && { opacity: 0.5 }]}
          onPress={() => {
            if (!dropped) return;
            // reset state so returning resets the exercise
            setDropped(false);
            setSelectedWord(null);
            setDraggingIdx(null);
            pans.forEach(p => p.setValue({ x: 0, y: 0 }));
            router.push('/tabs/homework/hw-end');
          }}
          disabled={!dropped}
        >
          <Text style={styles.nextButtonText}>Finish</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
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
    width: '100%',
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
  sentenceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  flexWrap: 'wrap',
  justifyContent: 'center',
  },
  instruction: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textAlign: 'center',
  },
  word: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  dropZone: {
    minWidth: 80,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#bbb',
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  dropZoneFilled: {
    backgroundColor: '#34C759',
  },
  blank: { fontSize: 24, color: '#666' },
  dropText: { fontSize: 22, color: '#fff', fontWeight: '700' },
  audioIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 12,
  },
  wordTile: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tileText: {
    fontSize: 18,
    fontWeight: '600',
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
