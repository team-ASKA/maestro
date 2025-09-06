import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { Lock, Target, Flame, Crown, Star } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { useAppContext } from '@/lib/AppContext';

const { width, height } = Dimensions.get('window');

// Color constants - emerald green for completed, black/white for untouched
const COLORS = {
  emeraldGreen: '#10B981',
  darkEmerald: '#059669',
  crimsonRed: '#DC2626',
  black: '#000000',
  white: '#FFFFFF',
  grey: '#666666',
  lightGrey: '#f5f5f5',
  darkGrey: '#374151',
};

interface Level {
  id: number;
  day: number;
  title: string;
  completed: boolean;
  hasExpenses: boolean;
  expenseAmount: number;
  date: Date;
  streak: number;
}

export default function FinancialJourneyMap() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const { 
    completedDays, 
    dayTransactions, 
    quests, 
    addTransactionToDay, 
    getDayTransactions, 
    getDayTotalExpenses, 
    getCurrentDay 
  } = useAppContext();
  
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentStreak, setCurrentStreak] = useState(1);
  const [showQuestPopup, setShowQuestPopup] = useState(false);

  const currentDay = getCurrentDay(); // Get current day from context
  const totalXP = 1250; // Current XP
  const currentLevel = Math.floor(totalXP / 1000) + 1;

  // Optimized level generation with useMemo to prevent re-renders
  const levels = useMemo(() => {
    const startDate = new Date('2024-09-06'); // Start from today (September 6, 2024)
    const generatedLevels: Level[] = [];
    
    // Generate only necessary levels (current + 10 ahead)
    for (let i = 0; i <= currentDay + 10; i++) {
      const levelDate = new Date(startDate);
      levelDate.setDate(startDate.getDate() + i);
      
      const dayNumber = i + 1;
      const isCompleted = completedDays.has(dayNumber);
      const dayExpenses = getDayTotalExpenses(dayNumber);
      
      generatedLevels.push({
        id: dayNumber,
        day: dayNumber,
        title: `Day ${dayNumber}`,
        completed: isCompleted,
        hasExpenses: isCompleted,
        expenseAmount: dayExpenses,
        date: levelDate,
        streak: isCompleted ? dayNumber : 0,
      });
    }
    // Reverse array so latest days appear at top (upward progression)
    return generatedLevels.reverse();
  }, [currentDay, completedDays, dayTransactions]);

  // Use quests from global context
  const longTermQuests = useMemo(() => quests, [quests]);

  if (!fontsLoaded) {
    return null;
  }

  const handleLevelPress = (level: Level) => {
    if (level.completed) {
      // Show details for completed level with transaction list
      const dayTransactions = getDayTransactions(level.day);
      const transactionList = dayTransactions.map(t => 
        `• ${t.name}: ${t.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(t.amount))}`
      ).join('\n');

      Alert.alert(
        `🎉 Day ${level.day} Completed!`,
        `📅 Date: ${level.date.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: 'short',
          year: 'numeric'
        })}\n\n💰 Total Expenses: ${formatCurrency(level.expenseAmount)}\n\n📋 Transactions (${dayTransactions.length}):\n${transactionList}\n\n✅ Status: Successfully Completed\n🔥 Streak Day: ${level.streak}\n\n🏆 Great job staying on track!`,
        [
          { 
            text: 'Awesome!', 
            style: 'default',
            onPress: () => {}
          }
        ],
        { 
          cancelable: true,
          userInterfaceStyle: 'light'
        }
      );
    } else if (level.day <= currentDay + 1) {
      // Prompt to add expenses for incomplete level
      setSelectedLevel(level);
      setShowAddExpenseModal(true);
    } else {
      // Level is locked with improved messaging
      Alert.alert(
        '🔒 Day Locked',
        `Complete Day ${level.day - 1} first to unlock this milestone.\n\nKeep building your financial tracking streak! 💪`,
        [{ 
          text: 'Got it!', 
          style: 'default' 
        }],
        { 
          cancelable: true,
          userInterfaceStyle: 'light'
        }
      );
    }
  };

  const handleAddExpense = (transactionData: any) => {
    if (selectedLevel) {
      // Create transaction object
      const newTransaction = {
        id: Date.now(),
        name: transactionData.description,
        category: transactionData.category,
        amount: transactionData.type === 'income' ? transactionData.amount : -transactionData.amount,
        type: transactionData.type,
        date: transactionData.date.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: 'short' 
        }),
      };

      // Add transaction to the selected day
      addTransactionToDay(newTransaction, selectedLevel.day);
      
      // Update streak if it's the current day
      if (selectedLevel.day === currentDay + 1) {
        setCurrentStreak(prev => prev + 1);
      }

      Alert.alert(
        '🎉 Day Completed!', 
        `Amazing! Day ${selectedLevel.day} is now complete!\n\n💰 Transaction: ${newTransaction.name} (${formatCurrency(Math.abs(newTransaction.amount))})\n\n🔥 Current Streak: ${currentStreak + 1} days\n\n🚀 Keep up the great work!`,
        [{ 
          text: 'Continue Journey!', 
          style: 'default' 
        }],
        { 
          cancelable: true,
          userInterfaceStyle: 'light'
        }
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Memoized render function for performance
  const renderLevel = useMemo(() => {
    return (level: Level, index: number) => {
      const isUnlocked = level.day <= currentDay + 1;
      const isActive = level.day === currentDay + 1;
      const isCompleted = level.completed;
      const isCurrent = level.day === currentDay;

      const getLevelColors = () => {
        if (isCompleted) return COLORS.emeraldGreen;
        if (isActive) return COLORS.darkGrey;
        if (isUnlocked) return COLORS.grey;
        return COLORS.grey;
      };

      return (
        <View key={level.id} style={styles.levelContainer}>
          {/* Continuous straight path line through center */}
          <View style={styles.centerPath} />
          
          {/* Connecting line to next level */}
          {index < levels.length - 1 && (
            <View style={[
              styles.connectionLine,
              { backgroundColor: isCompleted ? COLORS.emeraldGreen : COLORS.grey }
            ]} />
          )}
          
          {/* Level Node - centered perfect circle */}
          <TouchableOpacity 
            style={[styles.levelNode, !isUnlocked && styles.lockedNode]}
            onPress={() => handleLevelPress(level)}
            disabled={!isUnlocked}
            activeOpacity={0.8}
          >
            <View style={[styles.levelNodeBase, { borderColor: isCompleted ? COLORS.emeraldGreen : (isUnlocked ? COLORS.black : COLORS.grey) }]}>
              <View style={[styles.levelNodeInner, { backgroundColor: getLevelColors() }]}>
                {!isUnlocked ? (
                  <Lock size={20} color="#ffffff" />
                ) : (
                  <Text style={[styles.levelNumberText, { color: COLORS.white }]}>{level.day}</Text>
                )}
                
                {/* Character Avatar on Current Day */}
                {isCurrent && (
                  <View style={styles.characterAvatar}>
                    <Image
                      source={require('../../assets/images/sage.jpeg')}
                      style={styles.sageImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Level and Date Labels below circle */}
          <View style={styles.labelContainer}>
            <Text style={[styles.levelLabel, { color: isCompleted ? COLORS.emeraldGreen : COLORS.darkGrey }]}>
              Level {level.day}
            </Text>
            <Text style={[styles.dayLabel, { color: isCompleted ? COLORS.emeraldGreen : COLORS.darkGrey }]}>
              {level.date.toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'short' 
              })}
            </Text>
          </View>
        </View>
      );
    };
  }, [levels, currentDay, currentStreak]);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../../assets/images/ruppe.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>JOURNEY MAP</Text>
          </View>
          <View style={styles.streakContainer}>
            <Flame size={20} color={COLORS.crimsonRed} />
            <Text style={styles.streakText}>{currentStreak}</Text>
          </View>
        </View>


        {/* Scrollable Path - starts from bottom, scrolls up */}
        <FlatList
          data={levels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => renderLevel(item, index)}
          style={styles.pathScrollView}
          contentContainerStyle={styles.pathContent}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={Math.max(0, levels.length - 3)} // Start near bottom
          getItemLayout={(data, index) => ({
            length: 140, // Fixed item height for better performance
            offset: 140 * index,
            index,
          })}
          removeClippedSubviews={false} // Disable for smoother scroll
          maxToRenderPerBatch={8}
          windowSize={8}
          scrollEventThrottle={16} // Smooth scroll
          decelerationRate="normal"
        />

        {/* Quest Popup Button */}
        <TouchableOpacity 
          style={styles.questButton}
          onPress={() => setShowQuestPopup(true)}
        >
          <Target size={24} color="#ffffff" />
          <Text style={styles.questButtonText}>QUESTS</Text>
        </TouchableOpacity>

        {/* Quest Popup Modal */}
        {showQuestPopup && (
          <View style={styles.questPopup}>
            <View style={styles.questPopupContent}>
              <View style={styles.questPopupHeader}>
                <Text style={styles.questPopupTitle}>LONG-TERM QUESTS</Text>
                <TouchableOpacity onPress={() => setShowQuestPopup(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={longTermQuests}
                keyExtractor={(item) => item.id.toString()}
                style={styles.questsList}
                renderItem={({ item: quest }) => (
                  <View style={styles.questItem}>
                    <View style={styles.questHeader}>
                      <Text style={styles.questIcon}>{quest.icon}</Text>
                      <View style={styles.questInfo}>
                        <Text style={styles.questTitle}>{quest.title}</Text>
                        <Text style={styles.questDescription}>{quest.description}</Text>
                      </View>
                      <Text style={[styles.questDifficulty, { 
                        color: quest.difficulty === 'Legendary' ? COLORS.crimsonRed : 
                              quest.difficulty === 'Epic' ? '#7C3AED' :
                              quest.difficulty === 'Rare' ? '#3B82F6' : COLORS.emeraldGreen 
                      }]}>
                        {quest.difficulty}
                      </Text>
                    </View>
                    <View style={styles.questProgress}>
                      <Text style={styles.questProgressText}>
                        {formatCurrency(quest.current)} / {formatCurrency(quest.target)}
                      </Text>
                      <View style={styles.questProgressBar}>
                        <View 
                          style={[styles.questProgressFill, { width: `${quest.progress}%`, backgroundColor: COLORS.emeraldGreen }]}
                        />
                      </View>
                      <Text style={styles.questReward}>Reward: {quest.reward} XP • Type: {quest.type}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </View>

      <AddTransactionModal
        visible={showAddExpenseModal}
        onClose={() => {
          setShowAddExpenseModal(false);
          setSelectedLevel(null);
        }}
        onAddTransaction={handleAddExpense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.lightGrey,
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
    fontSize: 20,
    fontFamily: 'Minecraftia',
    color: COLORS.black,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: COLORS.grey,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    marginLeft: 6,
    letterSpacing: 2,
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  pathScrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  pathContent: {
    paddingBottom: 100,
  },
  pathContainer: {
    paddingTop: 20,
    position: 'relative',
  },
  levelContainer: {
    marginBottom: 40,
    position: 'relative',
    width: '100%',
    height: 140,
    alignItems: 'center',
  },
  centerPath: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#e5e7eb',
    marginLeft: -3,
    zIndex: 0,
    borderRadius: 3,
  },
  connectionLine: {
    position: 'absolute',
    left: '50%',
    top: 70,
    width: 6,
    height: 60,
    marginLeft: -3,
    zIndex: 1,
    borderRadius: 3,
  },
  levelNode: {
    position: 'absolute',
    left: '50%',
    top: 15,
    marginLeft: -30, // Half of node width (60px)
    zIndex: 3,
  },
  levelNodeBase: {
    width: 60,
    height: 60,
    borderRadius: 30, // Perfect circle - radius = width/2
    borderWidth: 3,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff', // Ensure clean background
  },
  levelNodeInner: {
    flex: 1,
    borderRadius: 27, // Inner circle - (width-padding*2-border*2)/2
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockedNode: {
    opacity: 0.5,
  },
  levelDayText: {
    fontSize: 16,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  levelNumberText: {
    fontSize: 18,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    letterSpacing: 1,
    fontWeight: 'bold',
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  labelContainer: {
    position: 'absolute',
    top: 85,
    left: '50%',
    marginLeft: -40, // Center the container
    width: 80,
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 9,
    fontFamily: 'Minecraftia',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
    marginBottom: 2,
  },
  dayLabel: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  characterAvatar: {
    position: 'absolute',
    top: -8, // Move avatar to top instead of bottom
    right: -8,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
  },
  sageImage: {
    width: '100%',
    height: '100%',
  },
  levelInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cccccc',
    overflow: 'hidden',
    width: width * 0.6,
    position: 'absolute',
    top: 100,
    left: '50%',
    marginLeft: -(width * 0.3),
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.6,
  },
  levelInfoContent: {
    padding: 12,
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  levelDate: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: COLORS.grey,
    marginBottom: 4,
    letterSpacing: 1,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  expenseAmount: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: COLORS.crimsonRed,
    marginBottom: 4,
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  levelStatus: {
    marginTop: 4,
  },
  levelNumber: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: COLORS.purple,
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  completedText: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: COLORS.emeraldGreen,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  activeText: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#3182ce',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  unlockedText: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: COLORS.grey,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  lockedText: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#9ca3af',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  questButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: COLORS.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  questButtonText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    marginLeft: 6,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  questPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  questPopupContent: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  questPopupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questPopupTitle: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: COLORS.black,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  closeButton: {
    fontSize: 20,
    fontFamily: 'Minecraftia',
    color: COLORS.black,
    padding: 5,
  },
  questsList: {
    maxHeight: height * 0.5,
  },
  questItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  questIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: COLORS.black,
    marginBottom: 2,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  questDescription: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: COLORS.grey,
    letterSpacing: 1,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  questDifficulty: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  questProgress: {
    marginTop: 8,
  },
  questProgressText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: COLORS.black,
    marginBottom: 6,
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  questProgressBar: {
    height: 8,
    backgroundColor: '#dddddd',
    borderRadius: 4,
    marginBottom: 6,
  },
  questProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  questReward: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: COLORS.grey,
    letterSpacing: 1,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});