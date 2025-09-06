import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Target, Calendar, Star, Coins } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface SetQuestModalProps {
  visible: boolean;
  onClose: () => void;
  onSetQuest: (quest: QuestData) => void;
}

interface QuestData {
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  difficulty: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
}

const RPG_QUEST_CATEGORIES = [
  { id: 'emergency_fund', name: 'EMERGENCY FUND', icon: '🛡️', description: 'Safety Net' },
  { id: 'house_purchase', name: 'CASTLE ACQUISITION', icon: '🏰', description: 'Home Ownership' },
  { id: 'retirement', name: 'RETIREMENT QUEST', icon: '👑', description: 'Future Security' },
  { id: 'education', name: 'KNOWLEDGE PURSUIT', icon: '📚', description: 'Skill Enhancement' },
  { id: 'vacation', name: 'ADVENTURE TRIP', icon: '🗺️', description: 'Travel Goals' },
  { id: 'investment', name: 'WEALTH BUILDING', icon: '💎', description: 'Portfolio Growth' },
  { id: 'business', name: 'GUILD CREATION', icon: '🏪', description: 'Business Venture' },
  { id: 'debt_freedom', name: 'DEBT SLAYING', icon: '⚔️', description: 'Debt Elimination' },
];

const DIFFICULTY_LEVELS = [
  { id: 'Common', name: 'COMMON', color: '#10B981', description: 'Easy to achieve' },
  { id: 'Rare', name: 'RARE', color: '#3B82F6', description: 'Moderate challenge' },
  { id: 'Epic', name: 'EPIC', color: '#7C3AED', description: 'Significant effort' },
  { id: 'Legendary', name: 'LEGENDARY', color: '#F59E0B', description: 'Ultimate goal' },
];

export function SetQuestModal({ visible, onClose, onSetQuest }: SetQuestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Common' | 'Rare' | 'Epic' | 'Legendary'>('Common');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetAmount('');
    setCurrentAmount('0');
    setSelectedCategory('');
    setSelectedDifficulty('Common');
    setDeadline('');
    setPriority('Medium');
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a quest title.');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a quest category.');
      return;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      Alert.alert('Invalid Target', 'Please enter a valid target amount.');
      return;
    }

    if (!deadline.trim()) {
      Alert.alert('Missing Deadline', 'Please enter a target completion date.');
      return;
    }

    const questData: QuestData = {
      title: title.trim(),
      description: description.trim() || `${selectedCategory} quest`,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      deadline: deadline.trim(),
      priority,
    };

    onSetQuest(questData);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#f5f5f5', '#e8e8e8']}
          style={styles.backgroundGradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>CREATE NEW QUEST</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#ffffff" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Quest Title */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QUEST TITLE</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Name your quest..."
                  placeholderTextColor="#999999"
                  maxLength={50}
                />
              </View>
            </View>

            {/* Quest Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QUEST TYPE</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.categoryGrid}>
                {RPG_QUEST_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.categoryTextActive,
                    ]}>
                      {category.name}
                    </Text>
                    <Text style={[
                      styles.categoryDescription,
                      selectedCategory === category.id && styles.categoryDescriptionActive,
                    ]}>
                      {category.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Target Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TARGET GOLD</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>🪙</Text>
                <TextInput
                  style={styles.amountInput}
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  placeholder="0.00"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Current Progress */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CURRENT PROGRESS</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>🪙</Text>
                <TextInput
                  style={styles.amountInput}
                  value={currentAmount}
                  onChangeText={setCurrentAmount}
                  placeholder="0.00"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Difficulty Level */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DIFFICULTY LEVEL</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.difficultyGrid}>
                {DIFFICULTY_LEVELS.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty.id}
                    style={[
                      styles.difficultyButton,
                      { borderColor: difficulty.color },
                      selectedDifficulty === difficulty.id && { backgroundColor: difficulty.color },
                    ]}
                    onPress={() => setSelectedDifficulty(difficulty.id as any)}
                  >
                    <Star 
                      size={16} 
                      color={selectedDifficulty === difficulty.id ? '#ffffff' : difficulty.color} 
                      strokeWidth={3} 
                    />
                    <Text style={[
                      styles.difficultyText,
                      { color: selectedDifficulty === difficulty.id ? '#ffffff' : difficulty.color },
                    ]}>
                      {difficulty.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Deadline */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TARGET DATE</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#666666" strokeWidth={2} />
                <TextInput
                  style={styles.textInput}
                  value={deadline}
                  onChangeText={setDeadline}
                  placeholder="e.g., December 2024"
                  placeholderTextColor="#999999"
                  maxLength={30}
                />
              </View>
            </View>

            {/* Priority */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PRIORITY LEVEL</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.prioritySelector}>
                {['Low', 'Medium', 'High'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.priorityButton,
                      priority === level && styles.priorityButtonActive,
                    ]}
                    onPress={() => setPriority(level as any)}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      priority === level && styles.priorityButtonTextActive,
                    ]}>
                      {level.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QUEST DESCRIPTION (OPTIONAL)</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your quest..."
                  placeholderTextColor="#999999"
                  maxLength={150}
                  multiline
                />
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitSection}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Target size={20} color="#ffffff" strokeWidth={3} />
                <Text style={styles.submitButtonText}>CREATE QUEST</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#666666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  closeButton: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  dividerImage: {
    width: '40%',
    height: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
  },
  currencySymbol: {
    fontSize: 20,
  },
  amountInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#000000',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    marginBottom: 4,
  },
  categoryTextActive: {
    color: '#ffffff',
    textShadowColor: '#333333',
  },
  categoryDescription: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 1,
  },
  categoryDescriptionActive: {
    color: '#cccccc',
  },
  difficultyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  difficultyButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 8,
    gap: 8,
  },
  difficultyText: {
    fontSize: 9,
    fontFamily: 'Minecraftia',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#000000',
  },
  priorityButtonText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  priorityButtonTextActive: {
    color: '#ffffff',
    textShadowColor: '#333333',
  },
  submitSection: {
    marginBottom: 40,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 18,
    gap: 10,
  },
  submitButtonText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
