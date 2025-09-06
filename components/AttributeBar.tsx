import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';

interface AttributeBarProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  maxValue: number;
  color: string;
  description?: string;
}

export function AttributeBar({ icon, label, value, maxValue, color, description }: AttributeBarProps) {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const progress = useSharedValue(0);
  
  React.useEffect(() => {
    progress.value = withTiming(value / maxValue, { duration: 1500 });
  }, [value, maxValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.labelContainer}>
          {icon}
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.value}>{value}/{maxValue}</Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <LinearGradient
          colors={['#374151', '#4b5563']}
          style={styles.progressBackground}
        >
          <Animated.View style={animatedStyle}>
            <LinearGradient
              colors={[color, `${color}CC`]}
              style={styles.progressFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </LinearGradient>
      </View>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#f3e8d3',
    marginLeft: 8,
  },
  value: {
    fontSize: 14,
    fontFamily: 'Cinzel_400Regular',
    color: '#d4af37',
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBackground: {
    flex: 1,
    borderRadius: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  description: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Cinzel_400Regular',
  },
});