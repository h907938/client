import { NitroEvent } from '@nitrots/nitro-renderer';
import DailyRewardsEventEmitter, { DailyRewardsEvent } from '../events/DailyRewardsEventEmitter';


// Define the DailyRewardsEvent class
export class DailyRewardsEvent extends NitroEvent {
    public static SHOW_REWARDS: string = 'DRE_SHOW_REWARDS';
    public static HIDE_REWARDS: string = 'DRE_HIDE_REWARDS';
    public static UPDATE_REWARDS: string = 'DRE_UPDATE_REWARDS';

    constructor(type: string) {
        super(type);
    }
}

// Define the DailyRewardsUpdateEvent class
export class DailyRewardsUpdateEvent extends DailyRewardsEvent {
    constructor(
        public readonly rewards: any[],
        public readonly currentStreak: number,
        public readonly nextRewardIn: number
    ) {
        super(DailyRewardsEvent.UPDATE_REWARDS);
    }
}

export default class DailyRewardsEventEmitter {
    private static _listeners: Map<string, Function[]> = new Map();

    public static emit(event: DailyRewardsEvent): void {
        console.log(`Emitting event: ${event.type}`); // Log event emission

        const listeners = this._listeners.get(event.type);
        if (listeners) {
            listeners.forEach(callback => {
                console.log(`Calling listener for event: ${event.type}`);
                callback(event);
            });
        }
    }

    public static addListener(type: string, callback: Function): void {
        if (!this._listeners.has(type)) {
            this._listeners.set(type, []);
        }
        this._listeners.get(type).push(callback);
        console.log(`Added listener for event: ${type}`);
    }

    public static removeListener(type: string, callback: Function): void {
        const listeners = this._listeners.get(type);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index !== -1) listeners.splice(index, 1);
            console.log(`Removed listener for event: ${type}`);
        }
    }
}
