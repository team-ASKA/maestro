import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChartWrapperProps {
  children: React.ReactNode;
  title: string;
  fallbackMessage?: string;
}

export function ChartWrapper({ children, title, fallbackMessage = "Chart data loading..." }: ChartWrapperProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        {children || (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>{fallbackMessage}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginBottom: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 15,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  fallbackText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
  },
});
