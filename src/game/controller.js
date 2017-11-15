export default class {
    constructor(gameRunner) {
        this.gameRunner = gameRunner;
    }

    start() {
        this.gameRunner.onStartGame();
    }

    restart() {
        this.gameRunner.onRestart();
    }

    jump() {
        this.gameRunner.onJump();
    }

    duck() {
        this.gameRunner.onDuck();
    }

    reset() {
        this.gameRunner.onJumpEnd();
        this.gameRunner.onDuckEnd();
    }
}
