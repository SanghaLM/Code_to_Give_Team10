import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../userContext';
import * as api from '../api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '10%',
    backgroundColor: '#FFF4E7',
    paddingHorizontal: '5%',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    color: '#000',
    marginBottom: 20,
    textAlign: 'left',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
    marginBottom: 20,
    gap: '3%',
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'left',
    backgroundColor: '#fff',
    borderRadius: 40,
    minWidth: 'auto',
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 10,
  },
  activeTab: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  activeTabText: {
    color: '#fff',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  inactiveTabText: {
    color: '#000',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  bookletContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#c7c7c7ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  bookletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookletNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bookletNumberText: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  bookletInfo: {
    flex: 1,
  },
  bookletTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 0,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  bookletStatus: {
    fontSize: 14,
    color: '#ef4444', // Red color for status
    fontFamily: 'BalsamiqSans_400Regular',
  },
  chevron: {
    marginLeft: 8,
  },
  moduleContainer: {
    marginTop: '2%',
    paddingLeft: '5',
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  moduleLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkmark: {
    marginRight: '2%',
  },
  moduleText: {
    fontSize: 16,
    marginLeft: 4,
    marginRight: 8,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  moduleTextCompleted: {
    color: '#000',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  moduleTextIncomplete: {
    color: '#3b82f6', // Blue for incomplete
    fontFamily: 'BalsamiqSans_400Regular',
  },
  moduleRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  pointsText: {
    fontSize: 14,
    color: '#8b5cf6', // Purple for points
    marginBottom: 4,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  submitButton: {
    backgroundColor: '#CF0E11',
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  dueDate: {
    color: '#CF0E11',
    fontSize: 13,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 13,
    color: '#BEBEBE',
    fontFamily: 'BalsamiqSans_400Regular',
  },
  pointsValue: {
    fontSize: 13,
    color: '#9957B3',
    fontFamily: 'BalsamiqSans_400Regular',
  },
});

export default function TaskScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [expandedBooklets, setExpandedBooklets] = useState([1]); // Booklet 2 is expanded by default
  const { token, selectedChildId, childrenList, setSelectedChildId } = useUser();
  const [booklets, setBooklets] = useState(null);

  useEffect(() => {
    // Fetch assigned homeworks for selected child
    async function loadHomeworks() {
      if (!selectedChildId || !token) return;
      try {
        const hw = await api.getChildrenHomeworks(selectedChildId, token);
        // Map backend homework assignments to booklet-like structure
        const mapped = (hw || []).map((h, idx) => ({
          id: idx + 1,
          homeworkId: h._id,
          title: h.title,
          status: '0/4 Modules Finished',
          color1: '#E4EDF5',
          color2: '#0340A4',
          modules: (h.words || []).map((w) => ({ name: w.word, completed: false, dueDate: h.dueDate ? new Date(h.dueDate).toDateString() : '-' })),
        }));
        setBooklets(mapped);
      } catch (err) {
        console.warn('Failed to load homeworks', err);
      }
    }
    loadHomeworks();
  }, [selectedChildId, token]);

  const toggleBooklet = (bookletId) => {
    setExpandedBooklets(prev => 
      prev.includes(bookletId) 
        ? prev.filter(id => id !== bookletId)
        : [...prev, bookletId]
    );
  };

  // Use fetched booklets if available, otherwise fallback to static booklets
  const displayBooklets = booklets || [
    {
      id: 1,
      title: 'Booklet 1',
      status: '4/4 Modules Finished',
      color1: '#FFF0EA',
      color2: '#D54F2D',
      modules: [
        { name: 'Module 1: Colors', completed: true, points: '18/20' },
        { name: 'Module 2: Numbers', completed: true, points: '18/20' },
        { name: 'Module 3: Family', completed: true, points: '18/20' },
        { name: 'Module 4: Feelings', completed: true, points: '18/20' },
      ]
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Homework</Text>
      {/* Child selector for parents */}
      {childrenList && childrenList.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 6 }}>Selected child:</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {childrenList.map((c) => {
              const id = c._id || c.id;
              const selected = selectedChildId === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => setSelectedChildId(id)}
                  style={{ padding: 8, borderRadius: 8, backgroundColor: selected ? '#000' : '#fff' }}
                >
                  <Text style={{ color: selected ? '#fff' : '#000' }}>{c.firstName} {c.lastName}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
      
      <View style={styles.tabContainer}>
        {['All', 'Upcoming', 'Past'].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab ? styles.activeTabText : styles.inactiveTabText
            ]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

  {displayBooklets.map((booklet) => {
        const isExpanded = expandedBooklets.includes(booklet.id);
        return (
          <View
            key={booklet.id}
            style={[
              styles.bookletContainer,
              isExpanded,
            ]}
          >
            <Pressable
              style={styles.bookletHeader}
              onPress={() => toggleBooklet(booklet.id)}
            >
              <View
                style={[
                  styles.bookletNumber,
                  { backgroundColor: booklet.color1, aspectRatio: 1, borderRadius: 999 }
                ]}
              >
                <Text style={[styles.bookletNumberText, { color: booklet.color2 || '#000' }]}>
                  {booklet.id}
                </Text>
              </View>
              <View style={styles.bookletInfo}>
                <Text style={styles.bookletTitle}>{booklet.title}</Text>
                <Text style={[styles.bookletStatus, { color: booklet.color2 || '#000' }]}>{booklet.status}</Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#000"
                style={styles.chevron}
              />
            </Pressable>
            {isExpanded && (
              <View style={styles.moduleContainer}>
                {booklet.modules.map((module, index) => (
                  <View key={index} style={styles.moduleItem}>
                    <View style={styles.moduleLeftRow}>
                      {module.completed ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#10b981"
                          style={styles.checkmark}
                        />
                      ) : null}
                      <Text
                        style={[
                          styles.moduleText,
                          {
                            color: module.completed ? '#737373' : (booklet.color2 || '#000'),
                          },
                        ]}
                      >
                        {module.name}
                      </Text>
                      {!module.completed && (
                        <Pressable
                          style={styles.submitButton}
                          onPress={() => {
                            // Navigate to homework flow. If homeworkId exists, pass it.
                            if (booklet.homeworkId) router.push(`/tabs/homework/instructions?homeworkId=${booklet.homeworkId}`);
                            else router.push('/tabs/homework/hw-1');
                          }}
                        >
                          <Text style={styles.submitButtonText}>Submit</Text>
                        </Pressable>
                      )}
                    </View>
                    <View style={styles.moduleRight}>
                      {module.completed ? (
                        <View style={styles.pointsContainer}>
                          <Text style={styles.pointsLabel}>Points </Text>
                          <Text style={styles.pointsValue}>{module.points}</Text>
                        </View>
                      ) : (
                        <Text style={styles.dueDate}>Due {module.dueDate}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}