import Controller from './game/controller'
import {Runner} from "./game/game";

export const JUMP_THRESHOLD = 0.51;

export class DinoRunner {
    static create(index, brain) {
        return new Promise(function (resolve, reject) {
            console.log(`New runner ${index}`);
            const runner = new Runner(`#dino-${index}`);
            const controller = new Controller(runner);

            runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth) => {
                let output = brain.activateDinoBrain(distanceToObstacle, obstacleWidth);

                if (output > JUMP_THRESHOLD) {
                    controller.jump();
                }
            });

            runner.addGameEndListener((distance) => {
                console.log(`Game ended for dino: ${index} with distance: ${distance}`);
                controller.stop();
                resolve(distance);
            });

            controller.start()
        });
    }
}
