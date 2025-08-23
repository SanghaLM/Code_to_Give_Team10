import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock data for demonstration
const mockUserData = {
  childName: "Emma",
  selectedCharacter: "robot", // robot, dragon, unicorn
  characterLevel: 3,
  totalPoints: 1250,
  currentStreak: 7,
  longestStreak: 12,
  skills: {
    pronunciation: { level: 3, progress: 0.75, xp: 450 },
    fluency: { level: 2, progress: 0.40, xp: 280 },
    confidence: { level: 4, progress: 0.20, xp: 520 }
  },
  recentAchievements: [
    { id: 1, title: "Streak Master", description: "7 days in a row!", icon: "flame", color: "#FF6B35" },
    { id: 2, title: "Pronunciation Pro", description: "Reached Level 3!", icon: "star", color: "#F7941F" },
    { id: 3, title: "Practice Champion", description: "10 submissions this month!", icon: "trophy", color: "#9957B3" }
  ],
  weeklyProgress: [
    { day: 'Mon', completed: true, points: 25 },
    { day: 'Tue', completed: true, points: 30 },
    { day: 'Wed', completed: true, points: 20 },
    { day: 'Thu', completed: true, points: 35 },
    { day: 'Fri', completed: true, points: 25 },
    { day: 'Sat', completed: true, points: 40 },
    { day: 'Sun', completed: true, points: 30 }
  ],
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
  
  // Character Section
  characterCard: {
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
  characterContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  characterEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  characterLevel: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#F7941F',
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  pointsText: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#9957B3',
    fontWeight: 'bold',
    marginLeft: 5,
  },

  // Skills Section
  skillsCard: {
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
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  skillItem: {
    marginBottom: 20,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: '600',
  },
  skillLevel: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#F7941F',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  skillXP: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
    marginTop: 4,
  },

  // Streak Section
  streakCard: {
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
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  streakIcon: {
    marginRight: 10,
  },
  streakNumber: {
    fontSize: 32,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  streakText: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    marginLeft: 10,
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dayItem: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
  },
  dayPoints: {
    fontSize: 10,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#9957B3',
    fontWeight: 'bold',
  },

  // Achievements Section
  achievementsCard: {
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF4E7',
    borderRadius: 12,
    marginBottom: 10,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
  },
  achievementDesc: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#6b7280',
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
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#F7941F',
    fontWeight: 'bold',
  },
});

export default function ProgressScreen() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const renderCharacterSection = () => (
    <View style={styles.characterCard}>
      <View style={styles.characterContainer}>
        <Text style={styles.characterEmoji}>
          {characterEmojis[mockUserData.selectedCharacter]}
          {characterAccessories[mockUserData.characterLevel]}
        </Text>
        <Text style={styles.characterLevel}>
          Level {mockUserData.characterLevel}
        </Text>
      </View>
      <View style={styles.pointsContainer}>
        <Ionicons name="star" size={20} color="#9957B3" />
        <Text style={styles.pointsText}>
          {mockUserData.totalPoints.toLocaleString()} Points
        </Text>
      </View>
    </View>
  );

  const renderSkillsSection = () => (
    <View style={styles.skillsCard}>
      <Text style={styles.sectionTitle}>Your Skills</Text>
      {Object.entries(mockUserData.skills).map(([skillName, skill]) => (
        <View key={skillName} style={styles.skillItem}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillName}>
              {skillName.charAt(0).toUpperCase() + skillName.slice(1)}
            </Text>
            <Text style={styles.skillLevel}>Level {skill.level}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${skill.progress * 100}%`,
                  backgroundColor: skillName === 'pronunciation' ? '#10b981' : 
                                 skillName === 'fluency' ? '#3b82f6' : '#8b5cf6'
                }
              ]} 
            />
          </View>
          <Text style={styles.skillXP}>{skill.xp} XP</Text>
        </View>
      ))}
    </View>
  );

  const renderStreakSection = () => (
    <View style={styles.streakCard}>
      <Text style={styles.sectionTitle}>Practice Streak</Text>
      <View style={styles.streakHeader}>
        <Ionicons name="flame" size={32} color="#FF6B35" style={styles.streakIcon} />
        <Text style={styles.streakNumber}>{mockUserData.currentStreak}</Text>
        <Text style={styles.streakText}>days in a row!</Text>
      </View>
      <View style={styles.weeklyGrid}>
        {mockUserData.weeklyProgress.map((day, index) => (
          <View key={index} style={styles.dayItem}>
            <View style={[
              styles.dayCircle,
              { backgroundColor: day.completed ? '#10b981' : '#f3f4f6' }
            ]}>
              <Ionicons 
                name={day.completed ? "checkmark" : "close"} 
                size={20} 
                color={day.completed ? '#fff' : '#9ca3af'} 
              />
            </View>
            <Text style={styles.dayText}>{day.day}</Text>
            {day.completed && (
              <Text style={styles.dayPoints}>+{day.points}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderAchievementsSection = () => (
    <View style={styles.achievementsCard}>
      <Text style={styles.sectionTitle}>Recent Achievements</Text>
      {mockUserData.recentAchievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementItem}>
          <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
            <Ionicons name={achievement.icon} size={24} color="#fff" />
          </View>
          <View style={styles.achievementText}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDesc}>{achievement.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderFriendsSection = () => (
    <View style={styles.friendsCard}>
      <Text style={styles.sectionTitle}>🎉 Amazing Progress!</Text>
      <Text style={styles.friendsText}>
        You've reached Level {mockUserData.characterLevel} in your learning journey!{'\n\n'}
        Your friends{' '}
        <Text style={styles.friendsNames}>
          {mockUserData.friendsAtLevel.join(', ')}
        </Text>
        {' '}are also at this level.{'\n\n'}
        Keep practicing to reach Level {mockUserData.characterLevel + 1} together! 🚀
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
          <Text style={styles.title}>Hi {mockUserData.childName}! 👋</Text>
          <Text style={styles.subtitle}>Your Learning Journey</Text>
        </View>

        {renderCharacterSection()}
        {renderSkillsSection()}
        {renderStreakSection()}
        {renderAchievementsSection()}
        {renderFriendsSection()}
      </ScrollView>
    </View>
  );
}
