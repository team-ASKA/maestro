import React from 'react';
import { OnboardingForm } from '@/components/OnboardingForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';

interface OnboardingData {
  name: string;
  email: string;
  location: string;
  profession: string;
  monthlySalary: string;
  currency: string;
}

export default function OnboardingScreen() {
  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // Save onboarding data to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        name: data.name,
        email: data.email,
        location: data.location,
        profession: data.profession,
        monthlySalary: parseFloat(data.monthlySalary),
        currency: data.currency,
        joinDate: new Date().toISOString(),
        isOnboarded: true,
      }));

      // Save monthly salary separately for easy access
      await AsyncStorage.setItem('monthlySalary', data.monthlySalary);
      
      Alert.alert(
        '🎉 Welcome to MAESTRO!',
        `Hello ${data.name}! Your financial journey begins now. Let's start tracking your expenses and building wealth!`,
        [
          {
            text: 'Let\'s Go!',
            onPress: () => {
              // Navigate to main app
              router.replace('/(tabs)');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    }
  };

  return <OnboardingForm onComplete={handleOnboardingComplete} />;
}
