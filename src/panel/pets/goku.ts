import { PetColor, PetSpeed, PetState } from '../../common/types';
import { BasePetType } from '../basepettype';

export class Goku extends BasePetType {
  label = 'goku';
  
  // Trạng thái biến hình UI
  private isUI: boolean = false;
  private isTransforming: boolean = false;
  private uiTimer: NodeJS.Timeout | null = null;

  constructor(color: PetColor, speed: PetSpeed) {
    super(color, speed);
    this.startRandomBehavior();
  }

  override get possibleColors(): PetColor[] {
    return [PetColor.default];
  }

  // 1. Quản lý chuyển đổi hành động ngẫu nhiên (Idle 5-10s <-> Run 10-15s)
  private startRandomBehavior(): void {
    if (this.isUI || this.isTransforming || this.isChasingBall) return;

    // Tỉ lệ 50% đứng chơi ngẫu nhiên, 50% chạy
    const isRunning = Math.random() > 0.5;

    if (isRunning) {
      // Chạy trong 10 - 15 giây
      this.setState(PetState.run);
      const runDuration = Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;
      
      setTimeout(() => {
        this.startRandomBehavior();
      }, runDuration);
    } else {
      // Đứng yên / Hoạt động nhẹ trong 5 - 10 giây
      this.setState(PetState.idle);
      const idleDuration = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
      
      setTimeout(() => {
        this.startRandomBehavior();
      }, idleDuration);
    }
  }

  // 2. Xử lý khi thả bóng & nhặt được bóng
  override onChaseBall(): void {
    // Goku chạy đuổi theo bóng
    this.setState(PetState.run);
  }

  override onCatchBall(): void {
    // Khi chạm vào bóng -> Thức tỉnh Ultra Instinct
    this.activateUltraInstinct();
  }

  // 3. Logic Hóa UI bằng 2 GIF
  private activateUltraInstinct(): void {
    if (this.isUI || this.isTransforming) return;

    this.isTransforming = true;

    // Bước A: Chạy GIF Biến hình UI (ui_transform.gif)
    this.setCustomSprite('ui_transform.gif');

    // Giả định GIF biến hình chạy trong ~1.5 - 2 giây
    setTimeout(() => {
      this.isTransforming = false;
      this.isUI = true;

      // Bước B: Chuyển sang GIF Duy trì UI (ui_loop.gif)
      this.setCustomSprite('ui_loop.gif');

      // Bước C: Duy trì trạng thái UI đúng 10 giây
      if (this.uiTimer) clearTimeout(this.uiTimer);
      this.uiTimer = setTimeout(() => {
        this.revertToBaseForm();
      }, 10000); // 10s = 10000ms

    }, 2000); // Thời gian chờ chạy xong GIF gồng biến hình
  }

  // Trở về dạng Base
  private revertToBaseForm(): void {
    this.isUI = false;
    this.startRandomBehavior();
  }
}
