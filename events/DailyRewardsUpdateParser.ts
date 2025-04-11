import { IMessageParser, IncomingMessage } from '@nitrots/nitro-renderer';

export class DailyRewardsUpdateParser implements IMessageParser {
    public rewards: any[] = [];
    public currentStreak: number = 0;
    public nextRewardIn: number = 0;

    public flush(): boolean {
        console.debug('[DailyRewardsUpdateParser] Flushing previous state');
        this.rewards = [];
        this.currentStreak = 0;
        this.nextRewardIn = 0;
        return true;
    }

    public parse(incoming: IncomingMessage): boolean {
        console.group('[DailyRewardsUpdateParser] Parsing incoming message');

        // Parsing reward count
        const rewardCount = incoming.readInt();
        console.debug(`Reward count: ${rewardCount}`);

        // Parsing rewards
        for (let i = 0; i < rewardCount; i++) {
            const day = incoming.readInt();
            const rewardType = incoming.readInt();
            const amount = incoming.readInt();

            const reward = { day, rewardType, amount };
            console.debug(`Parsed reward #${i + 1}:`, reward);

            this.rewards.push(reward);
        }

        // Parsing current streak and next reward time
        this.currentStreak = incoming.readInt();
        this.nextRewardIn = incoming.readInt();

        console.debug('Parsed currentStreak:', this.currentStreak);
        console.debug('Parsed nextRewardIn:', this.nextRewardIn);

        console.groupEnd();
        return true;
    }
}
