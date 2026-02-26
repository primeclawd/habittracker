import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { api } from '../services/api';

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: string;
}

interface HabitCardProps {
  habit: Habit;
  token: string;
  onDelete: (habitId: number) => void;
  onRefresh: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, token, onDelete, onRefresh }) => {
  const [stats, setStats] = useState({ streak: 0, completionRate: 0 });
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsData, statsData] = await Promise.all([
        api.getLogs(token, habit.id),
        api.getStats(token, habit.id),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayLog = logsData.find((log: any) => log.date === today);
      setTodayCompleted(todayLog?.completed || false);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const today = new Date().toISOString().split('T')[0];
    setToggling(true);
    try {
      await api.logHabit(token, habit.id, today, !todayCompleted);
      setTodayCompleted(!todayCompleted);
      await fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to log habit');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Habit', `Are you sure you want to delete "${habit.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(habit.id),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{habit.name}</Text>
          {habit.description && <Text style={styles.description}>{habit.description}</Text>}
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{stats.streak} days</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Completion</Text>
          <Text style={styles.statValue}>{Math.round(stats.completionRate)}%</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.toggleBtn, todayCompleted && styles.toggleBtnCompleted]}
        onPress={handleToggle}
        disabled={toggling}
      >
        {toggling ? (
          <ActivityIndicator color={todayCompleted ? '#fff' : '#007AFF'} />
        ) : (
          <Text style={[styles.toggleText, todayCompleted && styles.toggleTextCompleted]}>
            {todayCompleted ? '✓ Done Today' : 'Mark as Done'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  deleteBtn: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
    color: '#ff3b30',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  toggleBtn: {
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleBtnCompleted: {
    backgroundColor: '#34C759',
  },
  toggleText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleTextCompleted: {
    color: '#fff',
  },
});
