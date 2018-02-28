import {CONNECTIONS, DinoBrain, INPUT_LAYERS, NEURONS} from './dinoBrain';
import * as synaptic from 'synaptic';
import { random } from './utils';

// contains all genetic algorithm related logic
export default class GeneticAlgorithm {
    constructor(populationSize) {
        this.populationSize = populationSize;
        this.mutationRate = 0.2;
    }

    setMutationRate(mutationRate) {
        this.mutationRate = mutationRate;
    }

    // create random new population
    generatePopulation(initialJSON = null) {
        let population = [];

        for (let i = 0; i < this.populationSize; i++) {
            if (initialJSON !== null) {
                population.push(DinoBrain.parseJson(initialJSON[i]));
            } else {
                population.push(new DinoBrain());
            }
        }
        return population;
    }

    // create new population based on the evolution strategy explained in the paper
    evolvePopulation(oldPopulation) {
        let newPopulation = [];

        for (let i = 0; i < this.populationSize; i++) {
            let dino = null;

            if (i === 0) {
                dino = oldPopulation[0];
            } else if (i === 1) {
                dino = this.crossOverDinoBrains(oldPopulation[0], oldPopulation[1], 0.65);
            } else if (i === 2) {
                dino = this.crossOverDinoBrains(oldPopulation[0], oldPopulation[2], 0.65);
            } else if (i % 3 === 0) {
                dino = this.crossOverDinoBrains(oldPopulation[0], this.getRandomDino(oldPopulation), 0.65);
            } else if (i % 4 === 0) {
                dino = this.crossOverDinoBrains(oldPopulation[1], this.getRandomDino(oldPopulation), 0.65);
            } else if (i % 5 === 0) {
                dino = this.crossOverDinoBrains(oldPopulation[0], new DinoBrain(), 0.9);
            } else {
                dino = this.crossOverDinoBrains(oldPopulation[1], new DinoBrain(), 0.9);
            }
            newPopulation.push(this.mutateDinoGenes(dino));
        }
        return newPopulation;
    }


    // nature inspired merging method, simulates cross over in genetic
    crossOverDinoBrains(dominantBrain, recessiveBrain, dominantRate) {
        const recessiveRate = 1 - dominantRate;

        // Converting the networks to JSON makes it much easier to manipulate parameters
        let dominantPerceptron = Object.create(dominantBrain.perceptron.toJSON());
        let recessivePerceptron = Object.create(recessiveBrain.perceptron.toJSON());

        let newDino = new DinoBrain();
        let newPerceptron = Object.create(dominantBrain.perceptron.toJSON());

        // crossover bias
        for (let i = 0; i < NEURONS; i++) {
            let dominantBias = dominantPerceptron.neurons[INPUT_LAYERS + i].bias;
            let recessiveBias = recessivePerceptron.neurons[INPUT_LAYERS + i].bias;

            newPerceptron.neurons[INPUT_LAYERS + i].bias = (dominantBias * dominantRate + recessiveBias * recessiveRate);
        }

        //crossover weights
        for (let i = 0; i < CONNECTIONS; i++) {
            let dominantWeight = dominantPerceptron.connections[i].weight;
            let recessiveWeight = recessivePerceptron.connections[i].weight;

            newPerceptron.connections[i].weight = (dominantWeight * dominantRate + recessiveWeight * recessiveRate);
        }
        newDino.perceptron = synaptic.Network.fromJSON(newPerceptron);
        return newDino;
    }

    // mutate neuronal network bias and weights
    mutateDinoGenes(dinoGene) {
        let oldDinoJson = Object.create(dinoGene.perceptron.toJSON());
        let newDinoJson = Object.create(dinoGene.perceptron.toJSON());
        let newDino = Object.create(dinoGene);

        // mutate bias
        for (let i = 0; i < NEURONS; i++) {
            newDinoJson.neurons[INPUT_LAYERS + i].bias = this.mutateValue(oldDinoJson.neurons[INPUT_LAYERS + i].bias);
        }

        // mutate weights
        for (let i = 0; i < CONNECTIONS; i++) {
            newDinoJson.connections[i].weights = this.mutateValue(oldDinoJson.connections[i].weights);
        }

        newDino.perceptron = synaptic.Network.fromJSON(newDinoJson);
        return newDino;
    }

    // mutate value based on mutation rate and mutation factor
    mutateValue(gene) {
        if (Math.random() < this.mutationRate) {
            gene *= 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
        }
        return gene;
    }

    // returns a random dino out of a population
    getRandomDino(population) {
        return Object.create(population[random(0, population.length - 1)]);
    }
}
