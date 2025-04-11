import { IMessageEvent } from '@nitrots/nitro-renderer';
import { DailyRewardsUpdateParser } from './DailyRewardsUpdateParser';

export class DailyRewardsMessageEvent implements IMessageEvent {
    public static readonly MESSAGE_TYPE = 'DailyRewardsMessageEvent';
    
    private _parser: DailyRewardsUpdateParser;
    private _callback: Function;

    constructor(callback: Function) {
        console.debug('[DailyRewardsEvent] Creating new message event handler');
        this._parser = new DailyRewardsUpdateParser();
        this._callback = callback;
    }

    public getParser(): DailyRewardsUpdateParser {
        return this._parser;
    }

    public dispose(): void {
        this._parser = null;
        this._callback = null;
    }

    public get disposed(): boolean {
        return this._parser === null;
    }

    public handle(message: IIncomingMessage): void {
        console.groupCollapsed('[DailyRewardsEvent] Handling incoming message');
        try {
            console.log('Raw message:', message);
            
            if (!this._parser) {
                console.error('Parser not initialized!');
                return;
            }

            // Flush previous data
            this._parser.flush();

            // Parse new data
            if (this._parser.parse(message)) {
                console.log('Parsing successful, executing callback...');
                this._callback(this);
            } else {
                console.error('Parsing failed!');
            }
        } catch (e) {
            console.error('Error handling message:', e);
        } finally {
            console.groupEnd();
        }
    }
}