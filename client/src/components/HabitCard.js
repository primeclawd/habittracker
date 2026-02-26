import React, { useState, useEffect } from 'react';
import '../styles/HabitCard.css';

function HabitCard({ habit, token, onDelete }) {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ streak: 0, completionRate: 0 });
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/logs/${habit.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setLogs(data);

      const today = new Date().toISOString().split('T')[0];
      const todayLog = data.find(log => log.date === today);
      setTodayCompleted(todayLog?.completed || false);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/stats/${habit.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleToggle = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await fetch('http://localhost:5000/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          habitId: habit.id,
          date: today,
          completed: !todayCompleted,
        }),
      });
      setTodayCompleted(!todayCompleted);
      fetchStats();
    } catch (err) {
      console.error('Failed to log habit:', err);
    }
  };

  return (
    <div className="habit-card">
      <div className="habit-header">
        <h3>{habit.name}</h3>
        <button
          className="delete-btn"
          onClick={() => onDelete(habit.id)}
        >
          ✕
        </button>
      </div>
      {habit.description && <p className="description">{habit.description}</p>}
      <div className="habit-stats">
        <div className="stat">
          <span className="label">Streak</span>
          <span className="value">{stats.streak} days</span>
        </div>
        <div className="stat">
          <span className="label">Completion</span>
          <span className="value">{Math.round(stats.completionRate)}%</span>
        </div>
      </div>
      <button
        className={`toggle-btn ${todayCompleted ? 'completed' : ''}`}
        onClick={handleToggle}
      >
        {todayCompleted ? '✓ Done Today' : 'Mark as Done'}
      </button>
    </div>
  );
}

export default HabitCard;
