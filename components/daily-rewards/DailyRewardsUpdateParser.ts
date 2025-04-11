import { IMessageParser, IIncomingMessage } from '@nitrots/nitro-renderer';

export class DailyRewardsUpdateParser implements IMessageParser {
    private _rewards: any[] = [];
    private _currentStreak: number = 0;
    private _nextRewardIn: number = 0;

    public flush(): boolean {
        console.debug('[DailyRewardsParser] Flushing previous data');
        this._rewards = [];
        this._currentStreak = 0;
        this._nextRewardIn = 0;
        return true;
    }

    public parse(message: IIncomingMessage): boolean {
        console.groupCollapsed('[DailyRewardsParser] Parsing message');
        try {
            // Parse reward count
            const rewardCount = message.readInt();
            console.log(`Found ${rewardCount} rewards`);

            this._rewards = [];
            for (let i = 0; i < rewardCount; i++) {
                const reward = {
                    day: message.readInt(),
                    type: message.readInt(),
                    amount: message.readInt(),
                    claimed: message.readBoolean(),
                    unseen: message.readBoolean()
                };
                console.log(`Reward ${i+1}:`, reward);
                this._rewards.push(reward);
            }

            this._currentStreak = message.readInt();
            this._nextRewardIn = message.readInt();

            console.log(`Current streak: ${this._currentStreak}`);
            console.log(`Next reward in: ${this._nextRewardIn} hours`);

            return true;
        } catch (e) {
            console.error('Parsing error:', e);
            return false;
        } finally {
            console.groupEnd();
        }
    }

    public get rewards(): any[] {
        return this._rewards;
    }

    public get currentStreak(): number {
        return this._currentStreak;
    }

    public get nextRewardIn(): number {
        return this._nextRewardIn;
    }
}