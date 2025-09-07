import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Dimensions, Image } from 'react-native';
import { Settings as SettingsIcon, User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, ChevronRight, Bell, Shield, LogOut, Upload } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import * as DocumentPicker from 'expo-document-picker';
import { AnalysisStorage } from '@/lib/analysisStorage';
import { APIService } from '@/lib/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function ProfileSettings() {
  const [fontsLoaded] = useFonts({
    'Minecraftia': require('../../assets/minecraftia/Minecraftia-Regular.ttf'),
  });

  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  
  const [profileData, setProfileData] = useState({
    name: 'User',
    email: 'user@email.com',
    phone: '+91 00000 00000',
    location: 'India',
    joinDate: 'Today',
    profession: 'Professional',
    education: 'Graduate',
    totalBalance: 0,
    accountsLinked: 1,
    transactionsLogged: 0,
  });

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        const joinDate = new Date(parsedProfile.joinDate).toLocaleDateString('en-IN', { 
          month: 'long', 
          year: 'numeric' 
        });
        
        setProfileData(prev => ({
          ...prev,
          name: parsedProfile.name || prev.name,
          email: parsedProfile.email || prev.email,
          location: parsedProfile.location || prev.location,
          profession: parsedProfile.profession || prev.profession,
          joinDate: joinDate,
          totalBalance: Math.floor((parsedProfile.monthlySalary || 0) * 2), // 2 months salary as balance
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        console.log('📄 Processing PDF file...');
        
        try {
          // Call the real API service
          const analysisData = await APIService.analyzePDF(file.uri, file.name);
          
          console.log('✅ Analysis complete');
          
          Alert.alert(
            '📄 Document Analyzed Successfully!',
            `${file.name} has been processed. The financial data is now available in your reports and sage chat.`,
            [{ text: 'OK', style: 'default' }]
          );
        } catch (error) {
          console.error('❌ PDF analysis failed:', error);
          
          let errorTitle = 'Processing Failed';
          let errorMessage = 'There was an issue analyzing your document.';
          
          if (error.message?.includes('timed out') || error.message?.includes('starting up')) {
            errorTitle = 'Service Starting Up';
            errorMessage = 'The PDF analysis service is starting up (this happens with free tier services). Please try again in 30-60 seconds.';
          } else if (error.message?.includes('Network request failed') || error.message?.includes('internet connection')) {
            errorTitle = 'Connection Issue';
            errorMessage = 'Unable to reach the analysis service. Please check your internet connection and try again.';
          } else if (error.message?.includes('422')) {
            errorTitle = 'File Format Issue';
            errorMessage = 'The PDF file format is not supported or the file is corrupted. Please ensure you are uploading a valid PDF file with readable text.';
          } else {
            errorMessage = 'There was an issue analyzing your document. Please try again or check if the PDF contains readable financial data.';
          }
          
          Alert.alert(
            errorTitle, 
            errorMessage,
            [
              { text: 'Try Again', onPress: () => handleDocumentUpload() },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Upload Failed', 'Please try again with a valid PDF file.');
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from MAESTRO?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!fontsLoaded) {
    return null;
  }

  if (showSettings) {
    return (
      <View style={styles.container}>
        {/* Settings Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowSettings(false)}
          >
            <ChevronRight size={20} color="#ffffff" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../../assets/images/ruppe.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>SETTINGS</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Preferences */}
          <View style={styles.settingsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>APP PREFERENCES</Text>
              <Image
                source={require('../../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Bell size={16} color="#000000" />
                  <Text style={styles.settingText}>NOTIFICATIONS</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#cccccc', true: '#10B981' }}
                  thumbColor={notificationsEnabled ? '#ffffff' : '#666666'}
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Calendar size={16} color="#000000" />
                  <Text style={styles.settingText}>DAILY REMINDERS</Text>
                </View>
                <Switch
                  value={dailyReminders}
                  onValueChange={setDailyReminders}
                  trackColor={{ false: '#cccccc', true: '#10B981' }}
                  thumbColor={dailyReminders ? '#ffffff' : '#666666'}
                />
              </View>
            </View>
          </View>

          {/* Data Management */}
          <View style={styles.settingsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
              <Image
                source={require('../../assets/images/divider.jpeg')}
                style={styles.dividerImage}
                resizeMode="stretch"
              />
            </View>
            
            <View style={styles.settingCard}>
              <TouchableOpacity style={styles.settingRow} onPress={handleDocumentUpload}>
                <View style={styles.settingLeft}>
                  <Upload size={16} color="#000000" />
                  <Text style={styles.settingText}>UPLOAD DOCUMENTS</Text>
                </View>
                <ChevronRight size={16} color="#666666" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Shield size={16} color="#000000" />
                  <Text style={styles.settingText}>DATA SECURITY</Text>
                </View>
                <Text style={styles.settingStatus}>ENCRYPTED</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.settingsSection}>
            <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
              <LogOut size={16} color="#DC2626" />
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/images/ruppe.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>PROFILE</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
        >
          <SettingsIcon size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar & Info */}
        <View style={styles.profileSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>USER PROFILE</Text>
            <Image
              source={require('../../assets/images/divider.jpeg')}
              style={styles.dividerImage}
              resizeMode="stretch"
            />
          </View>
          
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <User size={40} color="#666666" />
              </View>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>EDIT</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{profileData.name}</Text>
              <Text style={styles.userTitle}>MEMBER SINCE {profileData.joinDate.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CONTACT INFO</Text>
            <Image
              source={require('../../assets/images/divider.jpeg')}
              style={styles.dividerImage}
              resizeMode="stretch"
            />
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Mail size={16} color="#000000" />
              <Text style={styles.infoLabel}>EMAIL</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Phone size={16} color="#000000" />
              <Text style={styles.infoLabel}>PHONE</Text>
              <Text style={styles.infoValue}>{profileData.phone}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MapPin size={16} color="#000000" />
              <Text style={styles.infoLabel}>LOCATION</Text>
              <Text style={styles.infoValue}>{profileData.location}</Text>
            </View>
          </View>
        </View>

        {/* Professional Info */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROFESSIONAL</Text>
            <Image
              source={require('../../assets/images/divider.jpeg')}
              style={styles.dividerImage}
              resizeMode="stretch"
            />
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Briefcase size={16} color="#000000" />
              <Text style={styles.infoLabel}>PROFESSION</Text>
              <Text style={styles.infoValue}>{profileData.profession}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <GraduationCap size={16} color="#000000" />
              <Text style={styles.infoLabel}>EDUCATION</Text>
              <Text style={styles.infoValue}>{profileData.education}</Text>
            </View>
          </View>
        </View>

        {/* Account Stats */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACCOUNT STATISTICS</Text>
            <Image
              source={require('../../assets/images/divider.jpeg')}
              style={styles.dividerImage}
              resizeMode="stretch"
            />
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, styles.incomeColor]}>{formatCurrency(profileData.totalBalance)}</Text>
              <Text style={styles.statLabel}>TOTAL BALANCE</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{profileData.accountsLinked}</Text>
              <Text style={styles.statLabel}>ACCOUNTS LINKED</Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{profileData.transactionsLogged}</Text>
              <Text style={styles.statLabel}>TRANSACTIONS</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>ACTIVE</Text>
              <Text style={styles.statLabel}>STATUS</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  settingsButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  backButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  dividerImage: {
    width: '30%',
    height: 24,
    alignSelf: 'flex-start',
  },
  // Profile Section
  profileSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  profileCard: {
    padding: 20,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#cccccc',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333333',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Minecraftia',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#333333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Minecraftia',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  userTitle: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Info Sections
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginLeft: 12,
    flex: 1,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  infoValue: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Stats Section
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 0.48,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Minecraftia',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  statLabel: {
    fontSize: 7,
    fontFamily: 'Minecraftia',
    color: '#666666',
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Settings Styles
  settingsSection: {
    marginBottom: 30,
  },
  settingCard: {
    padding: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 10,
    fontFamily: 'Minecraftia',
    color: '#000000',
    marginLeft: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#cccccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  settingStatus: {
    fontSize: 8,
    fontFamily: 'Minecraftia',
    color: '#666666',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#dddddd',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 12,
    fontFamily: 'Minecraftia',
    color: '#DC2626',
    marginLeft: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#ffcccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  // Color styles
  incomeColor: {
    color: '#10B981',
  },
});