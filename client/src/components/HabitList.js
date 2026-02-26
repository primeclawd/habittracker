import React, { useState, useEffect } from 'react';
import '../styles/HabitList.css';
import HabitCard from './HabitCard';

function HabitList({ habits, token, onDeleteHabit }) {
  return (
    <div className="habit-list">
      {habits.length === 0 ? (
        <p className="empty-state">No habits yet. Add one to get started!</p>
      ) : (
        habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            token={token}
            onDelete={onDeleteHabit}
          />
        ))
      )}
    </div>
  );
}

export default HabitList;
