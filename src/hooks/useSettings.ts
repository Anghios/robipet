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
    switch (settings.currency) {
      case 'usd': return '$';
      case 'gbp': return '£';
      default: return '€';
    }
  };

  const getCurrencyIcon = () => {
    switch (settings.currency) {
      case 'usd': return 'mdi:currency-usd';
      case 'gbp': return 'mdi:currency-gbp';
      default: return 'mdi:currency-eur';
    }
  };

  const getDateFormat = () => {
    return settings.dateFormat || 'dmySlash';
  };

  const getWeightUnitLabel = () => {
    return settings.weightUnit === 'lb' ? 'lb' : 'kg';
  };

  const formatWeight = (valueInKg: number | string | null | undefined): string => {
    if (valueInKg == null || valueInKg === '') return '';
    const num = typeof valueInKg === 'string' ? parseFloat(valueInKg) : valueInKg;
    if (isNaN(num)) return '';
    if (settings.weightUnit === 'lb') {
      return (num * 2.20462).toFixed(1);
    }
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  return { settings, loading, updateSetting, getCurrencySymbol, getCurrencyIcon, getDateFormat, getWeightUnitLabel, formatWeight };
};
