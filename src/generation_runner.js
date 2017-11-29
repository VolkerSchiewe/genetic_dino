import {DinoRunner} from "./dino_runner";

export class GenerationRunner {
    static runSingleGeneration(population, outputCallback) {
        return this.createRunnersForPopulation(population, outputCallback)
            .then(dinoRunners => {
                // Run all dinos and wait until all have finished
                return Promise.all(dinoRunners);
            }).then(fitness => {
                console.log(`Fitness of all dinos ${fitness}`);
                return fitness;
            });
    }

    static createRunnersForPopulation(population, outputCallback) {
        return new Promise((resolve, reject) => {

            const dinoRunners = [];

            for (let currentDino = 0; currentDino < population.length; currentDino++) {
                dinoRunners.push(DinoRunner.create(currentDino, population[currentDino], outputCallback));
            }
            resolve(dinoRunners);
        });
    }
}
