import { NitroEvent } from '@nitrots/nitro-renderer';

export class DailyRewardsEvent extends NitroEvent {
    public static readonly SHOW_REWARDS = 'DRE_SHOW_REWARDS';
    public static readonly HIDE_REWARDS = 'DRE_HIDE_REWARDS';
    public static readonly TOGGLE_REWARDS = 'DRE_TOGGLE_REWARDS';
    public static readonly UPDATE_REWARDS = 'DRE_UPDATE_REWARDS';

    constructor(type: string) {
        super(type);
    }
}

export class DailyRewardsUpdateEvent extends DailyRewardsEvent {
    constructor(
        public readonly rewards: any[],
        public readonly currentStreak: number,
        public readonly nextRewardIn: number
    ) {
        super(DailyRewardsEvent.UPDATE_REWARDS);
    }
}