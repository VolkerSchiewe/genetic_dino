import {Runner} from "./game/game";

export const ACTION_THRESHOLD = 0.11;

export class GenerationRunner {
    static runSingleGeneration(population, outputCallback) {
        return new Promise((resolve, reject) => {
            let elementId = '#game';
            let runner = new Runner(elementId, population.length);
            let distances = [];

            runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth, obstacleHeight) => {
                for (let i = 0; i < population.length; i++) {
                    let output = population[i].activateDinoBrain(distanceToObstacle, obstacleWidth, obstacleHeight);
                    // outputCallback(i, output);

                    if (GenerationRunner.isDuck(output)) {
                        runner.onDuck(i);
                    } else if (GenerationRunner.isJump(output)) {
                        runner.onJump(i);
                    }
                }
            });

            runner.addDinoCrashedListener((i, distance, jumpCount) => {
                console.log(`Dino ${i} crashed with distance: ${distance} jumps: ${jumpCount}`);
                distances[i] = distance;
            });

            runner.addGameEndListener(() => {
                console.log(`All dinos in generation finished!`);
                runner.removeMetricsListener();
                runner.removeDinoCrashedListener();
                runner.removeGameEndListener();
                runner.stop();
                outputCallback = null;

                resolve(distances);
            });

            runner.onStartGame();
        });
    }

    static isDuck(output) {
        return output[1] > ACTION_THRESHOLD;
    }

    static isJump(output) {
        return output[0] > ACTION_THRESHOLD;
    }
}
