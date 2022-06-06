class Circle {
  /** Cria um objeto Circle */
  constructor({ centerX, centerY, radius, color }) {
    this.reset({ centerX, centerY, radius, color });
  }

  /** Retorna o diâmetro (raio * 2)*/
  get diameter() {
    return this.radius * 2;
  }

  /** Retorna o ângulo entre este objeto e o target */
  calcAngle(target) {
    const x = target.centerX - this.centerX;
    const y = target.centerY - this.centerY;
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  /** Retorna a distância entre o centro deste objeto e do target */
  calcDistance(target) {
    const base = Math.abs(this.centerX - target.centerX); // cateto1
    const perpendicular = Math.abs(this.centerY - target.centerY); // cateto2

    // hipotenusa = raiz( cateto1^2 + cateto2^2 )
    return Math.round(
      Math.sqrt(Math.pow(base, 2) + Math.pow(perpendicular, 2)),
      2
    );
  }

  /** Retorna verdadeiro se este objeto colide com o target
   * Considera colisão se a distância entre os dois for menor que o raio de um deles
   */
  checkCollision(target) {
    const distance = this.calcDistance(target);
    return distance <= this.radius || distance <= target.radius;
  }

  /** Retorna a diferença entre os raios deste objeto e do target
   * Se menor que 0, target é maior,
   * Se maior que 0, este objeto é maior
   */
  compareRadius(target) {
    return parseInt(this.radius) - parseInt(target?.radius);
  }

  /** Retorna as posições que formam o quadrado externo a este objeto. */
  rect() {
    return {
      left: this.centerX - this.radius,
      right: this.centerX + this.radius,
      top: this.centerY - this.radius,
      bottom: this.centerY + this.radius,
    };
  }

  /** Reseta as propriedades deste objeto */
  reset({
    centerX = 0,
    centerY = 0,
    radius = PLAYER_MIN_RADIUS,
    color = _randomColor(),
  }) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.color = color;
  }
}

/** Lista de Cores */
const COLORS = [
  '#E6B0AA',
  '#F5B7B1',
  '#D7BDE2',
  '#D2B4DE',
  '#A9CCE3',
  '#AED6F1',
  '#A3E4D7',
  '#A2D9CE',
  '#A9DFBF',
  '#ABEBC6',
  '#F9E79F',
  '#FAD7A0',
  '#F5CBA7',
  '#EDBB99',
];

/** Retorna uma cor aleatória da lista de cores */
function _randomColor() {
  const i = Math.round(_randomNumberBetween(0, COLORS.length - 1));
  return COLORS[i];
}
