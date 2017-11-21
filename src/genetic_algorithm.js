import {CONNECTIONS, DinoBrain, INPUT_LAYERS, NEURONS} from "./dino_brain";

const DOMINANT_GENE_RATE = 0.65;
const RECESSIVE_GENE_RATE = 0.35;

export class GeneticAlgorithm {
    constructor(populationSize) {
        this.populationSize = populationSize
    }

    generatePopulation() {
        let population = [];

        for (let i = 0; i < this.populationSize; i++) {
            population.push(new DinoBrain(false));
        }
        return population;
    }

    // nature inspired merging method, simulates cross over in genetic
    crossOverDinoBrains(dominantBrain, recessiveBrain) {
        // Converting the networks to JSON makes it much easier to manipulate parameters
        let dominantPerceptron = dominantBrain.perceptron.toJSON();
        let recessivePerceptron = recessiveBrain.perceptron.toJSON();
        let offspringPerceptron = new DinoBrain(false).perceptron.toJSON();

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
        dominantBrain.perceptron = synaptic.Network.fromJSON(offspringPerceptron);
        return dominantBrain
    }

    // TODO: implement method to manipulate LSTM cells
    static mutateDinoGenes(dinoGene) {
        let i;
        let dinoPerceptron = dinoGene.perceptron.toJSON();
        for (i = 0; i < NEURONS; i++) {
            dinoPerceptron.neurons[INPUT_LAYERS + i].bias = GeneticAlgorithm.mutateGene(dinoPerceptron.neurons[INPUT_LAYERS + 1].bias);
        }
        for (i = 0; i < CONNECTIONS; i++) {
            dinoPerceptron.connections[i].weights = GeneticAlgorithm.mutateGene(dinoPerceptron.connections[i].weights);
        }
        dinoGene.perceptron = synaptic.Network.fromJSON(dinoPerceptron);
        return dinoGene
    }

    // Returns new population, using bredDinoBrains
    // TODO: Research better evolution algorithms
    evolvePopulation(dinoAiArray) {
        let newDinoBrain = new DinoBrain(false);
        let bestGenes = dinoAiArray[0];
        let goodGenes = this.crossOverDinoBrains(dinoAiArray[0], dinoAiArray[1]);
        let mediumGenes = this.crossOverDinoBrains(dinoAiArray[0], dinoAiArray[2]);
        let freshGenes = this.crossOverDinoBrains(dinoAiArray[0], newDinoBrain);

        return DinoBrain.bredDinoBrains(bestGenes, goodGenes, mediumGenes, freshGenes, this.populationSize);
    }

    // TODO: Research about most efficient mutation rate and factor
    static mutateGene(gene) {
        let mutateRate = 0.2;
        if (Math.random() < mutateRate) {
            gene *= 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
        }
        return gene;
    }
}
