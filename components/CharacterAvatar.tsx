import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CharacterAvatarProps {
  level: number;
}

export function CharacterAvatar({ level }: CharacterAvatarProps) {
  // Different avatar styles based on level
  const getAvatarStyle = (level: number) => {
    if (level >= 20) return { colors: ['#dc2626', '#ef4444'], icon: '👑' };
    if (level >= 15) return { colors: ['#7c3aed', '#a855f7'], icon: '🏰' };
    if (level >= 10) return { colors: ['#1d4ed8', '#3b82f6'], icon: '⚔️' };
    if (level >= 5) return { colors: ['#059669', '#10b981'], icon: '🛡️' };
    return { colors: ['#d97706', '#f59e0b'], icon: '🌟' };
  };

  const avatarStyle = getAvatarStyle(level);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={avatarStyle.colors}
        style={styles.avatarGradient}
      >
        <Text style={styles.avatarIcon}>{avatarStyle.icon}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{level}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#d4af37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    position: 'relative',
  },
  avatarIcon: {
    fontSize: 48,
    textAlign: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#d4af37',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1e3a8a',
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
});