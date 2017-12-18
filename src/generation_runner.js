import {DinoRunner} from "./dino_runner";
import {Runner} from "./game/game";

export class GenerationRunner {
    static runSingleGeneration(population, outputCallback) {
        return this.createRunnersForPopulation(population, outputCallback)
            .then(dinoRunners => {
                // Run all dinos and wait until all have finished
                return Promise.all(dinoRunners);
            }).then(fitness => {
                console.log(`Game ended for ALL dinots: ${fitness}`);
                return fitness;
            });
    }

    static createRunnersForPopulation(population, outputCallback) {
        return new Promise((resolve, reject) => {
            let elementId = '#game';
            const runner = new Runner(elementId, population.length);

            const dinoRunners = [];

            for (let currentDino = 0; currentDino < population.length; currentDino++) {
                dinoRunners.push(DinoRunner.create(runner, currentDino, population[currentDino], outputCallback));
            }
            resolve(dinoRunners);
        });
    }
}
