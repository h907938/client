import { IMessageEvent, IncomingMessage } from '@nitrots/nitro-renderer';
import { DailyRewardsUpdateParser } from './DailyRewardsUpdateParser';

export class DailyRewardsMessageEvent implements IMessageEvent {
    private _callback: (event: DailyRewardsMessageEvent) => void;
    private _parser: DailyRewardsUpdateParser;

    constructor(callback: (event: DailyRewardsMessageEvent) => void) {
        console.debug('[DailyRewardsMessageEvent] Constructor fired');
        this._callback = callback;
        this._parser = new DailyRewardsUpdateParser();
    }

    getParser(): DailyRewardsUpdateParser {
        return this._parser;
    }

    handle(incoming: IncomingMessage): void {
        console.group('[DailyRewardsMessageEvent] Handling incoming message');

        // Log the raw incoming message
        console.debug('Raw IncomingMessage:', incoming);

        try {
            // Flush any previous data
            this._parser.flush();

            // Parse the incoming message
            const parseResult = this._parser.parse(incoming);
            console.debug('Parse result:', parseResult);

            if (parseResult) {
                console.debug('Parsed data:', {
                    rewards: this._parser.rewards,
                    currentStreak: this._parser.currentStreak,
                    nextRewardIn: this._parser.nextRewardIn
                });
            } else {
                console.warn('[DailyRewardsMessageEvent] Parsing failed.');
            }

            // Execute the callback with the parsed data
            this._callback(this);
        } catch (err) {
            console.error('[DailyRewardsMessageEvent] Error during parsing:', err);
        }

        console.groupEnd();
    }
}
