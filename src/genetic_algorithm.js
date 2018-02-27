import {CONNECTIONS, DinoBrain, INPUT_LAYERS, NEURONS} from './dino_brain';
import * as synaptic from 'synaptic';

const DOMINANT_GENE_RATE = 0.80;
const RECESSIVE_GENE_RATE = 0.20;

export default class GeneticAlgorithm {
    constructor(populationSize) {
        this.populationSize = populationSize;
        this.mutationRate = 0.2;
    }

    setMutationRate(mutationRate) {
        this.mutationRate = mutationRate;
    }

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

    // TODO: Research better evolution algorithms
    evolvePopulation(survivors, populationSize) {
        let new_population = [];
        for (let i = 0; i < populationSize; i++) {
            let dino = null;

            if (i === 0) {
                dino = survivors[0];
            } else if (i === 1) {
                dino = this.crossOverDinoBrains(survivors[0], survivors[1]);
            } else if (i === 2) {
                dino = this.crossOverDinoBrains(survivors[0], survivors[1]);
            } else if (i % 3 === 0) {
                dino = this.crossOverDinoBrains(survivors[0], this.getRandomDino(survivors));
            } else if (i % 4 === 0) {
                dino = this.crossOverDinoBrains(survivors[1], this.getRandomDino(survivors));
            } else if (i % 5 === 0) {
                dino = this.crossOverDinoBrains(survivors[0], new DinoBrain(false));
            } else {
                dino = this.crossOverDinoBrains(survivors[1], new DinoBrain(false));
            }

            new_population.push(this.mutateDinoGenes(dino));
        }

        return new_population;
    }


    // nature inspired merging method, simulates cross over in genetic
    crossOverDinoBrains(dominantBrain, recessiveBrain) {
        // Converting the networks to JSON makes it much easier to manipulate parameters
        let dominantPerceptron = Object.create(dominantBrain.perceptron.toJSON());
        let recessivePerceptron = Object.create(recessiveBrain.perceptron.toJSON());
        let offspring = new DinoBrain();
        let offspringPerceptron = Object.create(dominantBrain.perceptron.toJSON());

        for (let i = 0; i < NEURONS; i++) {
            let dominant_bias = dominantPerceptron.neurons[INPUT_LAYERS + i].bias;
            let recessive_bias = recessivePerceptron.neurons[INPUT_LAYERS + i].bias;

            offspringPerceptron.neurons[INPUT_LAYERS + i].bias = (dominant_bias * DOMINANT_GENE_RATE + recessive_bias * RECESSIVE_GENE_RATE);
        }

        for (let i = 0; i < CONNECTIONS; i++) {
            let dominant_weight = dominantPerceptron.connections[i].weight;
            let recessive_weight = recessivePerceptron.connections[i].weight;

            offspringPerceptron.connections[i].weight = (dominant_weight * DOMINANT_GENE_RATE + recessive_weight * RECESSIVE_GENE_RATE);
        }
        // TODO: enable to merge to LSTM networks
        offspring.perceptron = synaptic.Network.fromJSON(offspringPerceptron);
        return offspring;
    }

    // TODO: implement method to manipulate LSTM cells
    mutateDinoGenes(dinoGene) {
        let oldDinoJson = Object.create(dinoGene.perceptron.toJSON());
        let newDinoJson = Object.create(dinoGene.perceptron.toJSON());
        let newDino = Object.create(dinoGene);

        for (let i = 0; i < NEURONS; i++) {
            newDinoJson.neurons[INPUT_LAYERS + i].bias = this.mutateGene(oldDinoJson.neurons[INPUT_LAYERS + i].bias);
        }

        for (let i = 0; i < CONNECTIONS; i++) {
            newDinoJson.connections[i].weights = this.mutateGene(oldDinoJson.connections[i].weights);
        }

        newDino.perceptron = synaptic.Network.fromJSON(newDinoJson);
        return newDino;
    }

    mutateGene(gene) {
        if (Math.random() < this.mutationRate) {
            gene *= 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
        }
        return gene;
    }

    getRandomDino(population) {
        return Object.create(population[this.random(0, population.length - 1)]);
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
