"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FREE_SCAN_LIMIT_PER_DAY } from '@/config/limits';

type SubscriptionStatus = 'free' | 'premium'; // Add more tiers if needed

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
  dailyScans: number;
  incrementScanCount: () => void;
  resetDailyScans: () => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (isOpen: boolean) => void;
  canScan: () => boolean;
  showUpgradeModal: () => void;
  dailyScansToday: () => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('free');
  const [dailyScans, setDailyScans] = useState(0);
  const [lastScanDate, setLastScanDate] = useState<string>('');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const storedStatus = localStorage.getItem('subscriptionStatus') as SubscriptionStatus | null;
    if (storedStatus) setSubscriptionStatus(storedStatus);

    const storedScans = parseInt(localStorage.getItem('dailyScans') || '0', 10);
    const storedDate = localStorage.getItem('lastScanDate') || '';
    
    const today = new Date().toLocaleDateString();
    if (storedDate === today) {
      setDailyScans(storedScans);
    } else {
      // Reset if it's a new day
      localStorage.setItem('dailyScans', '0');
      localStorage.setItem('lastScanDate', today);
      setDailyScans(0);
    }
    setLastScanDate(today);

  }, []);

  const updateLocalStorage = useCallback((status: SubscriptionStatus, scans: number, date: string) => {
    localStorage.setItem('subscriptionStatus', status);
    localStorage.setItem('dailyScans', scans.toString());
    localStorage.setItem('lastScanDate', date);
  }, []);

  useEffect(() => {
    updateLocalStorage(subscriptionStatus, dailyScans, lastScanDate);
  }, [subscriptionStatus, dailyScans, lastScanDate, updateLocalStorage]);


  const incrementScanCount = useCallback(() => {
    const today = new Date().toLocaleDateString();
    if (lastScanDate !== today) { // If it's a new day, reset scans first
      setDailyScans(1);
      setLastScanDate(today);
    } else {
      setDailyScans(prev => prev + 1);
    }
  }, [lastScanDate]);

  const resetDailyScans = useCallback(() => {
    const today = new Date().toLocaleDateString();
    setDailyScans(0);
    setLastScanDate(today);
  }, []);
  
  const canScan = useCallback(() => {
    if (subscriptionStatus === 'premium') return true;
    
    const today = new Date().toLocaleDateString();
    if (lastScanDate !== today) { // New day, can scan
        return true; 
    }
    return dailyScans < FREE_SCAN_LIMIT_PER_DAY;
  }, [subscriptionStatus, dailyScans, lastScanDate]);

  const showUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(true);
  }, []);

  const dailyScansToday = useCallback(() => {
    const today = new Date().toLocaleDateString();
    if (lastScanDate !== today) return 0;
    return dailyScans;
  }, [dailyScans, lastScanDate]);

  return (
    <SubscriptionContext.Provider value={{ 
      subscriptionStatus, 
      setSubscriptionStatus, 
      dailyScans, 
      incrementScanCount, 
      resetDailyScans,
      isUpgradeModalOpen,
      setIsUpgradeModalOpen,
      canScan,
      showUpgradeModal,
      dailyScansToday
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
