import {CONNECTIONS, DinoBrain, INPUT_LAYERS, NEURONS} from './dino_brain';
import * as synaptic from 'synaptic';

const DOMINANT_GENE_RATE = 0.65;
const RECESSIVE_GENE_RATE = 0.35;

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

    // nature inspired merging method, simulates cross over in genetic
    crossOverDinoBrains(dominantBrain, recessiveBrain) {
        // Converting the networks to JSON makes it much easier to manipulate parameters
        let dominantPerceptron = dominantBrain.perceptron.toJSON();
        let recessivePerceptron = recessiveBrain.perceptron.toJSON();
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
        let i;
        let dinoPerceptron = Object.create(dinoGene.perceptron.toJSON());
        for (i = 0; i < NEURONS; i++) {
            dinoPerceptron.neurons[INPUT_LAYERS + i].bias = this.mutateGene(dinoPerceptron.neurons[INPUT_LAYERS + 1].bias);
        }
        for (i = 0; i < CONNECTIONS; i++) {
            dinoPerceptron.connections[i].weights = this.mutateGene(dinoPerceptron.connections[i].weights);
        }
        dinoGene.perceptron = synaptic.Network.fromJSON(dinoPerceptron);
        return dinoGene;
    }

    // Returns new population, using bredDinoBrains
    // TODO: Research better evolution algorithms
    evolvePopulation(dinoAiArray) {
        let newDinoBrain = new DinoBrain(false);
        let best = dinoAiArray[0];
        let second = dinoAiArray[1];
        let third = dinoAiArray[2];
        let goodGenes = this.crossOverDinoBrains(dinoAiArray[0], dinoAiArray[1]);
        let mediumGenes = this.crossOverDinoBrains(dinoAiArray[0], dinoAiArray[2]);
        let freshGenes = this.crossOverDinoBrains(dinoAiArray[0], newDinoBrain);

        return this.bredDinoBrains(best, second, third, goodGenes, mediumGenes, freshGenes);
    }

    bredDinoBrains(best, second, third, goodGenes, mediumGenes, freshGenes) {
        let new_population = [];
        for (let i = 0; i < this.populationSize; i++) {
            if (i === 0) {
                new_population.push(Object.create(best));
            } else if (i === 1) {
                new_population.push(Object.create(second));
            } else if (i === 2) {
                new_population.push(Object.create(third));
            } else if (i % 3 === 0) {
                new_population.push(this.mutateDinoGenes(Object.create(goodGenes)));
            } else if (i % 4 === 0) {
                new_population.push(this.mutateDinoGenes(Object.create(freshGenes)));
            } else if (i % 5 === 0) {
                new_population.push(this.mutateDinoGenes(Object.create(best)));
            } else {
                new_population.push(this.mutateDinoGenes(Object.create(mediumGenes)));
            }
        }
        return new_population;
    }

    // TODO: Research about most efficient mutation rate and factor
    mutateGene(gene) {
        if (Math.random() < this.mutationRate) {
            gene *= 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
        }
        return gene;
    }
}
