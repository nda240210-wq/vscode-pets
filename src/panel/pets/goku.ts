import { PetColor, PetSpeed } from '../../common/types';
import { BasePetType } from '../basepettype';

export class Goku extends BasePetType {
  label = 'goku';

  constructor(color: PetColor, speed: PetSpeed) {
    super(color, speed);
  }

  override get possibleColors(): PetColor[] {
    return [PetColor.default];
  }
}
