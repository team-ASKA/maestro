import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Switch, Alert, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sword, Shield, TrendingUp, Star, Crown, Coins, Trophy, Target, Gift, Settings as SettingsIcon, Upload, Bell, Palette, LogOut, User, ChevronRight } from 'lucide-react-native';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import { AttributeBar } from '@/components/AttributeBar';
import { XPProgressBar } from '@/components/XPProgressBar';
import { DailyCheckIn } from '@/components/DailyCheckIn';
import { useFonts } from 'expo-font';
import { gamificationEngine } from '@/lib/gamificationEngine';
import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('window');

export default function ProfileSettings() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  
  const [characterData, setCharacterData] = useState({
    level: 12,
    currentXP: 2450,
    nextLevelXP: 3000,
    strength: 85, // Net Worth based
    discipline: 72, // Daily logging consistency
    growth: 91, // Investment activity
    totalWealth: 45670,
    dailyStreak: 15,
  });

  const [levelUpAnimation] = useState(new Animated.Value(0));

  const handleDailyCheckIn = () => {
    const xpGained = gamificationEngine.calculateDailyXP(characterData.dailyStreak);
    const updatedData = gamificationEngine.addXP(characterData, xpGained);
    
    setCharacterData(updatedData);
    
    // Trigger level up animation if needed
    if (updatedData.level > characterData.level) {
      Animated.sequence([
        Animated.timing(levelUpAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(levelUpAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleBankStatementUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        Alert.alert(
          'Statement Uploaded',
          'Your bank statement has been processed successfully! Your character attributes have been updated.',
          [{ text: 'Excellent!', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Upload Failed', 'Please try again with a valid PDF bank statement.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'End Your Quest?',
      'Are you sure you want to log out of WealthCraft?',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  if (showSettings) {
    return (
      <View style={styles.container}>
          {/* Settings Header */}
          <View style={styles.settingsHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowSettings(false)}
            >
              <ChevronRight size={24} color="#ffffff" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <Text style={styles.settingsTitle}>Settings</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.settingsScrollView} showsVerticalScrollIndicator={false}>
            {/* Game Settings */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Game Preferences</Text>
              
              <View style={styles.settingItem}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.4)']}
                  style={styles.settingGradient}
                >
                  <View style={styles.settingLeft}>
                    <Bell size={20} color="#d69e2e" />
                    <Text style={styles.settingText}>Push Notifications</Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#6b7280', true: '#d69e2e' }}
                    thumbColor={notificationsEnabled ? '#fbbf24' : '#9ca3af'}
                  />
                </LinearGradient>
              </View>

              <View style={styles.settingItem}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.4)']}
                  style={styles.settingGradient}
                >
                  <View style={styles.settingLeft}>
                    <Crown size={20} color="#d69e2e" />
                    <Text style={styles.settingText}>Daily Quest Reminders</Text>
                  </View>
                  <Switch
                    value={dailyReminders}
                    onValueChange={setDailyReminders}
                    trackColor={{ false: '#6b7280', true: '#d69e2e' }}
                    thumbColor={dailyReminders ? '#fbbf24' : '#9ca3af'}
                  />
                </LinearGradient>
              </View>

              <TouchableOpacity style={styles.settingItem} onPress={handleBankStatementUpload}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.4)']}
                  style={styles.settingGradient}
                >
                  <View style={styles.settingLeft}>
                    <Upload size={20} color="#d69e2e" />
                    <Text style={styles.settingText}>Upload Bank Statement</Text>
                  </View>
                  <ChevronRight size={16} color="#9ca3af" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Privacy & Security */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Privacy & Security</Text>
              
              <TouchableOpacity style={styles.settingItem}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.4)']}
                  style={styles.settingGradient}
                >
                  <View style={styles.settingLeft}>
                    <Shield size={20} color="#d69e2e" />
                    <Text style={styles.settingText}>Data Protection</Text>
                  </View>
                  <Text style={styles.settingSubtext}>Bank-level encryption</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Account Actions */}
            <View style={styles.sectionContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LinearGradient
                  colors={['#dc2626', '#ef4444']}
                  style={styles.logoutGradient}
                >
                  <LogOut size={20} color="#ffffff" />
                  <Text style={styles.logoutText}>End Quest (Logout)</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/ruppe.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>PROFILE</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingsIconButton}
            onPress={() => setShowSettings(true)}
          >
            <SettingsIcon size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Character Portrait */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.characterSection}>
            <View style={styles.characterCard}>
              <LinearGradient
                colors={['#ff6b35', '#f7931e']}
                style={styles.characterBackground}
              >
                <CharacterAvatar level={characterData.level} />
                <View style={styles.characterInfo}>
                  <Text style={styles.characterName}>Financial Warrior</Text>
                  <Text style={styles.characterTitle}>Akatsuki</Text>
                </View>
                
                <View style={styles.trophyContainer}>
                  <Trophy size={20} color="#ffd700" />
                  <Text style={styles.trophyCount}>7562</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* XP Progress */}
          <View style={styles.xpContainer}>
            <XPProgressBar
              currentXP={characterData.currentXP}
              nextLevelXP={characterData.nextLevelXP}
              level={characterData.level}
            />
          </View>

          {/* Core Attributes */}
          <View style={styles.attributesContainer}>
            <Text style={styles.sectionTitle}>Core Attributes</Text>
            
            <AttributeBar
              icon={<Sword size={20} color="#d69e2e" />}
              label="Financial Strength"
              value={characterData.strength}
              maxValue={100}
              color="#10b981"
              description={`Net Worth: $${characterData.totalWealth.toLocaleString()}`}
            />
            
            <AttributeBar
              icon={<Shield size={20} color="#d69e2e" />}
              label="Discipline"
              value={characterData.discipline}
              maxValue={100}
              color="#3b82f6"
              description={`${characterData.dailyStreak} day streak`}
            />
            
            <AttributeBar
              icon={<TrendingUp size={20} color="#d69e2e" />}
              label="Growth"
              value={characterData.growth}
              maxValue={100}
              color="#8b5cf6"
              description="Investment performance"
            />
          </View>

          {/* Daily Check-in */}
          <DailyCheckIn
            streak={characterData.dailyStreak}
            onCheckIn={handleDailyCheckIn}
          />

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.4)']}
              style={styles.statCard}
            >
              <Coins size={24} color="#d69e2e" />
              <Text style={styles.statValue}>$45,670</Text>
              <Text style={styles.statLabel}>Total Wealth</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.4)']}
              style={styles.statCard}
            >
              <Star size={24} color="#d69e2e" />
              <Text style={styles.statValue}>2,450</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </LinearGradient>
          </View>
        </ScrollView>

        {/* Level Up Animation */}
        <Animated.View
          style={[
            styles.levelUpOverlay,
            {
              opacity: levelUpAnimation,
              transform: [
                {
                  scale: levelUpAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.2],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.levelUpText}>LEVEL UP!</Text>
        </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
    color: '#000000',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: '#666666',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  resourcesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resourceIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  resourceValue: {
    fontSize: 12,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  resourceLabel: {
    fontSize: 8,
    fontFamily: 'Orbitron_400Regular',
    color: '#bbbbbb',
    textAlign: 'center',
  },
  settingsIconButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
  characterSection: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  characterCard: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  characterBackground: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  characterInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  characterName: {
    fontSize: 24,
    fontFamily: 'Orbitron_900Black',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  characterTitle: {
    fontSize: 16,
    fontFamily: 'Orbitron_400Regular',
    color: '#ffeb3b',
    marginTop: 5,
  },
  trophyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  trophyCount: {
    fontSize: 14,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffd700',
    marginLeft: 5,
  },
  xpContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  attributesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginBottom: 15,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 0.48,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d69e2e',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#bbbbbb',
    marginTop: 4,
    textAlign: 'center',
  },
  levelUpOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -25 }],
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#ff6b35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  levelUpText: {
    fontSize: 24,
    fontFamily: 'Orbitron_900Black',
    color: '#ff6b35',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Settings Styles
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsTitle: {
    fontSize: 20,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  settingsScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  settingItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Orbitron_400Regular',
    color: '#ffffff',
    marginLeft: 12,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#bbbbbb',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Orbitron_700Bold',
    color: '#ffffff',
    marginLeft: 8,
  },
});