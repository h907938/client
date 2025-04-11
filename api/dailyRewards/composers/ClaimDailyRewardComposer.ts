import { IMessageComposer } from '@nitrots/nitro-renderer';

export class ClaimDailyRewardComposer implements IMessageComposer {
    getMessageArray(): any[] {
        return [];
    }

    dispose(): void {
        // Nothing to clean up
    }

    get disposed(): boolean {
        return false;
    }
}
