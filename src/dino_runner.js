import Controller from './game/controller'
import {Runner} from "./game/game";

export const ACTION_THRESHOLD = 0.11;

export class DinoRunner {
    static create(index, brain, outputCallback) {
        return new Promise((resolve, reject) => {
            let elementId = '#dino-' + index;
            const runner = new Runner(elementId);
            const controller = new Controller(runner);

            runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth, obstacleHeight) => {
                let output = brain.activateDinoBrain(distanceToObstacle, obstacleWidth, obstacleHeight);
                outputCallback(index, output);
                if (output[0] > ACTION_THRESHOLD) {
                    controller.jump();
                }
                if (output[1] > ACTION_THRESHOLD && distance > 1) {
                    controller.duck();
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
