class Rectangle {
  /** Cria um novo objeto Rectangle */
  constructor({ posX, posY, width, height }) {
    this.reset({ posX, posY, width, height });
  }

  /** Retorna as posições esquerda, direita, cima, baixo e centro */
  rect() {
    return {
      left: this.posX,
      right: this.posX + this.width,
      top: this.posY,
      bottom: this.posY + this.height,
      centerX: this.posX + this.width / 2,
      centerY: this.posY + this.height / 2,
    };
  }

  /** Returns verdadeiro se objeto estiver contido na área deste objeto */
  inside(object) {
    if (!object) return false;

    const objRect = object.rect();
    const cameraRect = this.rect();

    return (
      objRect.left < cameraRect.right &&
      objRect.right - cameraRect.left > 0 &&
      objRect.top < cameraRect.bottom &&
      objRect.bottom - cameraRect.top > 0
    );
  }

  /** Altera as propriedades do objeto */
  reset({
    posX = 0,
    posY = 0,
    width = GAME_SIZE.width,
    height = GAME_SIZE.height,
  }) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
  }
}
