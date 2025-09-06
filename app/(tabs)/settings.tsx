import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings as SettingsIcon, Upload, Shield, Bell, Palette, LogOut, User, Crown } from 'lucide-react-native';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';
import * as DocumentPicker from 'expo-document-picker';

export default function Settings() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);

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

  return (
    <LinearGradient
      colors={['#0f172a', '#1e3a8a', '#3730a3']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#d4af37', '#fbbf24']}
            style={styles.headerBadge}
          >
            <SettingsIcon size={20} color="#1e3a8a" />
            <Text style={styles.headerText}>Settings</Text>
          </LinearGradient>
        </View>

        {/* Profile Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient
              colors={['#374151', '#4b5563']}
              style={styles.settingGradient}
            >
              <View style={styles.settingLeft}>
                <User size={20} color="#d4af37" />
                <Text style={styles.settingText}>Account Details</Text>
              </View>
              <Crown size={16} color="#9ca3af" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleBankStatementUpload}>
            <LinearGradient
              colors={['#374151', '#4b5563']}
              style={styles.settingGradient}
            >
              <View style={styles.settingLeft}>
                <Upload size={20} color="#d4af37" />
                <Text style={styles.settingText}>Upload Bank Statement</Text>
              </View>
              <Text style={styles.settingSubtext}>Update financial data</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Game Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Game Preferences</Text>
          
          <View style={styles.settingItem}>
            <LinearGradient
              colors={['#374151', '#4b5563']}
              style={styles.settingGradient}
            >
              <View style={styles.settingLeft}>
                <Bell size={20} color="#d4af37" />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#6b7280', true: '#d4af37' }}
                thumbColor={notificationsEnabled ? '#fbbf24' : '#9ca3af'}
              />
            </LinearGradient>
          </View>

          <View style={styles.settingItem}>
            <LinearGradient
              colors={['#374151', '#4b5563']}
              style={styles.settingGradient}
            >
              <View style={styles.settingLeft}>
                <Crown size={20} color="#d4af37" />
                <Text style={styles.settingText}>Daily Quest Reminders</Text>
              </View>
              <Switch
                value={dailyReminders}
                onValueChange={setDailyReminders}
                trackColor={{ false: '#6b7280', true: '#d4af37' }}
                thumbColor={dailyReminders ? '#fbbf24' : '#9ca3af'}
              />
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient
              colors={['#374151', '#4b5563']}
              style={styles.settingGradient}
            >
              <View style={styles.settingLeft}>
                <Palette size={20} color="#d4af37" />
                <Text style={styles.settingText}>Theme Customization</Text>
              </View>
              <Text style={styles.settingSubtext}>Coming Soon</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Privacy & Security */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient
              colors={['#374151', '#4b5563']}
              style={styles.settingGradient}
            >
              <View style={styles.settingLeft}>
                <Shield size={20} color="#d4af37" />
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

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appInfoText}>WealthCraft v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>Build your financial empire</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#1e3a8a',
    marginLeft: 8,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#d4af37',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d4af37',
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
    fontFamily: 'Cinzel_400Regular',
    color: '#f3e8d3',
    marginLeft: 12,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#9ca3af',
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
    fontFamily: 'Cinzel_600SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  appInfoText: {
    fontSize: 14,
    fontFamily: 'Cinzel_600SemiBold',
    color: '#d4af37',
  },
  appInfoSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});