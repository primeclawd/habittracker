import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthScreen } from './src/screens/AuthScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AddHabitModal } from './src/components/AddHabitModal';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUserId = await AsyncStorage.getItem('userId');
      if (savedToken && savedUserId) {
        setToken(savedToken);
        setUserId(parseInt(savedUserId));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (newToken: string, newUserId: number) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('userId', newUserId.toString());
      setToken(newToken);
      setUserId(newUserId);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      setToken(null);
      setUserId(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      {token ? (
        <>
          <DashboardScreen token={token} onLogout={handleLogout} />
          <AddHabitModal
            visible={showAddModal}
            token={token}
            onClose={() => setShowAddModal(false)}
            onHabitAdded={() => {}}
          />
        </>
      ) : (
        <AuthScreen onLogin={handleLogin} />
      )}
    </>
  );
}
