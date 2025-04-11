import { useBetween } from 'use-between';
import { useState, useCallback } from 'react';

const useDailyRewardsState = () => {
    console.groupCollapsed('[useDailyRewards] Initializing state');
    const [rewardItems, setRewardItems] = useState<any[]>([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [nextRewardIn, setNextRewardIn] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const updateRewards = useCallback((rewards: any[], streak: number, nextReward: number) => {
        console.groupCollapsed('[useDailyRewards] Updating rewards state');
        try {
            console.log('New rewards data:', {
                rewardsCount: rewards.length,
                currentStreak: streak,
                nextRewardIn: nextReward
            });

            setRewardItems(rewards);
            setCurrentStreak(streak);
            setNextRewardIn(nextReward);
            setIsLoading(false);
        } finally {
            console.groupEnd();
        }
    }, []);

    const unseenCount = rewardItems.filter(item => item.unseen).length;

    console.log('Current state:', {
        rewardItems: rewardItems.length,
        currentStreak,
        nextRewardIn,
        isLoading,
        unseenCount
    });
    console.groupEnd();

    return {
        rewardItems,
        currentStreak,
        nextRewardIn,
        unseenCount,
        isLoading,
        updateRewards
    };
};

export const useDailyRewards = () => useBetween(useDailyRewardsState);