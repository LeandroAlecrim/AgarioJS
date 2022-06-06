class Food extends Circle {
  /** Cria um objeto Food */
  constructor({ centerX, centerY, radius, color, isTrap = false }) {
    super({ centerX, centerY, radius, color });
    this.isTrap = isTrap;
  }
}
