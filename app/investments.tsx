import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus, Target, Star, Calendar, TrendingUp, Crown, Sword } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { SetQuestModal } from '@/components/SetQuestModal';

const { width, height } = Dimensions.get('window');

interface Quest {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  difficulty: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
  progress: number;
}

export default function InvestmentsScreen() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const [showSetQuestModal, setShowSetQuestModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');

  // Mock data - in a real app, this would come from your database
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Emergency Shield Fund',
      description: 'Build a safety net for unexpected expenses',
      targetAmount: 500000,
      currentAmount: 325000,
      category: 'emergency_fund',
      difficulty: 'Common',
      deadline: 'June 2024',
      priority: 'High',
      progress: 65,
    },
    {
      id: '2',
      title: 'Castle Down Payment',
      description: 'Save for dream home purchase',
      targetAmount: 2000000,
      currentAmount: 800000,
      category: 'house_purchase',
      difficulty: 'Epic',
      deadline: 'December 2025',
      priority: 'High',
      progress: 40,
    },
    {
      id: '3',
      title: 'Retirement Kingdom',
      description: 'Build wealth for future retirement',
      targetAmount: 10000000,
      currentAmount: 2500000,
      category: 'retirement',
      difficulty: 'Legendary',
      deadline: 'March 2045',
      priority: 'Medium',
      progress: 25,
    },
    {
      id: '4',
      title: 'Adventure Trip Fund',
      description: 'European adventure vacation',
      targetAmount: 300000,
      currentAmount: 280000,
      category: 'vacation',
      difficulty: 'Rare',
      deadline: 'August 2024',
      priority: 'Medium',
      progress: 93,
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Common': return '#10B981';
      case 'Rare': return '#3B82F6';
      case 'Epic': return '#7C3AED';
      case 'Legendary': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <Crown size={16} color="#DC2626" strokeWidth={3} />;
      case 'Medium': return <Target size={16} color="#F59E0B" strokeWidth={3} />;
      case 'Low': return <Sword size={16} color="#10B981" strokeWidth={3} />;
      default: return <Target size={16} color="#F59E0B" strokeWidth={3} />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  const handleAddQuest = (questData: any) => {
    const newQuest: Quest = {
      id: Date.now().toString(),
      ...questData,
      progress: Math.round((questData.currentAmount / questData.targetAmount) * 100),
    };

    setQuests(prevQuests => [...prevQuests, newQuest]);
    Alert.alert('Quest Created!', `${questData.title} has been added to your quest log.`);
  };

  const getFilteredQuests = () => {
    switch (activeTab) {
      case 'active':
        return quests.filter(quest => quest.progress < 100);
      case 'completed':
        return quests.filter(quest => quest.progress >= 100);
      case 'all':
      default:
        return quests;
    }
  };

  const filteredQuests = getFilteredQuests();

  // Calculate summary stats
  const totalQuests = quests.length;
  const completedQuests = quests.filter(quest => quest.progress >= 100).length;
  const totalTargetAmount = quests.reduce((sum, quest) => sum + quest.targetAmount, 0);
  const totalCurrentAmount = quests.reduce((sum, quest) => sum + quest.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f5f5f5', '#e8e8e8']}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" strokeWidth={3} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>QUEST MANAGEMENT</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setShowSetQuestModal(true)}
          >
            <Plus size={24} color="#ffffff" strokeWidth={3} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Summary Stats */}
          <View style={styles.summarySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUEST OVERVIEW</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Target size={24} color="#7C3AED" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>{totalQuests}</Text>
                  <Text style={styles.summaryLabel}>TOTAL QUESTS</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <Crown size={24} color="#F59E0B" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>{completedQuests}</Text>
                  <Text style={styles.summaryLabel}>COMPLETED</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <TrendingUp size={24} color="#10B981" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>{overallProgress}%</Text>
                  <Text style={styles.summaryLabel}>OVERALL PROGRESS</Text>
                </View>
              </View>
              <View style={styles.summaryCard}>
                <Sword size={24} color="#DC2626" strokeWidth={3} />
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryValue}>{formatCurrency(totalCurrentAmount)}</Text>
                  <Text style={styles.summaryLabel}>GOLD COLLECTED</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUEST STATUS</Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            <View style={styles.tabSelector}>
              {[
                { id: 'active', name: 'ACTIVE' },
                { id: 'completed', name: 'COMPLETED' },
                { id: 'all', name: 'ALL' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tabButton,
                    activeTab === tab.id && styles.tabButtonActive,
                  ]}
                  onPress={() => setActiveTab(tab.id as any)}
                >
                  <Text style={[
                    styles.tabButtonText,
                    activeTab === tab.id && styles.tabButtonTextActive,
                  ]}>
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quest List */}
          <View style={styles.questsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeTab.toUpperCase()} QUESTS ({filteredQuests.length})
              </Text>
              <Image
                source={require('../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            
            {filteredQuests.length === 0 ? (
              <View style={styles.emptyState}>
                <Target size={48} color="#cccccc" strokeWidth={2} />
                <Text style={styles.emptyStateTitle}>No Quests Found</Text>
                <Text style={styles.emptyStateText}>
                  {activeTab === 'active' ? 'All your quests are completed!' : 
                   activeTab === 'completed' ? 'No completed quests yet.' : 
                   'Start your financial journey by creating your first quest.'}
                </Text>
                <TouchableOpacity 
                  style={styles.createQuestButton}
                  onPress={() => setShowSetQuestModal(true)}
                >
                  <Plus size={16} color="#ffffff" strokeWidth={3} />
                  <Text style={styles.createQuestButtonText}>CREATE QUEST</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.questList}>
                {filteredQuests.map((quest) => (
                  <View key={quest.id} style={styles.questCard}>
                    <View style={styles.questHeader}>
                      <View style={styles.questTitleRow}>
                        <Text style={styles.questTitle}>{quest.title}</Text>
                        <View style={styles.questMeta}>
                          {getPriorityIcon(quest.priority)}
                          <View style={[
                            styles.difficultyBadge,
                            { backgroundColor: getDifficultyColor(quest.difficulty) }
                          ]}>
                            <Star size={12} color="#ffffff" strokeWidth={2} />
                            <Text style={styles.difficultyText}>{quest.difficulty}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.questDescription}>{quest.description}</Text>
                    </View>

                    <View style={styles.questProgress}>
                      <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>
                          {formatCurrency(quest.currentAmount)} / {formatCurrency(quest.targetAmount)}
                        </Text>
                        <Text style={styles.progressPercentage}>{quest.progress}%</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                width: `${Math.min(quest.progress, 100)}%`,
                                backgroundColor: getDifficultyColor(quest.difficulty)
                              }
                            ]} 
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.questFooter}>
                      <View style={styles.deadlineContainer}>
                        <Calendar size={14} color="#666666" strokeWidth={2} />
                        <Text style={styles.deadlineText}>Target: {quest.deadline}</Text>
                      </View>
                      {quest.progress >= 100 && (
                        <View style={styles.completedBadge}>
                          <Crown size={14} color="#F59E0B" strokeWidth={3} />
                          <Text style={styles.completedText}>COMPLETED</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <SetQuestModal
          visible={showSetQuestModal}
          onClose={() => setShowSetQuestModal(false)}
          onSetQuest={handleAddQuest}
        />
      </LinearGradient>
    </View>
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
  backButton: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 8,
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 15,
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
  },
  summarySection: {
    marginBottom: 30,
  },
  summaryGrid: {
    flexDirection: 'column',
    gap: 15,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  summaryLabel: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  tabSection: {
    marginBottom: 30,
  },
  tabSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#000000',
  },
  tabButtonText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  tabButtonTextActive: {
    color: '#ffffff',
    textShadowColor: '#333333',
  },
  questsSection: {
    marginBottom: 40,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    gap: 15,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  emptyStateText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 16,
  },
  createQuestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createQuestButtonText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  questList: {
    gap: 15,
  },
  questCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 15,
  },
  questHeader: {
    marginBottom: 15,
  },
  questTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  questTitle: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginRight: 10,
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  difficultyText: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#ffffff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  questDescription: {
    fontSize: 9,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
    lineHeight: 14,
  },
  questProgress: {
    marginBottom: 15,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 1,
  },
  progressPercentage: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#10B981',
    letterSpacing: 1,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadlineText: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#F59E0B',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
