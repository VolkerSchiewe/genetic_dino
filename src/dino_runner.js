import Controller from './game/controller'
import {Runner} from "./game/game";

export const JUMP_THRESHOLD = 0.51;

export class DinoRunner {
    static create(index, brain, outputCallback) {
        return new Promise((resolve, reject) => {
            let elementId = '#dino-' + index;
            const runner = new Runner(elementId);
            const controller = new Controller(runner);

            runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth, obstacleHeight) => {
                let output = brain.activateDinoBrain(distanceToObstacle, obstacleWidth, obstacleHeight);
                outputCallback(index, output);
                if (output > JUMP_THRESHOLD) {
                    controller.jump();
                }
            });

            runner.addGameEndListener((distance, jumpCount) => {
                console.log(`Game ended for dino: ${index} with distance: ${distance}`);

                controller.stop();
                resolve(distance);
            });

            controller.start()
        });
    }
}
