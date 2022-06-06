class EscapeHandler {
  /** Cria objeto EscapeHandler */
  constructor() {
    this.list = [
      this._escapePoint({ centerX: 0, centerY: 0 }),
      this._escapePoint({ centerX: GAME_SIZE.width, centerY: 0 }),
      this._escapePoint({ centerX: 0, centerY: GAME_SIZE.height }),
      this._escapePoint({
        centerX: GAME_SIZE.width,
        centerY: GAME_SIZE.height,
      }),
    ];
  }

  //#region private
  _escapePoint({ centerX, centerY }) {
    return new Circle({
      centerX: centerX,
      centerY: centerY,
      radius: 20,
      color: FOREGROUND_COLOR,
    });
  }
}
