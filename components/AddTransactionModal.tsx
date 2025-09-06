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
import { X, Coins, Sword, Shield, Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: TransactionData) => void;
}

interface TransactionData {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: Date;
}

const RPG_CATEGORIES = {
  income: [
    { id: 'quest_reward', name: 'QUEST REWARD', icon: '⚔️' },
    { id: 'treasure_found', name: 'TREASURE FOUND', icon: '💰' },
    { id: 'trade_profit', name: 'TRADE PROFIT', icon: '🏪' },
    { id: 'guild_payment', name: 'GUILD PAYMENT', icon: '🏛️' },
    { id: 'bounty_reward', name: 'BOUNTY REWARD', icon: '🎯' },
    { id: 'artifact_sale', name: 'ARTIFACT SALE', icon: '🏺' },
  ],
  expense: [
    { id: 'equipment_upgrade', name: 'EQUIPMENT UPGRADE', icon: '⚔️' },
    { id: 'potion_purchase', name: 'POTION PURCHASE', icon: '🧪' },
    { id: 'tavern_expense', name: 'TAVERN EXPENSE', icon: '🍺' },
    { id: 'travel_cost', name: 'TRAVEL COST', icon: '🐎' },
    { id: 'guild_fee', name: 'GUILD FEE', icon: '🏛️' },
    { id: 'spell_scroll', name: 'SPELL SCROLL', icon: '📜' },
    { id: 'repair_cost', name: 'REPAIR COST', icon: '🔨' },
    { id: 'training_fee', name: 'TRAINING FEE', icon: '🎯' },
  ],
};

export function AddTransactionModal({ visible, onClose, onAddTransaction }: AddTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const resetForm = () => {
    setTransactionType('expense');
    setDescription('');
    setAmount('');
    setSelectedCategory('');
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description for your quest entry.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid gold amount.');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a quest category.');
      return;
    }

    const transactionData: TransactionData = {
      type: transactionType,
      description: description.trim(),
      amount: parseFloat(amount),
      category: selectedCategory,
      date: new Date(),
    };

    onAddTransaction(transactionData);
    resetForm();
    onClose();
  };

  const currentCategories = RPG_CATEGORIES[transactionType];

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
              <Text style={styles.headerTitle}>NEW QUEST ENTRY</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#000000" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Quest Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QUEST TYPE</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'income' && styles.typeButtonActive,
                  ]}
                  onPress={() => {
                    setTransactionType('income');
                    setSelectedCategory('');
                  }}
                >
                  <Coins 
                    size={24} 
                    color={transactionType === 'income' ? '#ffffff' : '#10B981'} 
                    strokeWidth={3} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    transactionType === 'income' && styles.typeButtonTextActive,
                  ]}>
                    GOLD GAINED
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'expense' && styles.typeButtonActive,
                  ]}
                  onPress={() => {
                    setTransactionType('expense');
                    setSelectedCategory('');
                  }}
                >
                  <Sword 
                    size={24} 
                    color={transactionType === 'expense' ? '#ffffff' : '#DC2626'} 
                    strokeWidth={3} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    transactionType === 'expense' && styles.typeButtonTextActive,
                  ]}>
                    GOLD SPENT
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>QUEST DESCRIPTION</Text>
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
                  placeholder="Describe your adventure..."
                  placeholderTextColor="#999999"
                  maxLength={100}
                />
              </View>
            </View>

            {/* Amount */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>GOLD AMOUNT</Text>
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
                {currentCategories.map((category) => (
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
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitSection}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#000000', '#333333']}
                  style={styles.submitButtonGradient}
                >
                  <Shield size={20} color="#ffffff" strokeWidth={3} />
                  <Text style={styles.submitButtonText}>ADD TO LEDGER</Text>
                </LinearGradient>
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
    borderWidth: 2,
    borderColor: '#333333',
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
  typeSelector: {
    flexDirection: 'row',
    gap: 15,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 12,
    gap: 10,
  },
  typeButtonActive: {
    backgroundColor: '#000000',
  },
  typeButtonText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  typeButtonTextActive: {
    color: '#ffffff',
    textShadowColor: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 12,
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
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 12,
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
  },
  categoryTextActive: {
    color: '#ffffff',
    textShadowColor: '#333333',
  },
  submitSection: {
    marginBottom: 40,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#000000',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
