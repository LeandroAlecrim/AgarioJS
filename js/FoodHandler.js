class FoodHandler {
  /** Cria um objeto FoodHandler */
  constructor() {
    this.list = [];
  }

  /** Retorna a lista*/
  getList() {
    return this.list;
  }

  /** Redefine a lista */
  resetList() {
    this.list = [];
  }

  /** Retorna o elemento na posição index, caso contrário null */
  get(index) {
    return index >= 0 && index < this.list.length ? this.list[index] : null;
  }

  /** Altera o elemento da posição index */
  set(index, food) {
    if (index >= 0 && index < this.list.length) {
      this.list[index] = food;
    }
  }

  /** Preenche a lista com comida */
  fill(amount) {
    while (this.list.length < amount) {
      this.list.push(this._food());
    }
  }

  /** Lida com colisões com o jogador */
  handleCollision(player) {
    const i = this.list.findIndex(
      (food) => player.checkCollision(food) && this._canAbsorb(food, player)
    );
    // tem colisão
    if (i >= 0) this._handleAbsorbFood(player, i);
  }

  /** Retorna verdadeiro se o elemento da posição index é uma armadilha, caso contrário false */
  isTrap(index) {
    return this.get(index)?.isTrap ?? false;
  }

  //#region private

  /** Lida com o jogador absorvendo comida ou armadilha */
  _handleAbsorbFood(player, foodIndex) {
    let food = this.get(foodIndex);

    if (food.isTrap) player.absorbTrap(food);
    else player.absorbFood(food);

    this.set(foodIndex, this._food());
  }

  /** Retorna novo objeto Food com dados aleatórios */
  _food() {
    const isTrap = _randomNumberBetween(0, 100) > 90;

    return new Food({
      centerX: _randomNumberBetween(0, GAME_SIZE.width),
      centerY: _randomNumberBetween(0, GAME_SIZE.height),
      radius: parseInt(
        _randomNumberBetween(2, GAME_SIZE.width / (isTrap ? 150 : 200))
      ),
      isTrap: isTrap,
      color: isTrap ? TRAP_COLOR : _randomColor(),
    });
  }

  /** Retorna verdadeiro se a comida não é uma armadilha ou se o raio do jogador for
   * maior que o diâmetro da armadilha,caso contrário falso.
   */
  _canAbsorb(food, player) {
    return !food?.isTrap || (food?.isTrap && player?.radius > food?.diameter);
  }
}
