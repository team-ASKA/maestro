import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, User, Map, MessageCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 1,
          borderTopColor: '#ffffff',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={3} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'MAP',
          tabBarIcon: ({ size, color }) => (
            <Map size={size} color={color} strokeWidth={3} />
          ),
        }}
      />
      <Tabs.Screen
        name="sage"
        options={{
          title: 'SAGE',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} strokeWidth={3} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={3} />
          ),
        }}
      />
    </Tabs>
  );
}