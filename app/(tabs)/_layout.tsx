import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, User, Map, MessageCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          borderTopWidth: 1,
          borderTopColor: '#000000',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#999999',
        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: '700',
          letterSpacing: 2,
          textTransform: 'uppercase',
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