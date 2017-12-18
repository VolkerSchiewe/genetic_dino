export default class {
    constructor(gameRunner, index) {
        this.gameRunner = gameRunner;
        this.index = index
    }

    start() {
        this.gameRunner.onStartGame(this.index);
    }

    stop() {
        this.gameRunner.onStop(this.index);
    }

    jump() {
        this.gameRunner.onJump(this.index);
    }

    duck() {
        this.gameRunner.onDuck(this.index);
    }

    reset() {
        this.gameRunner.onJumpEnd(this.index);
        this.gameRunner.onDuckEnd(this.index);
    }
}
