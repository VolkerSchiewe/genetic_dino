import Controller from './game/controller'

export const ACTION_THRESHOLD = 0.11;

export class DinoRunner {
    static create(runner, index, brain, outputCallback) {

        return new Promise((resolve, reject) => {
            const controller = new Controller(runner, index);
            console.log(`Created Runner for dino ${index}`);

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

            runner.addGameEndListener(index, (i, distance, jumpCount) => {
                console.log(`Game ended for dino: ${i} with distance: ${distance} jumps: ${jumpCount}`);

                controller.stop();
                resolve(distance);
            });

            controller.start()
        });
    }
}
