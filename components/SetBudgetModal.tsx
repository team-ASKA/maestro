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
import { X, Shield, Target, Calendar } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface SetBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onSetBudget: (budget: BudgetData) => void;
}

interface BudgetData {
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  description: string;
}

const RPG_BUDGET_CATEGORIES = [
  { id: 'equipment_upgrade', name: 'EQUIPMENT UPGRADE', icon: '⚔️', description: 'Weapons & Armor' },
  { id: 'tavern_expense', name: 'TAVERN EXPENSE', icon: '🍺', description: 'Food & Drinks' },
  { id: 'travel_cost', name: 'TRAVEL COST', icon: '🐎', description: 'Transportation' },
  { id: 'potion_purchase', name: 'POTION PURCHASE', icon: '🧪', description: 'Health & Mana' },
  { id: 'guild_fee', name: 'GUILD FEE', icon: '🏛️', description: 'Memberships' },
  { id: 'spell_scroll', name: 'SPELL SCROLL', icon: '📜', description: 'Knowledge & Skills' },
  { id: 'repair_cost', name: 'REPAIR COST', icon: '🔨', description: 'Maintenance' },
  { id: 'training_fee', name: 'TRAINING FEE', icon: '🎯', description: 'Skill Development' },
];

export function SetBudgetModal({ visible, onClose, onSetBudget }: SetBudgetModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setSelectedCategory('');
    setAmount('');
    setSelectedPeriod('monthly');
    setDescription('');
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a quest category for your budget.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid gold amount.');
      return;
    }

    const budgetData: BudgetData = {
      category: selectedCategory,
      amount: parseFloat(amount),
      period: selectedPeriod,
      description: description.trim() || `${selectedPeriod} budget for ${selectedCategory}`,
    };

    onSetBudget(budgetData);
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
              <Text style={styles.headerTitle}>SET QUEST BUDGET</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#ffffff" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Budget Period */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BUDGET PERIOD</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.periodSelector}>
                {['weekly', 'monthly', 'yearly'].map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.periodButton,
                      selectedPeriod === period && styles.periodButtonActive,
                    ]}
                    onPress={() => setSelectedPeriod(period as 'weekly' | 'monthly' | 'yearly')}
                  >
                    <Calendar 
                      size={18} 
                      color={selectedPeriod === period ? '#ffffff' : '#7C3AED'} 
                      strokeWidth={3} 
                    />
                    <Text style={[
                      styles.periodButtonText,
                      selectedPeriod === period && styles.periodButtonTextActive,
                    ]}>
                      {period.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QUEST CATEGORY</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.categoryGrid}>
                {RPG_BUDGET_CATEGORIES.map((category) => (
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

            {/* Budget Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>GOLD LIMIT</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>🪙</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                />
                <Text style={styles.periodLabel}>per {selectedPeriod.slice(0, -2)}</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BUDGET NOTES (OPTIONAL)</Text>
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
                  placeholder="Add notes about this budget..."
                  placeholderTextColor="#999999"
                  maxLength={100}
                />
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitSection}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Target size={20} color="#ffffff" strokeWidth={3} />
                <Text style={styles.submitButtonText}>SET BUDGET LIMIT</Text>
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
  periodSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    gap: 8,
  },
  periodButtonActive: {
    backgroundColor: '#000000',
  },
  periodButtonText: {
    fontSize: 9,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  periodButtonTextActive: {
    color: '#ffffff',
    textShadowColor: '#333333',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
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
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
  },
  periodLabel: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
    marginLeft: 10,
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
