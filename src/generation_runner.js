import {DinoRunner} from "./dino_runner";

export class GenerationRunner {
    runSingleGeneration(population) {
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

    createRunnersForPopulation(population) {
        return Promise.resolve(new DinoRunner())
            .then(dinoRunner => {
                const dinoRunners = [];

                for (let currentDino = 0; currentDino < population.length; currentDino++) {
                    dinoRunners.push(dinoRunner.create(currentDino, population[currentDino]));
                }

                return dinoRunners;
            })
    }
}