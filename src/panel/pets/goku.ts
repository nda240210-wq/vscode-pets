import { PetColor } from '../../common/types';
import { BasePetType } from '../basepettype';
import { States } from '../states';

export class Goku extends BasePetType {
    label = 'goku';
    static possibleColors = [PetColor.default];

    // Trạng thái Ultra Instinct
    private isUI: boolean = false;
    private isTransforming: boolean = false;
    private uiTimer: NodeJS.Timeout | null = null;

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

    // 1. Tùy chỉnh thời gian ngẫu nhiên cho từng trạng thái (Idle 5-10s, Run/Walk 10-15s)
    override nextState(): void {
        if (this.isTransforming) return; // Đang gồng biến hình thì không đổi trạng thái

        super.nextState();

        let holdDuration = 5000; // Mặc định

        // Kiểm tra trạng thái hiện tại để set Timer ngẫu nhiên
        if (this.currentStateEnum === States.sitIdle || this.currentStateEnum === States.lie) {
            // Tĩnh / Hoạt động nhẹ: Duy trì từ 5s đến 10s (5000ms - 10000ms)
            holdDuration = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
        } else if (
            this.currentStateEnum === States.runRight ||
            this.currentStateEnum === States.runLeft ||
            this.currentStateEnum === States.walkRight ||
            this.currentStateEnum === States.walkLeft
        ) {
            // Di chuyển / Chạy: Duy trì từ 10s đến 15s (10000ms - 15000ms)
            holdDuration = Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;
        }

        // Đặt lại thời gian chuyển State tiếp theo cho extension
        if (this._stateResetTimer) {
            clearTimeout(this._stateResetTimer);
        }
        this._stateResetTimer = setTimeout(() => this.nextState(), holdDuration);
    }

    // 2. Xử lý khi bắt bóng -> Hóa Ultra Instinct
    override postTransformWorld(): void {
        super.postTransformWorld();
        
        // Nhặt được bóng -> Kích hoạt chuỗi biến hình UI
        if (this.currentStateEnum === States.idleWithBall && !this.isUI && !this.isTransforming) {
            this.triggerUltraInstinct();
        }
    }

    private triggerUltraInstinct(): void {
        this.isTransforming = true;

        // Bước A: Chạy GIF Biến hình UI (ui_transform.gif)
        this.setCustomSprite('ui_transform.gif');

        // Chờ 2 giây cho GIF biến hình chạy xong
        setTimeout(() => {
            this.isTransforming = false;
            this.isUI = true;

            // Bước B: Chuyển sang GIF Duy trì UI (ui_loop.gif)
            this.setCustomSprite('ui_loop.gif');

            // Bước C: Duy trì UI đúng 10 giây rồi về Base
            if (this.uiTimer) clearTimeout(this.uiTimer);
            this.uiTimer = setTimeout(() => {
                this.revertToBase();
            }, 10000); // 10s = 10000ms
        }, 2000);
    }

    private revertToBase(): void {
        this.isUI = false;
        this.removeCustomSprite(); // Trở lại sprite mặc định của State Machine
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
