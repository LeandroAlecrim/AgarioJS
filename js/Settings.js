//
//#region Game Settings
//

const GAME_SIZE = { width: 3000, height: 3000 };
const FOOD_QUANTITY = 1000;
const BOTS_QUANTITY = 29;
const PLAYER_MIN_RADIUS = 10;

const INITIAL_SPEED = 1.5;
const MIN_SPEED = 0.5;
const MAX_SPEED = 3;

const FOREGROUND_COLOR = 'black';
const BACKGROUND_COLOR = 'snow';
const DANGER_COLOR = 'red';
const PRIMARY_COLOR = 'blue';
const TRAP_COLOR = 'green';

const STAGES = {
  start: 'start',
  game: 'game',
  gameOver: 'gameOver',
  result: 'result'
}
//
//#endregion Game Settings
//

//
//#region Utils
//

/** Retorna um número aleatório entre min e max */
function _randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

//
//#endregion Utils
//
