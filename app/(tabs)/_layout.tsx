import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { User, Map, MessageCircle, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1e3a8a',
          borderTopWidth: 2,
          borderTopColor: '#d4af37',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#d4af37',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Character',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Quest Map',
          tabBarIcon: ({ size, color }) => (
            <Map size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="sage"
        options={{
          title: 'AI Sage',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}