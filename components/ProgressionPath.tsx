import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck as CheckCircle, Circle } from 'lucide-react-native';

interface Milestone {
  id: number;
  name: string;
  icon: string;
  completed: boolean;
}

interface ProgressionPathProps {
  milestones: Milestone[];
}

export function ProgressionPath({ milestones }: ProgressionPathProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {milestones.map((milestone, index) => (
        <View key={milestone.id} style={styles.milestoneContainer}>
          <TouchableOpacity style={styles.milestone}>
            <LinearGradient
              colors={milestone.completed 
                ? ['#d4af37', '#fbbf24'] 
                : ['#374151', '#4b5563']
              }
              style={styles.milestoneGradient}
            >
              <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
              {milestone.completed && (
                <View style={styles.completedBadge}>
                  <CheckCircle size={16} color="#10b981" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          {index < milestones.length - 1 && (
            <View style={styles.pathLine}>
              <LinearGradient
                colors={milestone.completed && milestones[index + 1].completed
                  ? ['#d4af37', '#fbbf24']
                  : ['#4b5563', '#6b7280']
                }
                style={styles.pathGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  milestoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestone: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  milestoneGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1e3a8a',
    position: 'relative',
  },
  milestoneIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  completedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 2,
  },
  pathLine: {
    width: 40,
    height: 4,
    marginHorizontal: 8,
  },
  pathGradient: {
    flex: 1,
    borderRadius: 2,
  },
});