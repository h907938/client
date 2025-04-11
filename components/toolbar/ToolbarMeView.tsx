import { MouseEventType, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { Dispatch, FC, PropsWithChildren, SetStateAction, useEffect, useRef, useState } from 'react';
import {
    CreateLinkEvent,
    DispatchUiEvent,
    GetConfiguration,
    GetRoomEngine,
    GetRoomSession,
    GetSessionDataManager,
    GetUserProfile
} from '../../api';
import { Base, Flex, LayoutItemCountView } from '../../common';
import { GuideToolEvent } from '../../events';
import { DailyRewardsApi } from '../../api/DailyRewardsApi';

interface ToolbarMeViewProps {
    useGuideTool: boolean;
    unseenAchievementCount: number;
    setMeExpanded: Dispatch<SetStateAction<boolean>>;
    unseenDailyRewards: number;
}

export const ToolbarMeView: FC<PropsWithChildren<ToolbarMeViewProps>> = props => {
    console.groupCollapsed('[ToolbarMeView] Component initialization');
    console.log('[ToolbarMeView] Props received:', props);
    
    const {
        useGuideTool = false,
        unseenAchievementCount = 0,
        unseenDailyRewards = 0,
        setMeExpanded = null,
        children = null,
        ...rest
    } = props;

    console.log('[ToolbarMeView] Processed props:', {
        useGuideTool,
        unseenAchievementCount,
        unseenDailyRewards,
        setMeExpanded: !!setMeExpanded,
        children: !!children
    });

    const elementRef = useRef<HTMLDivElement>();
    console.log('[ToolbarMeView] Element ref initialized:', elementRef.current);

    const [isRewardsLoading, setIsRewardsLoading] = useState(false);
    const [lastRewardsError, setLastRewardsError] = useState<string | null>(null);
    console.log('[ToolbarMeView] State initialized:', {
        isRewardsLoading,
        lastRewardsError
    });

    console.groupEnd();

    const handleRewardsClick = () => {
        console.groupCollapsed('[ToolbarMeView] Handling rewards click');
        try {
            console.log('[ToolbarMeView] Setting loading state to true');
            setIsRewardsLoading(true);
            setLastRewardsError(null);

            console.log('[ToolbarMeView] Checking DailyRewardsApi availability:', {
                exists: !!DailyRewardsApi,
                hasToggle: DailyRewardsApi && typeof DailyRewardsApi.toggle === 'function'
            });

            if (DailyRewardsApi && typeof DailyRewardsApi.toggle === 'function') {
                console.log('[ToolbarMeView] Calling DailyRewardsApi.toggle()');
                DailyRewardsApi.toggle();
            } else {
                console.log('[ToolbarMeView] Falling back to CreateLinkEvent');
                console.log('[ToolbarMeView] Dispatching daily-rewards/toggle event');
                CreateLinkEvent('daily-rewards/toggle');
            }
        } catch (error) {
            console.error('[ToolbarMeView] Error in handleRewardsClick:', error);
            setLastRewardsError(error.message);
            console.log('[ToolbarMeView] Error state set:', error.message);
        } finally {
            console.log('[ToolbarMeView] Setting loading state to false');
            setIsRewardsLoading(false);
            console.log('[ToolbarMeView] Final state:', {
                isRewardsLoading,
                lastRewardsError
            });
        }
        console.groupEnd();
    };

    useEffect(() => {
        console.groupCollapsed('[ToolbarMeView] Room selection effect');
        try {
            const roomSession = GetRoomSession();
            console.log('[ToolbarMeView] Current room session:', roomSession);

            if (!roomSession) {
                console.warn('[ToolbarMeView] No room session found');
                return;
            }

            console.log('[ToolbarMeView] Selecting own room object:', {
                roomId: roomSession.roomId,
                roomIndex: roomSession.ownRoomIndex
            });
            
            GetRoomEngine().selectRoomObject(roomSession.roomId, roomSession.ownRoomIndex, RoomObjectCategory.UNIT);
        } catch (error) {
            console.error('[ToolbarMeView] Error in room selection effect:', error);
        }
        console.groupEnd();
    }, []);

    useEffect(() => {
        console.groupCollapsed('[ToolbarMeView] Click listener effect');
        console.log('[ToolbarMeView] Setting up global click listener');
        
        const onClick = (event: MouseEvent) => {
            console.log('[ToolbarMeView] Global click detected:', event.target);
            if (setMeExpanded) {
                console.log('[ToolbarMeView] Collapsing me menu');
                setMeExpanded(false);
            }
        };

        document.addEventListener('click', onClick);
        console.log('[ToolbarMeView] Listener added');

        return () => {
            console.log('[ToolbarMeView] Cleaning up click listener');
            document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
        };
    }, [setMeExpanded]);

    console.groupCollapsed('[ToolbarMeView] Rendering component');
    console.log('[ToolbarMeView] Current state:', {
        isRewardsLoading,
        lastRewardsError
    });

    const guidesEnabled = GetConfiguration('guides.enabled');
    console.log('[ToolbarMeView] Guide tool configuration:', {
        guidesEnabled,
        useGuideTool
    });

    const renderOutput = (
        <Flex innerRef={elementRef} alignItems="center" className="nitro-toolbar-me p-2" gap={2}>
            {guidesEnabled && useGuideTool && (
                <Base
                    pointer
                    className="navigation-item icon icon-me-helper-tool"
                    onClick={event => {
                        console.log('[ToolbarMeView] Guide tool button clicked');
                        DispatchUiEvent(new GuideToolEvent(GuideToolEvent.TOGGLE_GUIDE_TOOL));
                    }}
                />
            )}

            {/* Achievements Button */}
            <Base
                pointer
                className="navigation-item icon icon-me-achievements"
                onClick={() => {
                    console.log('[ToolbarMeView] Achievements button clicked');
                    CreateLinkEvent('achievements/toggle');
                }}
            >
                {unseenAchievementCount > 0 && (
                    <LayoutItemCountView count={unseenAchievementCount} />
                )}
            </Base>

            {/* Daily Rewards Button */}
            <Base
                pointer
                className="navigation-item icon icon-me-rewards"
                onClick={() => {
                    console.log('[ToolbarMeView] Daily rewards button clicked');
                    handleRewardsClick();
                }}
            >
                {unseenDailyRewards > 0 && (
                    <LayoutItemCountView count={unseenDailyRewards} />
                )}
                {isRewardsLoading && (
                    <div style={{ position: 'absolute', top: 0, right: 0 }}>
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </Base>

            <Base 
                pointer 
                className="navigation-item icon icon-me-profile" 
                onClick={() => {
                    const userId = GetSessionDataManager().userId;
                    console.log('[ToolbarMeView] Profile button clicked for user:', userId);
                    GetUserProfile(userId);
                }} 
            />
            
            <Base 
                pointer 
                className="navigation-item icon icon-me-rooms" 
                onClick={() => {
                    console.log('[ToolbarMeView] Rooms button clicked');
                    CreateLinkEvent('navigator/search/myworld_view');
                }} 
            />
            
            <Base 
                pointer 
                className="navigation-item icon icon-me-clothing" 
                onClick={() => {
                    console.log('[ToolbarMeView] Clothing button clicked');
                    CreateLinkEvent('avatar-editor/toggle');
                }} 
            />
            
            <Base 
                pointer 
                className="navigation-item icon icon-me-settings" 
                onClick={() => {
                    console.log('[ToolbarMeView] Settings button clicked');
                    CreateLinkEvent('user-settings/toggle');
                }} 
            />
            
            {children}
        </Flex>
    );

    console.log('[ToolbarMeView] Render output:', renderOutput);
    console.groupEnd();

    return renderOutput;
};