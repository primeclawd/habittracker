import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import HabitList from './HabitList';
import HabitForm from './HabitForm';

function Dashboard({ token, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/habits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setHabits(data);
    } catch (err) {
      console.error('Failed to fetch habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (habit) => {
    try {
      const response = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(habit),
      });
      const newHabit = await response.json();
      setHabits([...habits, newHabit]);
    } catch (err) {
      console.error('Failed to add habit:', err);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await fetch(`http://localhost:5000/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(habits.filter(h => h.id !== habitId));
    } catch (err) {
      console.error('Failed to delete habit:', err);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Habits</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>
      <HabitForm onAddHabit={handleAddHabit} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <HabitList habits={habits} token={token} onDeleteHabit={handleDeleteHabit} />
      )}
    </div>
  );
}

export default Dashboard;
