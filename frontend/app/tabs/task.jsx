<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
=======
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9
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
    fontFamily: 'BalsamiqSans_700Bold',
    fontSize: 16,
  },
  bookletInfo: {
    flex: 1,
  },
  bookletTitle: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
    marginBottom: 0,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    marginBottom: 13,
    fontFamily: 'BalsamiqSans_400Regular',
  },
  moduleHighlight: {
    color: '#F7941F',
    fontFamily: 'BalsamiqSans_700Bold',
  },
  optionContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 17,
    paddingRight: 15,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 12,
  },
  inGameButton: {
    backgroundColor: '#007AFF',
  },
  manualButton: {
    backgroundColor: '#10b981',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontFamily: 'BalsamiqSans_700Bold',
    color: '#fff',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'BalsamiqSans_400Regular',
  },
});

export default function TaskScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [expandedBooklets, setExpandedBooklets] = useState([1]); // Booklet 2 is expanded by default
<<<<<<< HEAD
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
=======
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9

  const toggleBooklet = (bookletId) => {
    setExpandedBooklets(prev => 
      prev.includes(bookletId) 
        ? prev.filter(id => id !== bookletId)
        : [...prev, bookletId]
    );
  };

<<<<<<< HEAD
  // Use fetched booklets if available, otherwise fallback to static booklets
  const displayBooklets = booklets || [
=======
  const handleSubmitPress = () => {
    setShowSubmissionModal(true);
  };

  const handleInGameExercise = () => {
    setShowSubmissionModal(false);
    router.push('/tabs/homework/instructions');
  };

  const handleManualSubmission = () => {
    setShowSubmissionModal(false);
    router.push('/tabs/homework/manual');
  };

  const booklets = [
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9
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
<<<<<<< HEAD
                          onPress={() => {
                            // Navigate to homework flow. If homeworkId exists, pass it.
                            if (booklet.homeworkId) router.push(`/tabs/homework/instructions?homeworkId=${booklet.homeworkId}`);
                            else router.push('/tabs/homework/hw-1');
                          }}
=======
                          onPress={handleSubmitPress}
>>>>>>> 67f4064f4fc5ef39eb8f026a665b45f8c6a7eae9
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
      
      {/* Homework Submission Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSubmissionModal}
        onRequestClose={() => setShowSubmissionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Submission Method</Text>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowSubmissionModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>
            
            <Text style={styles.modalDescription}>
              How would you like to complete {' '} 
              <Text style={styles.moduleHighlight}>Booklet 2, Module 4 - Fruits</Text> exercise?
            </Text>
            
            <View style={styles.optionContainer}>
                             <Pressable 
                 style={[styles.optionButton, styles.inGameButton]}
                 onPress={handleInGameExercise}
               >
                 <View style={styles.optionIcon}>
                   <Ionicons name="game-controller" size={32} color="#fff" />
                 </View>
                 <View style={styles.optionContent}>
                   <Text style={styles.optionTitle}>In-Game Exercise</Text>
                   <Text style={styles.optionSubtitle}>
                     Complete interactive exercises with guided instructions
                   </Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color="#fff" />
               </Pressable>
              
                             <Pressable 
                 style={[styles.optionButton, styles.manualButton]}
                 onPress={handleManualSubmission}
               >
                 <View style={styles.optionIcon}>
                   <Ionicons name="document-text" size={32} color="#fff" />
                 </View>
                 <View style={styles.optionContent}>
                   <Text style={styles.optionTitle}>Submit Manually</Text>
                   <Text style={styles.optionSubtitle}>
                     Upload your completed work or write your answers
                   </Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color="#fff" />
               </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}