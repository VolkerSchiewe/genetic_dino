import {GeneticAlgorithm} from "./genetic_algorithm";

export const INPUT_LAYERS = 3;
export const HIDDEN_LAYERS = 6;
export const OUTPUT_LAYERS = 1;

export const NEURONS = HIDDEN_LAYERS + OUTPUT_LAYERS;
export const CONNECTIONS = INPUT_LAYERS * HIDDEN_LAYERS + HIDDEN_LAYERS * OUTPUT_LAYERS;

export class DinoBrain {
    constructor(shouldUseLSTM) {
        if (!shouldUseLSTM) {
            this.perceptron = new synaptic.Architect.Perceptron(INPUT_LAYERS, HIDDEN_LAYERS, OUTPUT_LAYERS);
        }
        else {
            // TODO: implement option to create LSTM network when controller.duck() is integrated
            throw Error('LSTM is not implemented yet.');
        }
    }

    activateDinoBrain(distance, width, height) {
        distance = DinoBrain.normalize(distance);
        width = DinoBrain.normalize(width);
        height = DinoBrain.normalize(height);
        let inputs = [distance, width, height];
        let outputs = this.perceptron.activate(inputs);

        return outputs[0];
    }

    static bredDinoBrains(bestGenes, goodGenes, mediumGenes, freshGenes, populationSize) {
        let population = [];
        for (let i = 0; i < populationSize; i++) {
            if (i === 0) {
                population.push(bestGenes);
            } else if (i === 1) {
                population.push(GeneticAlgorithm.mutateDinoGenes(bestGenes));
            } else if (i === 2) {
                population.push(freshGenes);
            } else if (i % 3 === 0) {
                population.push(GeneticAlgorithm.mutateDinoGenes(goodGenes));
            } else if (i % 4 === 0) {
                population.push(GeneticAlgorithm.mutateDinoGenes(mediumGenes));
            } else {
                population.push(GeneticAlgorithm.mutateDinoGenes(freshGenes));
            }
        }
        return population;
    }

    static normalize(value) {
        // TODO: Research most fitting normalization scheme for INPUT_LAYERS!
        return (value);
    }
}