import {Runner} from "./game/game";

export const ACTION_THRESHOLD = 0.11;

export class GenerationRunner {
    static runSingleGeneration(id, population, outputCallback) {
        return new Promise((resolve, reject) => {
            let runner = new Runner(id, population.length);
            let distances = [];

            runner.addMetricsListener((speed, distance, distanceToObstacle, obstacleWidth, obstacleHeight) => {
                for (let i = 0; i < population.length; i++) {
                    population[i].activateDinoBrain(distanceToObstacle, obstacleWidth, obstacleHeight);

                    if (GenerationRunner.isDuck(population[i].output)) {
                        runner.onDuck(i);
                    } else if (GenerationRunner.isJump(population[i].output)) {
                        runner.onJump(i);
                    }
                }
                outputCallback();
            });

            runner.addDinoCrashedListener((i, distance, jumpCount) => {
                console.log(`Dino ${i} crashed with distance: ${distance} jumps: ${jumpCount}`);
                distances[i] = distance;
                population[i].is_alive = false;
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
