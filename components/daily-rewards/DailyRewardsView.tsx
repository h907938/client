import { FC, useEffect, useState, useRef } from 'react';
import { AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker, GetCommunication, SendMessageComposer } from '../../api';
import { Base, Column, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../common';
import { useDailyRewards } from '../../hooks/useDailyRewards';
import { DailyRewardsMessageEvent } from '../../events/DailyRewardsMessageEvent';
import { RequestDailyRewardInfoComposer } from "../../api/dailyRewards/composers/RequestDailyRewardInfoComposer";

export const DailyRewardsView: FC = () => {
    const componentId = useRef(Math.random().toString(36).substring(2, 9));
    const [isVisible, setIsVisible] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);
    const [lastRequestTime, setLastRequestTime] = useState<string>(new Date().toISOString());
    
    const {
        rewardItems,
        currentStreak,
        nextRewardIn,
        unseenCount,
        isLoading,
        updateRewards
    } = useDailyRewards();

    const requestRewardsData = () => {
        try {
            const communication = GetCommunication();
            if (!communication) {
                throw new Error('Communication system not available');
            }

            console.log('[DailyRewards] Sending request to emulator...');
            setLastRequestTime(new Date().toISOString());
            SendMessageComposer(new RequestDailyRewardInfoComposer());
        } catch (error) {
            console.error('[DailyRewards] Request failed:', error);
            setLastError('Failed to contact emulator');
        }
    };

    useEffect(() => {
        const onMessageEvent = (event: DailyRewardsMessageEvent) => {
            try {
                const parser = event.getParser();
                
                if (!parser) {
                    throw new Error('Invalid parser received');
                }

                if (!parser.rewards || !Array.isArray(parser.rewards)) {
                    throw new Error('Invalid rewards data format');
                }

                console.log('[DailyRewards] Received valid data:', {
                    streak: parser.currentStreak,
                    rewardCount: parser.rewards.length,
                    nextRewardIn: parser.nextRewardIn
                });

                updateRewards(parser.rewards, parser.currentStreak, parser.nextRewardIn);
                setIsVisible(true);
                setLastError(null);
            } catch (error) {
                console.error('[DailyRewards] Message processing error:', error);
                setLastError('Invalid data from emulator');
                // Retry after error
                setTimeout(requestRewardsData, 3000);
            }
        };

        const messageEvent = new DailyRewardsMessageEvent(onMessageEvent);
        const communication = GetCommunication();

        if (!communication) {
            console.error('[DailyRewards] Fatal: Communication system unavailable');
            setLastError('System error - please refresh');
            return;
        }

        communication.registerMessageEvent(messageEvent);
        requestRewardsData();

        // Set timeout for emulator response
        const timeout = setTimeout(() => {
            if (isLoading) {
                console.warn('[DailyRewards] Timeout waiting for emulator response');
                setLastError('Emulator timeout - retrying...');
                requestRewardsData();
            }
        }, 10000);

        return () => {
            communication.removeMessageEvent(messageEvent);
            clearTimeout(timeout);
        };
    }, [updateRewards, isLoading]);

    useEffect(() => {
        const linkTracker = {
            linkReceived: (url: string) => {
                try {
                    const parts = url.split('/');
                    if (parts.length < 2) return;

                    const action = parts[1];
                    console.log(`[DailyRewards] Handling action: ${action}`);

                    switch (action) {
                        case 'show': 
                            setIsVisible(true);
                            requestRewardsData();
                            break;
                        case 'hide': 
                            setIsVisible(false); 
                            break;
                        case 'toggle': 
                            setIsVisible(prev => {
                                if (!prev) requestRewardsData();
                                return !prev;
                            });
                            break;
                        case 'retry':
                            requestRewardsData();
                            break;
                    }
                } catch (error) {
                    console.error('[DailyRewards] Link handler error:', error);
                }
            },
            eventUrlPrefix: 'daily-rewards/'
        };

        AddEventLinkTracker(linkTracker);
        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    if (!isVisible) return null;

    return (
        <NitroCardView uniqueKey="daily-rewards" theme="primary-slim">
            <NitroCardHeaderView
                headerText={LocalizeText('dailyrewards.title')}
                onCloseClick={() => setIsVisible(false)}
            />
            <NitroCardContentView>
                {isLoading || lastError ? (
                    <>
                        <Text>{lastError || 'Loading rewards...'}</Text>
                        <Base className="debug-panel">
                            <Text small bold>Communication Status:</Text>
                            <Text small>{lastError ? 'Error' : 'Waiting for emulator...'}</Text>
                            <Text small>Last request: {lastRequestTime}</Text>
                            {lastError && (
                                <Text 
                                    small 
                                    underline 
                                    pointer 
                                    onClick={requestRewardsData}
                                >
                                    Click to retry
                                </Text>
                            )}
                        </Base>
                    </>
                ) : (
                    <Column gap={1}>
                        <Text bold>
                            {LocalizeText('dailyrewards.streak', ['days'], [currentStreak.toString()])}
                        </Text>
                        <Base className="debug-panel">
                            <Text small bold>Rewards Details:</Text>
                            <Text small>Current Streak: {currentStreak} days</Text>
                            <Text small>Next reward in: {nextRewardIn} hours</Text>
                            <Text small>Available rewards: {rewardItems.length}</Text>
                            {rewardItems.length > 0 && (
                                <>
                                    <Text small>Next reward: Day {rewardItems[0].day}</Text>
                                    <Text small>Reward type: {rewardItems[0].type}</Text>
                                </>
                            )}
                        </Base>
                    </Column>
                )}
            </NitroCardContentView>
        </NitroCardView>
    );
};