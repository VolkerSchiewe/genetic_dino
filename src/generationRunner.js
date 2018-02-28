import { Runner } from './game';

export const ACTION_THRESHOLD = 0.11;

// initialize and control a dinosaur generation
export default class GenerationRunner {
    static runSingleGeneration(mapId, population, outputCallback, dinoDiedCallback) {
        return new Promise((resolve, reject) => {
            let runner = new Runner('#game-' + mapId, population.length, null);
            let distances = [];

            // is called within the games update method and contains all important metrics for the NN
            runner.addMetricsListener((speed, nextObstacle, dinoHeight, isOverObstacle) => {
                for (let i = 0; i < population.length; i++) {
                    // get NN output value
                    let output = population[i].activateDinoBrain(nextObstacle[i].distanceToNextObstacle,
                        nextObstacle[i].widthOfNextObstacle,
                        nextObstacle[i].heightOfNextObstacle,
                        dinoHeight[i],
                        isOverObstacle[i]);

                    // send outputs to output charts
                    outputCallback(i, output);

                    // force the dino to duck if the output value exceeds the threshold
                    if (GenerationRunner.isDuck(output)) {
                        runner.onDuck(i);
                    } else {
                        runner.onDuckEnd(i);
                    }

                    // force the dino to jump if the output value exceeds the threshold
                    if (GenerationRunner.isJump(output)) {
                        runner.onJump(i);
                    }
                }
            });

            // handle dino crashed event
            runner.addDinoCrashedListener((i, distance, jumpCount) => {
                // console.log(`Dino ${i} crashed with distance: ${distance} jumps: ${jumpCount}`);
                distances[i] = distance;
                dinoDiedCallback(i);
            });

            // handle all dinosaurs died in the map.
            // removes all listeners and resolve promise
            runner.addGameEndListener(() => {
                //console.log(`All dinos in generation on Map ${mapId} finished!`);
                runner.removeMetricsListener();
                runner.removeDinoCrashedListener();
                runner.removeGameEndListener();
                runner.stop();
                dinoDiedCallback = null;

                resolve(distances);
            });

            // start game
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
