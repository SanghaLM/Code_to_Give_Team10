import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const bananaImg = 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg';
const appleImg = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg';
const orangeImg = 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg';

export default function Hw3Screen() {
  const router = useRouter();
  const [selectedCloud, setSelectedCloud] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);

  const handleCloudSelect = (index) => {
    setSelectedCloud(index);
    if (index === 2) { // Letter E is correct
      setIsCorrect(true);
      setShowTryAgain(false);
    } else {
      setIsCorrect(false);
      setShowTryAgain(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedCloud(null);
    setIsCorrect(false);
    setShowTryAgain(false);
  };

  const handleNext = () => {
    setTimeout(() => {
      router.push('/tabs/homework/hw-4');
    }, 1000);
  };

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
        <Text style={styles.instruction}>
          Click the cloud with the letter{' '}
          <Text style={styles.highlightedLetter}>"E"</Text>
        </Text>
        
        <View style={styles.contentArea}>
          <View style={styles.cloudsContainer}>
            <Pressable 
              style={[styles.cloud, selectedCloud === 0 && styles.selectedCloud]}
              onPress={() => handleCloudSelect(0)}
            >
              <Text style={styles.cloudLetter}>F</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.cloud, selectedCloud === 1 && styles.selectedCloud]}
              onPress={() => handleCloudSelect(1)}
            >
              <Text style={styles.cloudLetter}>K</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.cloud, selectedCloud === 2 && styles.selectedCloud]}
              onPress={() => handleCloudSelect(2)}
            >
              <Text style={styles.cloudLetter}>E</Text>
            </Pressable>
          </View>

          {showTryAgain && (
            <View style={styles.tryAgainContainer}>
              <Text style={styles.tryAgainText}>Try again!</Text>
              <Pressable style={styles.tryAgainButton} onPress={handleTryAgain}>
                <Text style={styles.tryAgainButtonText}>Try Again</Text>
              </Pressable>
            </View>
          )}

          {isCorrect && (
            <Text style={styles.correctText}>Correct! 🎉</Text>
          )}
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
          style={styles.nextButton}
          onPress={handleNext}
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
    fontFamily: 'BalsamiqSans_400Regular',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instruction: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textAlign: 'left',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedLetter: {
    color: '#FF9500',
  },
  cloudsContainer: {
    alignItems: 'center',
    gap: 30,
    marginBottom: 40,
  },
  cloud: {
    width: 120,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#87CEEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCloud: {
    borderColor: '#FF6B6B',
    borderWidth: 4,
    backgroundColor: '#FFF0F0',
  },
  cloudLetter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF0000',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  tryAgainContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  tryAgainText: {
    fontSize: 20,
    color: '#FF6B6B',
    marginBottom: 15,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  tryAgainButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  correctText: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: 'bold',
    marginTop: 20,
    fontFamily: 'BalsamiqSans_400Regular',
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
    fontFamily: 'BalsamiqSans_400Regular',
  },
});
