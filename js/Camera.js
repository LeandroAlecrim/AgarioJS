class Camera extends Rectangle {
  /** Cria um novo objeto Camera */
  constructor({ posX, posY, width, height }) {
    super({ posX, posY, width, height });
    this.moveLeft = this.moveRight = this.moveUp = this.moveDown = false;
  }

  /** Atualiza a posição de acordo com a velocidade */
  updatePosition(velocity) {
    const rect = this.rect();

    // horizontal
    if (this.moveLeft && rect.centerX > 0) this.posX -= velocity;
    if (this.moveRight && rect.centerX < GAME_SIZE.width) this.posX += velocity;

    // vertical
    if (this.moveUp && rect.centerY > 0) this.posY -= velocity;
    if (this.moveDown && rect.centerY < GAME_SIZE.height) this.posY += velocity;
  }

  /** Atualiza a direção no sentido de x e y  */
  setDirection({ x = 0, y = 0 }) {
    const rect = this.rect();

    if (x > rect.centerX) {
      this.moveLeft = false;
      this.moveRight = true;
    } else {
      this.moveRight = false;
      this.moveLeft = true;
    }

    if (y > rect.centerY) {
      this.moveUp = false;
      this.moveDown = true;
    } else {
      this.moveDown = false;
      this.moveUp = true;
    }
  }
}
