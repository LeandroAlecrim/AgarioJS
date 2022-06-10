class Player extends Circle {
  /** Cria um objeto Player */
  constructor({
    centerX,
    centerY,
    radius,
    color,
    id = uuIdV4(),
    name = _randomName(),
    isHuman = false,
  }) {
    super({ centerX, centerY, radius, color });
    this.id = id;
    this.name = name;
    this.isHuman = isHuman;
    this.speedBoost = this.isHuman
      ? _randomNumberBetween(MIN_SPEED / 10, MAX_SPEED / 10) // aumento de velocidade do bot
      : 0;
  }

  /** Retorna a velocidade do jogador */
  get velocity() {
    const speed = INITIAL_SPEED + this.speedBoost - this.speedPenalty;
    if (speed < MIN_SPEED) return MIN_SPEED;
    else if (speed > MAX_SPEED) return MAX_SPEED;
    return speed;
  }

  /** Retorna o placar do jogador (igual ao valor truncado do raio ) */
  get score() {
    return parseInt(this.radius);
  }

  /** Retorna a penalidade sobre a velocidade */
  get speedPenalty() {
    return this.radius / 50;
  }

  /** Adiciona 1/8 do raio da comida ao raio do jogador*/
  absorbFood(food) {
    this.radius += food?.radius / 8;
  }

  /** Adiciona 1/4 do raio do alvo ao raio do jogador*/
  absorbPlayer(target) {
    this.radius += target?.radius / 4;
  }

  /** Subtrai o diâmetro da armadilha do raio do jogador e
   * adiciona bônus de velocidade igual a 1/50 do raio da armadilha.
   */
  absorbTrap(trap) {
    this.radius -= trap?.diameter;
    this.speedBoost += trap?.radius / 50;
    if (this.radius < PLAYER_MIN_RADIUS) this.radius = PLAYER_MIN_RADIUS;
  }

  /** Altera a posição central do jogador*/
  setPosition({ centerX = 0, centerY = 0 }) {
    this.centerX = centerX;
    this.centerY = centerY;
    this._validatePosition();
  }

  /** Atualiza a posição central do jogador com incrementos de x e y */
  updatePosition({ incrementX = 0, incrementY = 0 }) {
    this.centerX += incrementX;
    this.centerY += incrementY;
    this._validatePosition();
  }

  /** Valida a posição do jogador dentro do jogo */
  _validatePosition() {
    if (this.centerX < 0) this.centerX = 0;
    else if (this.centerX > GAME_SIZE.width) this.centerX = GAME_SIZE.width;

    if (this.centerY < 0) this.centerY = 0;
    else if (this.centerY > GAME_SIZE.height) this.centerY = GAME_SIZE.height;
  }
}

// Lista de prefixos de nome
const PREFIX = [
  'Mini',
  'Little',
  'Giant',
  'Crazy',
  'Dark',
  'Super',
  'Mega',
  'Ultra',
  'Giga',
];

// Lista de nomes
const NAMES = [
  'Albatross',
  'Alligator',
  'Alpaca',
  'Ape',
  'Armadillo',
  'Buffalo',
  'Buzzard',
  'Camel',
  'Canidae',
  'Cardinal',
  'Cat',
  'Caterpillar',
  'Cattle',
  'Cephalopod',
  'Chameleon',
  'Cheetah',
  'Condor',
  'Coyote',
  'Dog',
  'Dolphin',
  'Donkey',
  'Hornet',
  'Eagle',
  'Elephant',
  'Felidae',
  'Firefly',
  'Frog',
  'Goat',
  'Jaguar',
  'Hound',
  'Horse',
  'Moth',
  'Panther',
  'Parrot',
  'Pig',
  'Rabbit',
  'Squirrel',
  'Turtle',
  'Viper',
];

/** Retorna um GUID único */
function uuIdV4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

//** Retorna um nome aleatório com prefixo */
function _randomName() {
  const i = Math.round(_randomNumberBetween(0, PREFIX.length - 1));
  const j = Math.round(_randomNumberBetween(0, NAMES.length - 1));
  return `${PREFIX[i]}_${NAMES[j]}`;
}
