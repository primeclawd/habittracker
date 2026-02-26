import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { api } from '../services/api';
import { HabitCard } from '../components/HabitCard';

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: string;
}

interface DashboardScreenProps {
  token: string;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ token, onLogout }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const data = await api.getHabits(token);
      setHabits(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch habits');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHabits();
  };

  const handleDeleteHabit = async (habitId: number) => {
    try {
      await api.deleteHabit(token, habitId);
      setHabits(habits.filter(h => h.id !== habitId));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete habit');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={habits}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            token={token}
            onDelete={handleDeleteHabit}
            onRefresh={fetchHabits}
          />
        )}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No habits yet. Add one to get started!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#ff3b30',
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
