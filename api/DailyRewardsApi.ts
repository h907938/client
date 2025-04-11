import { DailyRewardsEvent } from '../events/DailyRewardsEvent';

export class DailyRewardsApi {
    private static _instance: DailyRewardsApi;

    public static get instance(): DailyRewardsApi {
        if (!this._instance) this._instance = new DailyRewardsApi();
        return this._instance;
    }

    public show(): void {
        document.dispatchEvent(new CustomEvent(DailyRewardsEvent.SHOW_REWARDS));
    }

    public hide(): void {
        document.dispatchEvent(new CustomEvent(DailyRewardsEvent.HIDE_REWARDS));
    }

    public toggle(): void {
        document.dispatchEvent(new CustomEvent(DailyRewardsEvent.TOGGLE_REWARDS));
    }
}