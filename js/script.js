window.onload = function () {
  //
  //# region Globals
  //
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  let camera;
  let scale;
  let stage;

  let foodHandler;
  let escapeHandler;
  let playerHandler;

  let targetImg;
  let targetPlayer;
  let targetAngle;
  //
  //#endregion Globals
  //

  // Run Game
  init();

  //
  //#region Collision
  //

  /** Lida com a colisão de jogador com a lista de comida */
  function _handleFoodCollision() {
    playerHandler.getList().forEach((p) => {
      foodHandler.handleCollision(p);
    });
  }

  /** Lida com a colisão entre jogadores */
  function _handlePlayersCollision() {
    playerHandler.handleCollisionBetweenPlayers();
  }

  /** Lida com a colisão de objetos do jogo */
  function handleCollision() {
    _handleFoodCollision();
    _handlePlayersCollision();
  }
  //
  //#endregion Collision
  //

  //
  //#region Update
  //

  /** Atualiza a movimentação da câmera */
  function _updateCamera() {
    const velocity = playerHandler.human?.velocity ?? MAX_SPEED;
    camera.updatePosition(velocity);
  }

  /** Atualiza a movimentação do jogador */
  function _updatePlayer() {
    const cameraRect = camera.rect();
    playerHandler.updateHuman({
      centerX: cameraRect.centerX,
      centerY: cameraRect.centerY,
    });
  }

  /** Atualiza a movimentação dos bots */
  function _updateBots() {
    playerHandler.updateBots();
  }

  /** Atualiza o alvo do jogador e o ângulo do jogador em relação ao alvo */
  function _updateTarget() {
    if (!playerHandler.human) return;
    targetPlayer = playerHandler.target(playerHandler?.human);
    if (!targetPlayer) return;
    targetAngle = playerHandler.calcTargetAngle(
      playerHandler?.human,
      targetPlayer
    );
  }

  /** Atualiza os objetos do jogo */
  function update() {
    if (stage !== STAGES.game) return;
    _updateCamera();
    _updatePlayer();
    _updateBots();
    _updateTarget();
    handleCollision();
    rescale();
  }
  //
  //#endregion Update
  //

  //
  //#region Render
  //

  /** Renderiza o plano de fundo */
  function _renderBackground() {
    context.save();
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  /** Renderiza objeto Circle */
  function _renderCircle(circle) {
    context.save();
    context.beginPath();
    context.fillStyle = circle.color;
    context.arc(
      (circle.centerX - camera.posX) * scale,
      (circle.centerY - camera.posY) * scale,
      circle.radius * scale,
      0,
      2 * Math.PI
    );
    context.fill();
    context.restore();
  }

  /** Renderiza texto */
  function _renderText({
    message = '',
    color = FOREGROUND_COLOR,
    font = '100px Arial',
    textAlign = 'center',
    posX = canvas?.width / 2,
    posY = canvas?.height / 2,
  }) {
    context.save();
    context.fillStyle = color;
    context.font = font;
    context.textAlign = textAlign;
    context.fillText(message, posX, posY);
    context.restore();
  }

  /** Renderiza o nome do jogador */
  function _renderPlayerName(player) {
    _renderText({
      color: player.isHuman
        ? FOREGROUND_COLOR
        : player.compareRadius(playerHandler.human) > 0
        ? DANGER_COLOR
        : PRIMARY_COLOR,
      font: '12px Arial',
      message: `${player.name} (${player.score})`,
      posX: (player.centerX - camera.posX) * scale,
      posY: (player.centerY - camera.posY) * scale,
    });
  }

  /** Renderiza os jogadores visíveis na câmera */
  function _renderPlayers() {
    playerHandler.sortByScore(true).forEach((p) => {
      if (camera.inside(p)) {
        _renderCircle(p);
        _renderPlayerName(p);
      }
    });
  }

  /** Renderiza a lista de comidas visíveis na câmera */
  function _renderFood() {
    foodHandler.list.forEach((b) => {
      if (camera.inside(b)) _renderCircle(b);
    });
  }

  /** Renderiza o placar */
  function _renderScore() {
    playerHandler.scoreBoard.forEach((s, i) => {
      _renderText({
        font: s.isHuman ? 'bold 13px Arial' : '12px Arial',
        textAlign: 'left',
        message: s.label,
        posX: canvas.width - 150,
        posY: 25 + i * 25,
      });
    });
  }

  /** Renderiza número de jogadores restantes */
  function _renderRemainingPlayers() {
    _renderText({
      font: 'bold 12px Arial',
      textAlign: 'left',
      message: `${playerHandler.total} remaining  players`,
      posX: canvas.width - 150,
      posY: canvas.height - 20,
    });
  }

  /** Renderiza o texto de velocidade do jogador */
  function _renderVelocity() {
    _renderText({
      font: 'bold 12px Arial',
      textAlign: 'left',
      message: `Speed: ${playerHandler.human?.velocity.toFixed(2) ?? 0} px/s`,
      posX: 25,
      posY: canvas.height - 20,
    });
  }

  /** Renderiza o texto de Game Over */
  function _renderGameOverMessage() {
    _renderText({
      color: DANGER_COLOR,
      message: 'GAME OVER',
    });
  }

  /** Renderiza o texto de Start */
  function _renderStartMessage() {
    _renderText({
      color: PRIMARY_COLOR,
      message: 'START',
    });
  }

  /** Renderiza o texto de tentar novamente */
  function _renderResetMessage() {
    _renderText({
      color: PRIMARY_COLOR,
      font: '50px Arial',
      message: `TRY AGAIN`,
      posY: canvas.height / 2 + 75,
    });
  }

  /** Renderiza o texto de resultado */
  function _renderResultMessage() {
    _renderText({
      color: PRIMARY_COLOR,
      message: 'RESULT',
    });
  }

  /** Renderiza o texto de jogador vencedor */
  function _renderWinnerMessage() {
    _renderText({
      font: '50px Arial',
      message: `${playerHandler.lastPlayer.name} is the winner!`,
      posY: canvas.height / 2 + 75,
    });
  }

  /** Renderiza o nome do alvo */
  function _renderTargetName() {
    if (!targetPlayer) return;

    _renderText({
      font: '12px Arial',
      color:
        playerHandler.human?.compareRadius(targetPlayer) > 0
          ? PRIMARY_COLOR
          : DANGER_COLOR,
      message: `${targetPlayer.name} (${parseInt(targetPlayer.radius)})`,
      posX: targetImg.width * 2.75,
      posY: targetImg.height,
    });
  }

  /** Renderiza a seta que indica o jogador alvo */
  function _renderTargetDirection(degrees) {
    if (!targetImg || !targetPlayer) return;

    context.save();

    // translada o canvas a partir do fim da imagem,
    context.translate(targetImg.width, targetImg.height);
    // converte graus em radianos e rotaciona o canvas
    context.rotate((degrees * Math.PI) / 180);

    // desenha a seta
    context.drawImage(
      targetImg, // imagem
      0, // src_X
      0, // src_Y
      targetImg.width, // src_width
      targetImg.height, // src_height
      -targetImg.width / 2, // draw_X
      -targetImg.height / 2, // draw_Y
      targetImg.width, // draw_Width
      targetImg.height // draw_Height
    );

    context.restore();
  }

  /** Renderiza os pontos de fuga dentro da câmera*/
  function _renderEscapePoints() {
    escapeHandler.list.forEach((e) => {
      if (camera.inside(e)) _renderCircle(e);
    });
  }

  /** Renderiza o jogo */
  function render() {
    // limpa o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // inicio
    if (stage === STAGES.start) {
      _renderStartMessage();
      // jogo
    } else if (stage === STAGES.game) {
      _renderBackground();
      _renderEscapePoints();
      _renderFood();
      _renderPlayers();
      _renderScore();
      _renderRemainingPlayers();
      _renderVelocity();
      _renderTargetDirection(targetAngle);
      _renderTargetName();
      // game over
    } else if (stage === STAGES.gameOver) {
      _renderGameOverMessage();
      _renderResetMessage();
      // fim de jogo
    } else if (stage === STAGES.result) {
      _renderResultMessage();
      _renderWinnerMessage();
    }
  }
  //
  //#endregion Render
  //

  //
  //#region Game
  //

  /** Reinicia a câmera */
  function _setCamera() {
    camera = new Camera({
      posX: _randomNumberBetween(0, GAME_SIZE.width - canvas.width),
      posY: _randomNumberBetween(0, GAME_SIZE.height - canvas.height),
      width: canvas.width,
      height: canvas.height,
    });
  }

  /** Reinicia o jogador */
  function _setHuman() {
    playerHandler.setHuman({
      name: 'Player',
      centerX: canvas.width / 2,
      centerY: canvas.height / 2,
      isHuman: true,
      radius: PLAYER_MIN_RADIUS,
    });
  }

  /** Preenche a lista de comida */
  function _fillFood(quantity) {
    foodHandler.fill(quantity);
  }

  /** Preenche a lista de jogadores com bots */
  function _fillBots(botsQuantity) {
    playerHandler.fillBots(botsQuantity);
  }

  /** Reescala o jogo de acordo com o diâmetro do jogador */
  function rescale() {
    if (stage === STAGES.gameOver || stage === STAGES.result) return;

    // reescala quando o diâmetro do jogador ultrapassar 1/3 da altura da tela
    const diameter = playerHandler.human?.diameter;
    const heightLimit = canvas?.height / 3;
    if (diameter < heightLimit) scale = 1;
    else scale = heightLimit / diameter;

    // Redimensiona a câmera
    camera.reset({
      posX: camera.posX,
      posY: camera.posY,
      width: canvas.width / scale,
      height: canvas.height / scale,
    });
    // centraliza o jogador
    _updatePlayer();
  }

  /** Redimensiona o canvas para ocupar a área da tela */
  function resizeCanvas() {
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerHeight * 0.95;
  }

  /** Altera flag gameOver se o jogador estiver fora da partida  */
  function handleLose() {
    if (!playerHandler.human) stage = STAGES.gameOver;
  }

  /** Altera a flag result se houver somente 1 jogador */
  function handleResult() {
    if (playerHandler.lastPlayer) stage = STAGES.result;
  }

  /** Reinicia a partida */
  function restart() {
    stage = STAGES.game;
    playerHandler.resetList();
    foodHandler.resetList();
    _fillFood(FOOD_QUANTITY);
    _fillBots(BOTS_QUANTITY);
    _setCamera();
    _setHuman();
    rescale();
  }

  /** Executa o loop de atualização e renderização */
  function loop() {
    if (stage === STAGES.game) {
      handleLose();
      handleResult();
      update();
    }

    render();
    requestAnimationFrame(loop);
  }

  /** Inicia as variáveis e o loop */
  function init() {
    // handlers
    escapeHandler = new EscapeHandler();
    foodHandler = new FoodHandler();
    playerHandler = new PlayerHandler();

    // alvo
    targetImg = new Image();
    targetImg.src = 'assets/img/arrow.png';
    targetAngle = 0;
    targetPlayer = null;

    stage = STAGES.start;
    scale = 1;

    resizeCanvas(canvas);
    loop();
  }
  //
  //#endregion Game
  //

  //
  //#region Events
  //

  /** Click de mouse */
  function onClick(e) {
    e.preventDefault();
    if (stage !== STAGES.game) restart();
  }

  /** Movimentação de mouse */
  function onMouseUpdate(e) {
    e.preventDefault();
    if (!camera || stage !== STAGES.game) return;
    camera.setDirection({ x: e.pageX + camera.posX, y: e.pageY + camera.posY });
  }

  // Associação de eventos
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('mousemove', onMouseUpdate); // desktop
  canvas.addEventListener('touchstart', onMouseUpdate, true); // mobile

  //
  //#endregion Events
  //
};
