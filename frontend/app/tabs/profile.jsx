import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock user data for demonstration
const mockUserData = {
  parentName: "Sarah Chen",
  children: [
    { name: "Emma", age: 5, selectedCharacter: "robot", characterLevel: 3 },
    { name: "Lucas", age: 6, selectedCharacter: "dragon", characterLevel: 2 }
  ],
  kindergarten: "Happy Learning Kindergarten",
  totalPoints: 1250,
  friendsAtLevel: ["Liam", "Sofia", "Alex"]
};

const characterEmojis = {
  robot: "🤖",
  dragon: "🐉", 
  unicorn: "🦄"
};

const characterAccessories = {
  1: "",
  2: "👒", // hat
  3: "🎒", // backpack  
  4: "🦸", // cape
  5: "👑"  // crown
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E7',
    paddingTop: '10%',
  },
  scrollContainer: {
    paddingHorizontal: '5%',
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
  },

  // User Info Section
  userInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    marginBottom: 15,
  },
  tapHint: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    width: 24,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    flex: 1,
  },

  // Children Section
  childrenCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF4E7',
    borderRadius: 12,
    marginBottom: 12,
  },
  childCharacter: {
    marginRight: 15,
  },
  characterEmoji: {
    fontSize: 40,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
  },
  childLevel: {
    alignItems: 'flex-end',
  },
  levelBadge: {
    backgroundColor: '#F7941F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#fff',
  },

  // Points Section
  pointsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  pointsText: {
    fontSize: 20,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#9957B3',
    marginLeft: 8,
  },

  // Friends Section
  friendsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendsText: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
  },
  friendsNames: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#F7941F',
  },
});

export default function ProfileScreen() {
  const router = useRouter();
  const renderUserInfo = () => (
    <View style={styles.userInfoCard}>
      <Text style={styles.sectionTitle}>Family Information</Text>
      
      <View style={styles.infoRow}>
        <Ionicons name="person" size={20} color="#F7941F" style={styles.infoIcon} />
        <Text style={styles.infoLabel}>Parent:</Text>
        <Text style={styles.infoValue}>{mockUserData.parentName}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="school" size={20} color="#F7941F" style={styles.infoIcon} />
        <Text style={styles.infoLabel}>Kindergarten:</Text>
        <Text style={styles.infoValue}>{mockUserData.kindergarten}</Text>
      </View>
    </View>
  );

  const renderChildren = () => (
    <View style={styles.childrenCard}>
      <Text style={styles.sectionTitle}>My Children</Text>
      <Text style={styles.tapHint}>Tap on a child to see their detailed progress</Text>
      {mockUserData.children.map((child, index) => (
        <Pressable 
          key={index} 
          style={styles.childItem}
          onPress={() => router.push(`/child-progress?childName=${child.name}`)}
        >
          <View style={styles.childCharacter}>
            <Text style={styles.characterEmoji}>
              {characterEmojis[child.selectedCharacter]}
              {characterAccessories[child.characterLevel]}
            </Text>
          </View>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.childDetails}>Age {child.age} • {child.selectedCharacter} companion</Text>
          </View>
          <View style={styles.childLevel}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Level {child.characterLevel}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F7941F" style={{ marginLeft: 8 }} />
          </View>
        </Pressable>
      ))}
    </View>
  );

  const renderPoints = () => (
    <View style={styles.pointsCard}>
      <Text style={styles.sectionTitle}>Family Points</Text>
      <View style={styles.pointsContainer}>
        <Ionicons name="star" size={24} color="#9957B3" />
        <Text style={styles.pointsText}>
          {mockUserData.totalPoints.toLocaleString()} Points
        </Text>
      </View>
    </View>
  );

  const renderFriendsSection = () => (
    <View style={styles.friendsCard}>
      <Text style={styles.sectionTitle}>🎉 Amazing Progress!</Text>
      <Text style={styles.friendsText}>
        Your family is doing great in the learning journey!{'\n\n'}
        Your children's friends{' '}
        <Text style={styles.friendsNames}>
          {mockUserData.friendsAtLevel.join(', ')}
        </Text>
        {' '}are also making wonderful progress.{'\n\n'}
        Keep up the fantastic work! 🚀
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Family & Progress Overview</Text>
        </View>

        {renderUserInfo()}
        {renderChildren()}
        {renderPoints()}
        {renderFriendsSection()}
      </ScrollView>
    </View>
  );
}