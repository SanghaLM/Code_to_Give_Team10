import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Mock data for individual child progress
const mockChildrenData = {
  "Emma": {
    name: "Emma",
    age: 5,
    selectedCharacter: "robot",
    characterLevel: 3,
    totalPoints: 750,
    currentStreak: 7,
    longestStreak: 12,
    skills: {
      alphabetRecognition: { level: 7, percentile: 85 },
      phonemicAwareness: { level: 5, percentile: 65 },
      consistency: { level: 8, percentile: 92 },
      vocabulary: { level: 6, percentile: 75 },
      timeliness: { level: 4, percentile: 45 },
      pointAndRead: { level: 7, percentile: 88 }
    },
    skillsHistory: [
      {
        date: "2024-11-01",
        skills: { alphabetRecognition: 5, phonemicAwareness: 3, consistency: 6, vocabulary: 4, timeliness: 3, pointAndRead: 5 }
      },
      {
        date: "2024-11-15",
        skills: { alphabetRecognition: 6, phonemicAwareness: 4, consistency: 7, vocabulary: 5, timeliness: 3, pointAndRead: 6 }
      },
      {
        date: "2024-12-01",
        skills: { alphabetRecognition: 7, phonemicAwareness: 5, consistency: 8, vocabulary: 6, timeliness: 4, pointAndRead: 7 }
      }
    ],
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
  },
  "Lucas": {
    name: "Lucas",
    age: 6,
    selectedCharacter: "dragon",
    characterLevel: 2,
    totalPoints: 500,
    currentStreak: 4,
    longestStreak: 8,
    skills: {
      alphabetRecognition: { level: 4, percentile: 55 },
      phonemicAwareness: { level: 6, percentile: 78 },
      consistency: { level: 3, percentile: 35 },
      vocabulary: { level: 5, percentile: 68 },
      timeliness: { level: 2, percentile: 25 },
      pointAndRead: { level: 4, percentile: 52 }
    },
    skillsHistory: [
      {
        date: "2024-11-01",
        skills: { alphabetRecognition: 3, phonemicAwareness: 4, consistency: 2, vocabulary: 3, timeliness: 1, pointAndRead: 3 }
      },
      {
        date: "2024-11-15",
        skills: { alphabetRecognition: 3, phonemicAwareness: 5, consistency: 2, vocabulary: 4, timeliness: 2, pointAndRead: 3 }
      },
      {
        date: "2024-12-01",
        skills: { alphabetRecognition: 4, phonemicAwareness: 6, consistency: 3, vocabulary: 5, timeliness: 2, pointAndRead: 4 }
      }
    ],
    recentAchievements: [
      { id: 1, title: "Fluency Star", description: "Reached Level 3 in Fluency!", icon: "star", color: "#3b82f6" },
      { id: 2, title: "Consistent Learner", description: "4 days streak!", icon: "flame", color: "#FF6B35" }
    ],
    weeklyProgress: [
      { day: 'Mon', completed: true, points: 20 },
      { day: 'Tue', completed: true, points: 25 },
      { day: 'Wed', completed: false, points: 0 },
      { day: 'Thu', completed: true, points: 30 },
      { day: 'Fri', completed: true, points: 25 },
      { day: 'Sat', completed: false, points: 0 },
      { day: 'Sun', completed: false, points: 0 }
    ],
    friendsAtLevel: ["Maya", "Ben", "Zoe"]
  }
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
    paddingTop: '12%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    flex: 1,
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
  scrollContainer: {
    paddingHorizontal: '5%',
    paddingBottom: 100,
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
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F7941F',
  },
  historyButtonText: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#F7941F',
    fontWeight: '600',
    marginLeft: 5,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartNote: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  radarChartContainer: {
    width: '100%',
    height: 300,
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  skillItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  skillDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  skillName: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#333',
    fontWeight: '600',
  },
  skillLevel: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#F7941F',
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#FFF4E7',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    fontWeight: '600',
    marginLeft: 5,
  },
  summarySkill: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryDetails: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
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

export default function ChildProgressScreen() {
  const router = useRouter();
  const { childName } = useLocalSearchParams();
  const childData = mockChildrenData[childName] || mockChildrenData["Emma"];
  const [showHistoricalData, setShowHistoricalData] = useState(false);

  // Skill area definitions with colors matching the app theme
  const skillAreas = [
    { key: 'alphabetRecognition', name: 'Alphabet Recognition', color: '#F7941F' },
    { key: 'phonemicAwareness', name: 'Phonemic Awareness', color: '#9957B3' },
    { key: 'consistency', name: 'Consistency', color: '#0340A4' },
    { key: 'vocabulary', name: 'Vocabulary', color: '#10b981' },
    { key: 'timeliness', name: 'Timeliness', color: '#3b82f6' },
    { key: 'pointAndRead', name: 'Point and Read', color: '#8b5cf6' }
  ];



  // Get skill summary for strengths and adventures
  const getSkillSummary = () => {
    const skillEntries = Object.entries(childData.skills);
    const strongest = skillEntries.reduce((max, current) => 
      current[1].percentile > max[1].percentile ? current : max
    );
    const adventure = skillEntries.reduce((min, current) => 
      current[1].percentile < min[1].percentile ? current : min
    );
    
    const strongestArea = skillAreas.find(area => area.key === strongest[0]);
    const adventureArea = skillAreas.find(area => area.key === adventure[0]);
    
    // Helper function to get percentile description
    const getPercentileDescription = (percentile) => {
      if (percentile >= 90) return "over 90th percentile";
      if (percentile >= 80) return "over 80th percentile";
      if (percentile >= 70) return "over 70th percentile";
      if (percentile >= 60) return "over 60th percentile";
      return "developing well";
    };
    
    return {
      strongest: { 
        area: strongestArea, 
        percentile: strongest[1].percentile, 
        level: strongest[1].level,
        description: getPercentileDescription(strongest[1].percentile)
      },
      adventure: { 
        area: adventureArea, 
        percentile: adventure[1].percentile, 
        level: adventure[1].level 
      }
    };
  };

  const renderCharacterSection = () => (
    <View style={styles.characterCard}>
      <View style={styles.characterContainer}>
        <Text style={styles.characterEmoji}>
          {characterEmojis[childData.selectedCharacter]}
          {characterAccessories[childData.characterLevel]}
        </Text>
        <Text style={styles.characterLevel}>
          Level {childData.characterLevel}
        </Text>
      </View>
      <View style={styles.pointsContainer}>
        <Ionicons name="star" size={20} color="#9957B3" />
        <Text style={styles.pointsText}>
          {childData.totalPoints.toLocaleString()} Points
        </Text>
      </View>
    </View>
  );

  // Prepare chart data for Chart.js radar chart
  const prepareChartData = () => {
    const labels = skillAreas.map(area => area.name);
    const currentData = skillAreas.map(area => childData.skills[area.key]?.level || 1);
    
    const datasets = [{
      label: 'Current Level',
      data: currentData,
      fill: true,
      backgroundColor: 'rgba(247, 148, 31, 0.2)',
      borderColor: '#F7941F',
      pointBackgroundColor: '#F7941F',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#F7941F',
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }];

    // Add historical data if toggled on
    if (showHistoricalData && childData.skillsHistory) {
      const colors = ['rgba(153, 87, 179, 0.2)', 'rgba(3, 64, 164, 0.2)', 'rgba(16, 185, 129, 0.2)'];
      const borderColors = ['#9957B3', '#0340A4', '#10b981'];
      
      // Show up to 3 historical data points
      childData.skillsHistory.slice(-3).forEach((historyPoint, index) => {
        const historicalData = skillAreas.map(area => historyPoint.skills[area.key] || 1);
        datasets.push({
          label: new Date(historyPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          data: historicalData,
          fill: true,
          backgroundColor: colors[index] || colors[0],
          borderColor: borderColors[index] || borderColors[0],
          pointBackgroundColor: borderColors[index] || borderColors[0],
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: borderColors[index] || borderColors[0],
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        });
      });
    }

    return { labels, datasets };
  };

  // Chart options with relative scaling
  const getChartOptions = () => {
    const allLevels = [];
    
    // Collect all current levels
    skillAreas.forEach(area => {
      allLevels.push(childData.skills[area.key]?.level || 1);
    });
    
    // If showing historical data, include those levels too
    if (showHistoricalData && childData.skillsHistory) {
      childData.skillsHistory.forEach(historyPoint => {
        skillAreas.forEach(area => {
          allLevels.push(historyPoint.skills[area.key] || 1);
        });
      });
    }
    
    const minLevel = Math.min(...allLevels);
    const maxLevel = Math.max(...allLevels);
    
    // Create relative scale - expand range slightly for better visualization
    const range = maxLevel - minLevel;
    const suggestedMin = Math.max(1, minLevel - Math.ceil(range * 0.1));
    const suggestedMax = Math.min(10, maxLevel + Math.ceil(range * 0.1));

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: 'BalsamiqSans_400Regular',
              size: 12,
            },
            color: '#666',
            padding: 15,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#F7941F',
          borderWidth: 1,
        },
      },
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
          },
          pointLabels: {
            font: {
              family: 'BalsamiqSans_400Regular',
              size: 11,
              weight: '600',
            },
            color: '#333',
            padding: 10,
          },
          ticks: {
            display: true,
            font: {
              family: 'BalsamiqSans_400Regular',
              size: 10,
            },
            color: '#999',
            backdropColor: 'rgba(255, 255, 255, 0.8)',
            backdropPadding: 2,
          },
          suggestedMin: suggestedMin,
          suggestedMax: suggestedMax,
          beginAtZero: false,
        },
      },
      elements: {
        line: {
          borderWidth: 2,
        },
        point: {
          radius: 4,
          hoverRadius: 6,
        },
      },
    };
  };

  const renderSkillsSection = () => {
    const summary = getSkillSummary();
    const chartData = prepareChartData();
    const chartOptions = getChartOptions();
    
    return (
      <View style={styles.skillsCard}>
        <View style={styles.skillsHeader}>
          <Text style={styles.sectionTitle}>{childData.name}'s Skills</Text>
          <Pressable 
            style={styles.historyButton}
            onPress={() => setShowHistoricalData(!showHistoricalData)}
          >
            <Ionicons 
              name={showHistoricalData ? "bar-chart" : "trending-up"} 
              size={20} 
              color="#F7941F" 
            />
            <Text style={styles.historyButtonText}>
              {showHistoricalData ? "Current" : "Progress"}
            </Text>
          </Pressable>
        </View>

        {/* Chart.js Radar Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartNote}>
            📊 Skills Overview - {showHistoricalData ? 'Progress Over Time' : 'Current Levels'}
          </Text>
          
          <View style={styles.radarChartContainer}>
            <Radar data={chartData} options={chartOptions} />
          </View>
          
          {/* Skill Levels Display */}
          <View style={styles.skillsGrid}>
            {skillAreas.map((area, index) => {
              const currentSkill = childData.skills[area.key];
              const level = currentSkill ? currentSkill.level : 1;
              
              return (
                <View key={area.key} style={styles.skillItem}>
                  <View style={[styles.skillDot, { backgroundColor: area.color }]} />
                  <Text style={styles.skillName}>{area.name}</Text>
                  <Text style={styles.skillLevel}>Level {level}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Skills Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
              <Text style={styles.summaryTitle}>Biggest Strength</Text>
            </View>
            <Text style={styles.summarySkill}>{summary.strongest.area.name}</Text>
            <Text style={styles.summaryDetails}>
              Level {summary.strongest.level} • {summary.strongest.description}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <View style={styles.summaryHeader}>
              <Ionicons name="rocket" size={20} color="#F7941F" />
              <Text style={styles.summaryTitle}>Next Adventure</Text>
            </View>
            <Text style={styles.summarySkill}>{summary.adventure.area.name}</Text>
            <Text style={styles.summaryDetails}>
              Level {summary.adventure.level} • Great potential to grow!
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStreakSection = () => (
    <View style={styles.streakCard}>
      <Text style={styles.sectionTitle}>Practice Streak</Text>
      <View style={styles.streakHeader}>
        <Ionicons name="flame" size={32} color="#FF6B35" style={styles.streakIcon} />
        <Text style={styles.streakNumber}>{childData.currentStreak}</Text>
        <Text style={styles.streakText}>days in a row!</Text>
      </View>
      <View style={styles.weeklyGrid}>
        {childData.weeklyProgress.map((day, index) => (
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
      {childData.recentAchievements.map((achievement) => (
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
        {childData.name} has reached Level {childData.characterLevel}!{'\n\n'}
        Friends{' '}
        <Text style={styles.friendsNames}>
          {childData.friendsAtLevel.join(', ')}
        </Text>
        {' '}are also at this level.{'\n\n'}
        Keep practicing to reach Level {childData.characterLevel + 1} together! 🚀
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>{childData.name}'s Progress</Text>
          <Text style={styles.subtitle}>Age {childData.age} • {childData.selectedCharacter} companion</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderCharacterSection()}
        {renderSkillsSection()}
        {renderStreakSection()}
        {renderAchievementsSection()}
        {renderFriendsSection()}
      </ScrollView>
    </View>
  );
}
