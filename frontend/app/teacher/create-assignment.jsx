import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CreateAssignmentScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // 1: Create/Select Booklet, 2: Assign to Classes
  const [assignmentName, setAssignmentName] = useState('');
  const [selectedBooklet, setSelectedBooklet] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');

  // Mock data
  const availableBooklets = [
    { id: 1, name: 'Week 1 - Basic Vocabulary', exercises: 4, created: '2024-01-15' },
    { id: 2, name: 'Animals & Nature', exercises: 4, created: '2024-01-14' },
    { id: 3, name: 'Family & Friends', exercises: 3, created: '2024-01-13' },
    { id: 4, name: 'Food & Drinks', exercises: 4, created: '2024-01-12' },
  ];

  const availableClasses = [
    { id: 1, name: 'Class A - Morning', students: 15, teacher: 'Ms. Johnson' },
    { id: 2, name: 'Class B - Afternoon', students: 12, teacher: 'Mr. Smith' },
    { id: 3, name: 'Class C - Evening', students: 18, teacher: 'Ms. Davis' },
  ];

  const toggleClassSelection = (classItem) => {
    if (selectedClasses.find(c => c.id === classItem.id)) {
      setSelectedClasses(selectedClasses.filter(c => c.id !== classItem.id));
    } else {
      setSelectedClasses([...selectedClasses, classItem]);
    }
  };

  const createAssignment = () => {
    if (!assignmentName.trim()) {
      Alert.alert('Error', 'Please enter an assignment name');
      return;
    }
    
    if (!selectedBooklet) {
      Alert.alert('Error', 'Please select a booklet');
      return;
    }
    
    if (selectedClasses.length === 0) {
      Alert.alert('Error', 'Please select at least one class');
      return;
    }
    
    if (!dueDate.trim()) {
      Alert.alert('Error', 'Please set a due date');
      return;
    }

    // TODO: Save assignment to backend
    Alert.alert(
      'Assignment Created!', 
      `"${assignmentName}" has been assigned to ${selectedClasses.length} class(es)`,
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, currentStep >= 1 && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep >= 1 && styles.activeStepText]}>1</Text>
        </View>
        <Text style={styles.stepLabel}>Select Booklet</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, currentStep >= 2 && styles.activeStep]}>
          <Text style={[styles.stepNumber, currentStep >= 2 && styles.activeStepText]}>2</Text>
        </View>
        <Text style={styles.stepLabel}>Assign to Classes</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Create Assignment</Text>
          <Text style={styles.subtitle}>Create booklets and assign to classes</Text>
        </View>
      </View>

      {renderStepIndicator()}

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 ? (
          <>
            {/* Booklet Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📚 Select or Create Booklet</Text>
                <Pressable 
                  style={styles.createNewButton}
                  onPress={() => Alert.alert('Create New Booklet', 'This would open the booklet creation interface')}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.createNewButtonText}>New Booklet</Text>
                </Pressable>
              </View>
              <Text style={styles.sectionNote}>
                Choose an existing booklet or create a new one
              </Text>

              {availableBooklets.map((booklet) => {
                const isSelected = selectedBooklet?.id === booklet.id;
                return (
                  <Pressable
                    key={booklet.id}
                    style={[styles.bookletCard, isSelected && styles.selectedBookletCard]}
                    onPress={() => setSelectedBooklet(booklet)}
                  >
                    <View style={styles.bookletInfo}>
                      <Text style={[styles.bookletName, isSelected && styles.selectedBookletName]}>
                        {booklet.name}
                      </Text>
                      <Text style={styles.bookletDetails}>
                        {booklet.exercises} exercises • Created {booklet.created}
                      </Text>
                    </View>
                    <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {selectedBooklet && (
              <Pressable 
                style={styles.nextStepButton} 
                onPress={() => setCurrentStep(2)}
              >
                <Text style={styles.nextStepButtonText}>Next: Assign to Classes</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </Pressable>
            )}
          </>
        ) : (
          <>
            {/* Assignment Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Assignment Details</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Assignment Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Week 1 Homework - Basic Vocabulary"
                  value={assignmentName}
                  onChangeText={setAssignmentName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Instructions (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  placeholder="Additional instructions for students..."
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Due Date</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="YYYY-MM-DD (e.g., 2024-02-15)"
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Selected Booklet Display */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📚 Selected Booklet</Text>
              <View style={styles.selectedBookletDisplay}>
                <Text style={styles.selectedBookletName}>{selectedBooklet.name}</Text>
                <Text style={styles.selectedBookletDetails}>
                  {selectedBooklet.exercises} exercises • Created {selectedBooklet.created}
                </Text>
                <Pressable 
                  style={styles.changeBookletButton}
                  onPress={() => setCurrentStep(1)}
                >
                  <Text style={styles.changeBookletButtonText}>Change Booklet</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Class Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🎓 Select Classes ({selectedClasses.length})
              </Text>
              <Text style={styles.sectionNote}>
                Choose which classes to assign this homework to
              </Text>

              {availableClasses.map((classItem) => {
                const isSelected = selectedClasses.find(c => c.id === classItem.id);
                return (
                  <Pressable
                    key={classItem.id}
                    style={[styles.classCard, isSelected && styles.selectedClassCard]}
                    onPress={() => toggleClassSelection(classItem)}
                  >
                    <View style={styles.classInfo}>
                      <Text style={[styles.className, isSelected && styles.selectedClassName]}>
                        {classItem.name}
                      </Text>
                      <Text style={styles.classDetails}>
                        {classItem.students} students • {classItem.teacher}
                      </Text>
                    </View>
                    <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* Assignment Summary */}
        {selectedBooklet && selectedClasses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Assignment Summary</Text>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Booklet:</Text>
              <Text style={styles.summaryValue}>{selectedBooklet.name}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Classes:</Text>
              <Text style={styles.summaryValue}>
                {selectedClasses.map(c => c.name).join(', ')}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Students:</Text>
              <Text style={styles.summaryValue}>
                {selectedClasses.reduce((sum, c) => sum + c.students, 0)} students
              </Text>
            </View>
            
            {dueDate && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Due Date:</Text>
                <Text style={styles.summaryValue}>{dueDate}</Text>
              </View>
            )}
          </View>
        )}

        {currentStep === 2 && (
          <Pressable style={styles.createButton} onPress={createAssignment}>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Assignment</Text>
          </Pressable>
        )}
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
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: '5%',
  },
  
  // Sections
  section: {
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
    fontSize: 18,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionNote: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginBottom: 15,
  },

  // Input Fields
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    backgroundColor: '#f8f9fa',
  },
  multilineInput: {
    minHeight: 80,
  },

  // Booklet Cards
  bookletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedBookletCard: {
    borderColor: '#F7941F',
    backgroundColor: '#FFF4E7',
  },
  bookletInfo: {
    flex: 1,
  },
  bookletName: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedBookletName: {
    color: '#F7941F',
  },
  bookletDetails: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
  },

  // Class Cards
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedClassCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedClassName: {
    color: '#10b981',
  },
  classDetails: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
  },

  // Selection Indicators
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#F7941F',
    borderColor: '#F7941F',
  },

  // Assignment Summary
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    fontWeight: '600',
    minWidth: 100,
  },
  summaryValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#000',
  },

  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    marginBottom: 20,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: '#F7941F',
  },
  stepNumber: {
    fontSize: 16,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    fontWeight: 'bold',
  },
  activeStepText: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    textAlign: 'center',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Create New Button
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  createNewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    fontWeight: '600',
  },

  // Next Step Button
  nextStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7941F',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  nextStepButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BalsamiqSans_400Regular',
    fontWeight: 'bold',
  },

  // Selected Booklet Display
  selectedBookletDisplay: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F7941F',
  },
  selectedBookletName: {
    fontSize: 18,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#F7941F',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedBookletDetails: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    marginBottom: 12,
  },
  changeBookletButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeBookletButtonText: {
    fontSize: 14,
    fontFamily: 'BalsamiqSans_400Regular',
    color: '#666',
    fontWeight: '600',
  },

  // Create Button
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7941F',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    gap: 8,
    shadowColor: '#F7941F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BalsamiqSans_400Regular',
    fontWeight: 'bold',
  },
});
