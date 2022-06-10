class PlayerHandler {
  /** Cria um objeto PlayerHandler */
  constructor() {
    this.list = [];
    this.humanIndex = -1;
  }

  /** Retorna o último jogador, caso contrário null */
  get lastPlayer() {
    return this.list.length === 1 ? this.get(0) : null;
  }

  /** Retorna o jogador humano, caso contrário null */
  get human() {
    return this.humanIndex >= 0 ? this.list[this.humanIndex] : null;
  }

  /** Retorna um placar com os 10 melhores jogadores, incluso o jogador humano caso não esteja no top 10 */
  get scoreBoard() {
    const topPlayers = this.sortByScore(false).filter(
      (p, i) => i < 10 || p.isHuman
    );

    return topPlayers.map((p) => {
      return {
        label: `${p.name} - ${p.score}`,
        score: p.score,
        isHuman: p.isHuman,
      };
    });
  }

  /** Retorna o total de jogadores restantes */
  get total() {
    return this.list.length;
  }

  /** Retorna a lista */
  getList() {
    return this.list;
  }

  /** Redefine a lista */
  resetList() {
    this.list = [];
  }

  /** Retorna o ângulo do centro do jogador em relação ao centro do alvo */
  calcTargetAngle(player, target) {
    return player.calcAngle(target);
  }

  /** Preenche a lista com bots */
  fillBots(amount) {
    while (amount > 0) {
      this.list.push(this._bot());
      amount--;
    }
  }

  /** Lida com a colisão entre jogadores */
  handleCollisionBetweenPlayers() {
    this.list.forEach((pl) => {
      this._findCollisions(pl);
    });
  }

  /** Retorna o jogador na posição index, caso contrário null */
  get(index) {
    return index >= 0 && index < this.list.length ? this.list[index] : null;
  }

  /** Remove o jogador da lista */
  remove(player) {
    if (!player) return;
    this.list = this.list.filter((p) => p.id !== player?.id);
  }

  /** Altera o jogador na posição index, se index for uma posição válida */
  set(index, player) {
    if (index < 0 || index > this.list.length) return;
    this.list[index] = player;
  }

  /** Redefine o jogador humano existente ou inclui novo na lista*/
  setHuman({ centerX, centerY, radius, color, id, name, isHuman }) {
    const player = new Player({
      centerX,
      centerY,
      radius,
      color,
      id,
      name,
      isHuman,
    });

    if (this.human) this.set(this.humanIndex, player);
    else {
      this.humanIndex = 0;
      this.list.unshift(player);
    }
  }

  /** Retorna a lista de jogadores ordenada pelo score */
  sortByScore(isAsc) {
    const sortable = [...this.list];
    return sortable.sort(function (a, b) {
      return isAsc ? a.score - b.score : b.score - a.score;
    });
  }

  /** Updates human player position to center of rect */
  updateHuman({ centerX = 0, centerY = 0 }) {
    if (!this.human) return;
    this.human.setPosition({ centerX: centerX, centerY: centerY });
  }

  /** Atualiza a posição dos bots */
  updateBots() {
    this.list
      .filter((p) => !p.isHuman) // apenas bots
      .forEach((bot) => {
        this._updateBotPosition(bot, this.target(bot));
      });
  }

  /** Retorna o alvo do jogador, caso contrário null */
  target(player) {
    const targets = this._targets(player);
    const tDistance = targets.map((t) => player.calcDistance(t));
    const minDistance = Math.min(...tDistance);
    const tIndex = tDistance.findIndex((d) => d === minDistance);
    return targets[tIndex] ?? null;
  }

  //#region private

  /** Lida com o player absorvendo o target */
  _handleAbsorb(player, target) {
    player.absorbPlayer(target);
    if (target.isHuman) this.humanIndex = -1;
    this.remove(target);
  }

  /** Retorna um novo bot com posição aleatória */
  _bot() {
    return new Player({
      centerX: _randomNumberBetween(0, GAME_SIZE.width),
      centerY: _randomNumberBetween(0, GAME_SIZE.height),
    });
  }

  /** Lida com a colisão entre jogador e alvo*/
  _handleCollision(player, target) {
    if (!player || !target) return;

    // compara o raio e absorve
    const compare = player.compareRadius(target);
    if (compare > 0) this._handleAbsorb(player, target);
    else if (compare < 0) this._handleAbsorb(target, player);
  }

  /** Encontra colisões com o jogador e retorna a primeira colisão*/
  _findCollisions(player) {
    // encontra colisões
    const target =
      this._targets(player)
        .filter((t) => player.checkCollision(t))
        .pop() ?? null;

    if (target) this._handleCollision(player, target);
  }

  /** Retorna uma lista de possíveis alvos */
  _targets(player) {
    return this.list.filter(
      (target) =>
        player.id !== target.id &&
        player.calcDistance(target) < GAME_SIZE.width / 2
    );
  }

  /** Atualiza a posição do bot em relação ao alvo */
  _updateBotPosition(bot, target) {
    if (!bot || !target || bot.isHuman) return;

    let directionX = 1;
    let directionY = 1;

    // se houver alvo
    if (target) {
      const compare = bot.compareRadius(target);
      // perseguir
      if (compare > 0) {
        if (bot.centerX > target.centerX) directionX = -directionX; // to left
        if (bot.centerY > target.centerY) directionY = -directionY; // to top
        // fugir
      } else if (compare < 0) {
        // obs: melhorar comportamento quando o bot está encurralado
        if (bot.centerX + 50 < target.centerX) directionX = -directionX; // to left
        if (bot.centerY + 50 < target.centerY) directionY = -directionY; // to top
      }
    } // sem alvo, foge para o centro do jogo
    else {
      if (bot.centerX > GAME_SIZE.with / 2) directionX = -directionX; // to left
      if (bot.centerY > GAME_SIZE.height / 2) directionY = -directionY; // to top
    }

    // atualiza posição
    bot.updatePosition({
      incrementX: directionX * bot.velocity,
      incrementY: directionY * bot.velocity,
    });

    // trata os pontos de fuga
    this._handleEscapePoint(bot);
  }

  /** Lida com o bot nos pontos de fuga */
  _handleEscapePoint(bot) {
    if (
      (bot.centerX === 0 && bot.centerY === 0) ||
      (bot.centerX === 0 && bot.centerY === GAME_SIZE.height) ||
      (bot.centerX === GAME_SIZE.width && bot.centerY === GAME_SIZE.height) ||
      (bot.centerX === GAME_SIZE.width && bot.centerY === 0)
    ) {
      bot.setPosition({
        centerX: _randomNumberBetween(0, GAME_SIZE.width),
        centerY: _randomNumberBetween(0, GAME_SIZE.height),
      });
    }
  }
  //#endregion private
}
