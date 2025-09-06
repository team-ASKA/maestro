import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Star } from 'lucide-react-native';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';

interface Quest {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  current: number;
  reward: number;
  difficulty: string;
  icon: string;
}

interface QuestCardProps {
  quest: Quest;
  onPress: () => void;
}

export function QuestCard({ quest, onPress }: QuestCardProps) {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Legendary': return '#dc2626';
      case 'Epic': return '#7c3aed';
      case 'Rare': return '#1d4ed8';
      default: return '#059669';
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={['#374151', '#4b5563']}
        style={styles.cardGradient}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.icon}>{quest.icon}</Text>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>{quest.title}</Text>
              <Text style={styles.description}>{quest.description}</Text>
            </View>
          </View>
          
          <View style={styles.difficultyBadge}>
            <LinearGradient
              colors={[getDifficultyColor(quest.difficulty), `${getDifficultyColor(quest.difficulty)}CC`]}
              style={styles.difficultyGradient}
            >
              <Text style={styles.difficultyText}>{quest.difficulty}</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              ${quest.current.toLocaleString()} / ${quest.target.toLocaleString()}
            </Text>
            <Text style={styles.percentText}>{quest.progress}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={['#1f2937', '#374151']}
              style={styles.progressBackground}
            >
              <LinearGradient
                colors={['#d4af37', '#fbbf24']}
                style={[styles.progressFill, { width: `${quest.progress}%` }]}
              />
            </LinearGradient>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.rewardContainer}>
            <Star size={16} color="#d4af37" />
            <Text style={styles.rewardText}>Reward: {quest.reward} XP</Text>
          </View>
          
          <ChevronRight size={20} color="#9ca3af" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#d4af37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#f3e8d3',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'Cinzel_400Regular',
  },
  difficultyBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  difficultyGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#ffffff',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Cinzel_400Regular',
    color: '#d4af37',
  },
  percentText: {
    fontSize: 14,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#d4af37',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBackground: {
    flex: 1,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#d4af37',
    marginLeft: 6,
  },
});