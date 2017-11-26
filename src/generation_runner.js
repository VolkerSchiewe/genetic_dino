import {DinoRunner} from "./dino_runner";

export class GenerationRunner {
    static runSingleGeneration(population) {
        return this.createRunnersForPopulation(population)
            .then(dinoRunners => {
                // Run all dinos and wait until all have finished
                return Promise.all(dinoRunners);
            }).then(dinoResults => {
                const fitness = [];

                for (let dinoResult of dinoResults) {
                    fitness[dinoResult.index] = dinoResult.distance;
                }
                return fitness;
            });
    }

    static createRunnersForPopulation(population) {
        return new Promise((resolve, reject) => {
            const dinoRunners = [];

            for (let currentDino = 0; currentDino < population.length; currentDino++) {
                dinoRunners.push(DinoRunner.create(currentDino, population[currentDino]));
            }
            resolve(dinoRunners);
        });
    }
}