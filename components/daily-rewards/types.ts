export interface DailyReward {
    day: number;
    type: 'credits' | 'duckets' | 'diamonds' | 'furniture' | 'badge';
    amount: number;
    data?: string;
    isBonus: boolean;
}

export interface DailyRewardState {
    currentStreak: number;
    canClaim: boolean;
    rewards: DailyReward[];
}