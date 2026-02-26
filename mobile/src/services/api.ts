const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  async register(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async getHabits(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/habits`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch habits');
    return data;
  },

  async createHabit(token: string, habit: { name: string; description: string; frequency: string }) {
    const response = await fetch(`${API_BASE_URL}/api/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(habit),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create habit');
    return data;
  },

  async deleteHabit(token: string, habitId: number) {
    const response = await fetch(`${API_BASE_URL}/api/habits/${habitId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete habit');
    return response.json();
  },

  async getLogs(token: string, habitId: number) {
    const response = await fetch(`${API_BASE_URL}/api/logs/${habitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch logs');
    return data;
  },

  async logHabit(token: string, habitId: number, date: string, completed: boolean) {
    const response = await fetch(`${API_BASE_URL}/api/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ habitId, date, completed }),
    });
    if (!response.ok) throw new Error('Failed to log habit');
    return response.json();
  },

  async getStats(token: string, habitId: number) {
    const response = await fetch(`${API_BASE_URL}/api/stats/${habitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch stats');
    return data;
  },
};
