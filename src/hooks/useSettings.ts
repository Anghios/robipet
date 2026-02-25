import { useState, useEffect, useCallback } from 'react';

interface Settings {
  currency: string;
  [key: string]: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({ currency: 'eur' });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/settings', { headers });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSetting = async (key: string, value: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ key, value })
      });

      if (response.ok) {
        setSettings(prev => ({ ...prev, [key]: value }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  };

  const getCurrencySymbol = () => {
    return settings.currency === 'usd' ? '$' : '€';
  };

  const getCurrencyIcon = () => {
    return settings.currency === 'usd' ? 'mdi:currency-usd' : 'mdi:currency-eur';
  };

  const getDateFormat = () => {
    return settings.dateFormat || 'dmySlash';
  };

  return { settings, loading, updateSetting, getCurrencySymbol, getCurrencyIcon, getDateFormat };
};
