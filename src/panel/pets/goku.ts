import { PetColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

export class Goku extends BasePetType {
    label = 'goku';
    static possibleColors = [PetColor.default];

    // Trạng thái Ultra Instinct
    private isUI: boolean = false;
    private isTransforming: boolean = false;
    private uiTimer: ReturnType<typeof setTimeout> | null = null;
    private _stateResetTimer: ReturnType<typeof setTimeout> | null = null;

    // Map tên file GIF tương ứng với từng State
    get spriteDefinitions(): { [key: string]: string } {
        return {
            'sit-idle': 'idle_8fps.gif',
            'lie': 'lie_8fps.gif',
            'walk-right': 'walk_8fps.gif',
            'walk-left': 'walk_8fps.gif',
            'run-right': 'run_8fps.gif',
            'run-left': 'run_8fps.gif',
            'chase-right': 'run_8fps.gif',
            'chase-left': 'run_8fps.gif',
            'swipe': 'swipe_8fps.gif',
            'eat': 'eat_8fps.gif',
            'kick': 'kick_8fps.gif',
            'combo': 'combo_8fps.gif',
            'ui-transform': 'ui_transform.gif',
            'ui-loop': 'ui_loop.gif',
        };
    }

    sequence = {
        startingState: States.sitIdle,
        sequenceStates: [
            {
                state: States.sitIdle,
                possibleNextStates: [
                    States.lie,
                    States.walkRight,
                    States.walkLeft,
                    States.runRight,
                    States.runLeft,
                ],
            },
            {
                state: States.lie,
                possibleNextStates: [
                    States.walkRight,
                    States.walkLeft,
                    States.runRight,
                    States.runLeft,
                ],
            },
            {
                state: States.walkRight,
                possibleNextStates: [
                    States.sitIdle,
                    States.walkLeft,
                    States.runLeft,
                ],
            },
            {
                state: States.walkLeft,
                possibleNextStates: [
                    States.sitIdle,
                    States.walkRight,
                    States.runRight,
                ],
            },
            {
                state: States.runRight,
                possibleNextStates: [
                    States.lie,
                    States.sitIdle,
                    States.walkLeft,
                    States.runLeft,
                ],
            },
            {
                state: States.runLeft,
                possibleNextStates: [
                    States.lie,
                    States.sitIdle,
                    States.walkRight,
                    States.runRight,
                ],
            },
            {
                state: States.chase,
                possibleNextStates: [States.idleWithBall],
            },
            {
                state: States.idleWithBall,
                possibleNextStates: [
                    States.lie,
                    States.walkRight,
                    States.walkLeft,
                    States.runRight,
                    States.runLeft,
                ],
            },
        ],
    };

    // 1. Quản lý thời gian ngẫu nhiên (Idle 5-10s, Run/Walk 10-15s)
    override nextState(): void {
        if (this.isTransforming) return;

        super.nextState();

        let holdDuration = 5000;

        if (
            this.currentStateEnum === States.sitIdle ||
            this.currentStateEnum === States.lie
        ) {
            // Trạng thái tĩnh: 5 đến 10 giây
            holdDuration =
                Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
        } else if (
            this.currentStateEnum === States.runRight ||
            this.currentStateEnum === States.runLeft ||
            this.currentStateEnum === States.walkRight ||
            this.currentStateEnum === States.walkLeft
        ) {
            // Trạng thái di chuyển: 10 đến 15 giây
            holdDuration =
                Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;
        }

        if (this._stateResetTimer) {
            clearTimeout(this._stateResetTimer);
        }
        this._stateResetTimer = setTimeout(
            () => this.nextState(),
            holdDuration,
        );
    }

    // 2. Kích hoạt hóa UI khi nhặt bóng
    override postTransformWorld(): void {
        super.postTransformWorld();

        if (
            this.currentStateEnum === States.idleWithBall &&
            !this.isUI &&
            !this.isTransforming
        ) {
            this.triggerUltraInstinct();
        }
    }

    private setCustomSprite(spriteFileName: string): void {
        if (this.el) {
            this.el.src = `${this.petRoot}/${spriteFileName}`;
        }
    }

    private removeCustomSprite(): void {
        if (typeof (this as any).refreshState === 'function') {
            (this as any).refreshState();
        } else {
            this.nextState();
        }
    }

    private triggerUltraInstinct(): void {
        this.isTransforming = true;

        // Bật GIF gồng biến hình UI
        this.setCustomSprite('ui_transform.gif');

        // Sau 2 giây chuyển sang GIF duy trì UI
        setTimeout(() => {
            this.isTransforming = false;
            this.isUI = true;

            this.setCustomSprite('ui_loop.gif');

            // Giữ dạng UI trong đúng 10 giây
            if (this.uiTimer) clearTimeout(this.uiTimer);
            this.uiTimer = setTimeout(() => {
                this.revertToBase();
            }, 10000);
        }, 2000);
    }

    private revertToBase(): void {
        this.isUI = false;
        this.removeCustomSprite();
        this.nextState();
    }

    get emoji(): string {
        return '🥋';
    }

    get hello(): string {
        return `Kakarot says hello!`;
    }
}

export const GOKU_NAMES: ReadonlyArray<string> = [
    'Goku',
    'Kakarot',
    'Son Goku',
];
