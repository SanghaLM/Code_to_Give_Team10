import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// League system configuration (Duolingo-inspired)
const LEAGUES = [
  { 
    id: 'bronze', 
    name: 'Bronze League', 
    icon: '🥉', 
    color: '#CD7F32', 
    minPoints: 0, 
    maxPoints: 999,
    participants: 50,
    description: 'Starting your journey!'
  },
  { 
    id: 'silver', 
    name: 'Silver League', 
    icon: '🥈', 
    color: '#C0C0C0', 
    minPoints: 1000, 
    maxPoints: 2499,
    participants: 50,
    description: 'Building momentum!'
  },
  { 
    id: 'gold', 
    name: 'Gold League', 
    icon: '🥇', 
    color: '#FFD700', 
    minPoints: 2500, 
    maxPoints: 4999,
    participants: 50,
    description: 'Shining bright!'
  },
  { 
    id: 'platinum', 
    name: 'Platinum League', 
    icon: '💎', 
    color: '#E5E4E2', 
    minPoints: 5000, 
    maxPoints: 9999,
    participants: 30,
    description: 'Elite engagement!'
  },
  { 
    id: 'diamond', 
    name: 'Diamond League', 
    icon: '💠', 
    color: '#B9F2FF', 
    minPoints: 10000, 
    maxPoints: 19999,
    participants: 20,
    description: 'Exceptional dedication!'
  },
  { 
    id: 'obsidian', 
    name: 'Obsidian League', 
    icon: '🖤', 
    color: '#36454F', 
    minPoints: 20000, 
    maxPoints: Infinity,
    participants: 10,
    description: 'Legendary status!'
  }
];

// Point system configuration with anti-abuse measures
const POINT_ACTIVITIES = {
  miniGame: { 
    name: 'English Mini-Game', 
    points: 50, 
    maxDaily: 200, 
    maxWeekly: 1000,
    icon: '🎮',
    description: 'Play with your child'
  },
  forumPost: { 
    name: 'Forum Post', 
    points: 25, 
    maxDaily: 100, 
    maxWeekly: 500,
    icon: '📝',
    description: 'Share experiences'
  },
  forumComment: { 
    name: 'Helpful Comment', 
    points: 10, 
    maxDaily: 50, 
    maxWeekly: 250,
    icon: '💬',
    description: 'Support other parents'
  },
  goodBehavior: { 
    name: 'Community Recognition', 
    points: 100, 
    maxDaily: 100, 
    maxWeekly: 300,
    icon: '⭐',
    description: 'Positive community impact'
  },
  dailyLogin: { 
    name: 'Daily Check-in', 
    points: 5, 
    maxDaily: 5, 
    maxWeekly: 35,
    icon: '📅',
    description: 'Stay connected'
  },
  homeworkHelp: { 
    name: 'Homework Support', 
    points: 30, 
    maxDaily: 90, 
    maxWeekly: 450,
    icon: '📚',
    description: 'Help with assignments'
  }
};

// Mock data for demonstration
const mockCurrentUser = {
  id: 'user123',
  name: 'Sarah Chen',
  avatar: '👩‍🏫',
  currentLeague: 'gold',
  weeklyPoints: 1250,
  totalPoints: 3750,
  rank: 8,
  streak: 12,
  kindergarten: 'Happy Valley Kindergarten',
  children: ['Emma', 'Lucas'],
  achievements: ['First Week', 'Forum Helper', 'Game Master'],
  pointsToday: 85,
  pointsThisWeek: 1250
};

const mockLeaderboardData = [
  { id: '1', name: 'Lisa Wong', avatar: '👩‍💼', points: 1580, streak: 15, kindergarten: 'Happy Valley KG', trend: 'up' },
  { id: '2', name: 'Michael Zhang', avatar: '👨‍💻', points: 1520, streak: 12, kindergarten: 'Sunshine KG', trend: 'up' },
  { id: '3', name: 'Jennifer Liu', avatar: '👩‍🎨', points: 1480, streak: 18, kindergarten: 'Rainbow KG', trend: 'same' },
  { id: '4', name: 'David Kim', avatar: '👨‍🏫', points: 1420, streak: 9, kindergarten: 'Happy Valley KG', trend: 'up' },
  { id: '5', name: 'Amy Tan', avatar: '👩‍⚕️', points: 1380, streak: 14, kindergarten: 'Little Stars KG', trend: 'down' },
  { id: '6', name: 'Robert Chen', avatar: '👨‍🔬', points: 1340, streak: 7, kindergarten: 'Sunshine KG', trend: 'up' },
  { id: '7', name: 'Helen Wu', avatar: '👩‍🍳', points: 1290, streak: 11, kindergarten: 'Rainbow KG', trend: 'same' },
  { id: '8', name: 'Sarah Chen', avatar: '👩‍🏫', points: 1250, streak: 12, kindergarten: 'Happy Valley KG', trend: 'up', isCurrentUser: true },
  { id: '9', name: 'Kevin Lee', avatar: '👨‍🎨', points: 1210, streak: 6, kindergarten: 'Little Stars KG', trend: 'down' },
  { id: '10', name: 'Grace Ng', avatar: '👩‍💻', points: 1180, streak: 13, kindergarten: 'Sunshine KG', trend: 'up' }
];

const exclusiveBenefits = [
  {
    league: 'diamond',
    benefits: [
      '🎓 Priority access to advanced learning workshops',
      '👨‍🏫 1-on-1 consultation with education specialists',
      '📚 Exclusive educational resources library',
      '🎯 Personalized learning plans for your child'
    ]
  },
  {
    league: 'obsidian',
    benefits: [
      '🌟 All Diamond benefits plus:',
      '🏆 VIP parent-teacher conference slots',
      '📱 Beta access to new app features',
      '🎪 Exclusive family learning events',
    ]
  }
];

export default function LeaderboardScreen() {
  const [selectedTab, setSelectedTab] = useState('weekly');
  const [showBenefits, setShowBenefits] = useState(false);

  const currentLeague = LEAGUES.find(league => league.id === mockCurrentUser.currentLeague);
  const nextLeague = LEAGUES.find(league => league.minPoints > mockCurrentUser.totalPoints);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return { name: 'trending-up', color: '#10b981' };
      case 'down': return { name: 'trending-down', color: '#ef4444' };
      default: return { name: 'remove', color: '#6b7280' };
    }
  };

  const renderLeagueHeader = () => (
    <View style={styles.leagueHeader}>
      <View style={styles.leagueInfo}>
        <Text style={styles.leagueIcon}>{currentLeague.icon}</Text>
        <View style={styles.leagueDetails}>
          <Text style={styles.leagueName}>{currentLeague.name}</Text>
          <Text style={styles.leagueDescription}>{currentLeague.description}</Text>
        </View>
      </View>
      
      {nextLeague && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              {mockCurrentUser.totalPoints.toLocaleString()} / {nextLeague.minPoints.toLocaleString()} points
            </Text>
            <Text style={styles.nextLeague}>Next: {nextLeague.name} {nextLeague.icon}</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(100, (mockCurrentUser.totalPoints / nextLeague.minPoints) * 100)}%`,
                  backgroundColor: currentLeague.color 
                }
              ]} 
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderUserStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Ionicons name="trophy" size={20} color="#F7941F" />
        <Text style={styles.statValue}>#{mockCurrentUser.rank}</Text>
        <Text style={styles.statLabel}>Rank</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="flame" size={20} color="#FF6B35" />
        <Text style={styles.statValue}>{mockCurrentUser.streak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="star" size={20} color="#9957B3" />
        <Text style={styles.statValue}>{mockCurrentUser.weeklyPoints}</Text>
        <Text style={styles.statLabel}>This Week</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="calendar" size={20} color="#0340A4" />
        <Text style={styles.statValue}>{mockCurrentUser.pointsToday}</Text>
        <Text style={styles.statLabel}>Today</Text>
      </View>
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabContainer}>
      <Pressable 
        style={[styles.tab, selectedTab === 'weekly' && styles.activeTab]}
        onPress={() => setSelectedTab('weekly')}
      >
        <Text style={[styles.tabText, selectedTab === 'weekly' && styles.activeTabText]}>
          This Week
        </Text>
      </Pressable>
      <Pressable 
        style={[styles.tab, selectedTab === 'allTime' && styles.activeTab]}
        onPress={() => setSelectedTab('allTime')}
      >
        <Text style={[styles.tabText, selectedTab === 'allTime' && styles.activeTabText]}>
          All Time
        </Text>
      </Pressable>
    </View>
  );

  const renderLeaderboardItem = (item, index) => {
    const trendIcon = getTrendIcon(item.trend);
    
    return (
      <View 
        key={item.id} 
        style={[
          styles.leaderboardItem,
          item.isCurrentUser && styles.currentUserItem
        ]}
      >
        <View style={styles.rankContainer}>
          <Text style={[styles.rankNumber, item.isCurrentUser && styles.currentUserRank]}>
            {index + 1}
          </Text>
          {index < 3 && (
            <Text style={styles.medalIcon}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </Text>
          )}
        </View>
        
        <Text style={styles.avatar}>{item.avatar}</Text>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, item.isCurrentUser && styles.currentUserName]}>
            {item.name} {item.isCurrentUser && '(You)'}
          </Text>
          <Text style={styles.kindergartenName}>{item.kindergarten}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <View style={styles.pointsContainer}>
            <Text style={[styles.points, item.isCurrentUser && styles.currentUserPoints]}>
              {item.points.toLocaleString()}
            </Text>
            <Ionicons name={trendIcon.name} size={16} color={trendIcon.color} />
          </View>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={12} color="#FF6B35" />
            <Text style={styles.streakText}>{item.streak} days</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPointsGuide = () => (
    <View style={styles.pointsGuide}>
      <Text style={styles.guideTitle}>💡 How to Earn Points</Text>
      {Object.entries(POINT_ACTIVITIES).map(([key, activity]) => (
        <View key={key} style={styles.activityItem}>
          <Text style={styles.activityIcon}>{activity.icon}</Text>
          <View style={styles.activityInfo}>
            <Text style={styles.activityName}>{activity.name}</Text>
            <Text style={styles.activityDescription}>{activity.description}</Text>
          </View>
          <View style={styles.activityPoints}>
            <Text style={styles.pointsValue}>+{activity.points}</Text>
            <Text style={styles.pointsLimit}>Max: {activity.maxDaily}/day</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderExclusiveBenefits = () => (
    <View style={styles.benefitsContainer}>
      <Pressable 
        style={styles.benefitsHeader}
        onPress={() => setShowBenefits(!showBenefits)}
      >
        <Text style={styles.benefitsTitle}>🎁 Exclusive Benefits</Text>
        <Ionicons 
          name={showBenefits ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </Pressable>
      
      {showBenefits && (
        <View style={styles.benefitsList}>
          {exclusiveBenefits.map((benefit) => {
            const league = LEAGUES.find(l => l.id === benefit.league);
            return (
              <View key={benefit.league} style={styles.benefitLeague}>
                <View style={styles.benefitLeagueHeader}>
                  <Text style={styles.benefitLeagueIcon}>{league.icon}</Text>
                  <Text style={styles.benefitLeagueName}>{league.name}</Text>
                </View>
                {benefit.benefits.map((item, index) => (
                  <Text key={index} style={styles.benefitItem}>{item}</Text>
                ))}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderLeagueHeader()}
        {renderUserStats()}
        {renderExclusiveBenefits()}
        {renderTabSelector()}
        
        <View style={styles.leaderboardContainer}>
          <Text style={styles.sectionTitle}>🏆 League Rankings</Text>
          {mockLeaderboardData.map((item, index) => renderLeaderboardItem(item, index))}
        </View>
        
        {renderPointsGuide()}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E7',
    paddingTop: '12%',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: '5%',
  },
  
  // League Header
  leagueHeader: {
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
  leagueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  leagueIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  leagueDetails: {
    flex: 1,
  },
  leagueName: {
    fontSize: 24,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
  },
  leagueDescription: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#333',
  },
  nextLeague: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#F7941F',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginTop: 2,
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#F7941F',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  
  // Leaderboard
  leaderboardContainer: {
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
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  currentUserItem: {
    backgroundColor: '#FFF4E7',
    borderWidth: 2,
    borderColor: '#F7941F',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#333',
  },
  currentUserRank: {
    color: '#F7941F',
  },
  medalIcon: {
    fontSize: 16,
    marginLeft: 4,
  },
  avatar: {
    fontSize: 32,
    marginHorizontal: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
  },
  currentUserName: {
    color: '#F7941F',
  },
  kindergartenName: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    marginRight: 4,
  },
  currentUserPoints: {
    color: '#F7941F',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  streakText: {
    fontSize: 10,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginLeft: 2,
  },
  
  // Points Guide
  pointsGuide: {
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
  guideTitle: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginTop: 2,
  },
  activityPoints: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#10b981',
    fontWeight: 'bold',
  },
  pointsLimit: {
    fontSize: 10,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginTop: 2,
  },
  
  // Benefits
  benefitsContainer: {
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
  benefitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
  },
  benefitsList: {
    marginTop: 15,
  },
  benefitLeague: {
    marginBottom: 20,
  },
  benefitLeagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitLeagueIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  benefitLeagueName: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
  },
  benefitItem: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular', 
    color: '#333',
    marginBottom: 4,
    paddingLeft: 10,
  },
  
  // Anti-abuse
  antiAbuseNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  antiAbuseText: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#0369a1',
    marginLeft: 6,
  },
});