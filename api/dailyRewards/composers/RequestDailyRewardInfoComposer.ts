import { IMessageComposer } from '@nitrots/nitro-renderer';

export class RequestDailyRewardInfoComposer implements IMessageComposer<ConstructorParameters<typeof RequestDailyRewardInfoComposer>>
{
    public static readonly MESSAGE_ID: number = 4002;
    
    private _data: any[] = [];

    public getMessageArray(): any[]
    {
        return this._data;
    }

    public dispose(): void
    {
        this._data = null;
    }

    public get disposed(): boolean
    {
        return this._data === null;
    }
}