import {GeneticAlgorithm} from "./genetic_algorithm";

export const INPUT_LAYERS = 3;
export const HIDDEN_LAYERS = 6;
export const OUTPUT_LAYERS = 2;

export const NEURONS = HIDDEN_LAYERS + OUTPUT_LAYERS;
export const CONNECTIONS = INPUT_LAYERS * HIDDEN_LAYERS + HIDDEN_LAYERS * OUTPUT_LAYERS;

export class DinoBrain {
    constructor(shouldUseLSTM) {
        if (!shouldUseLSTM) {
            this.perceptron = new synaptic.Architect.Perceptron(INPUT_LAYERS, HIDDEN_LAYERS, OUTPUT_LAYERS);
            this.perceptron.layers.input.set({squash: synaptic.Neuron.squash.TANH});
            this.perceptron.layers.hidden.forEach(function(hiddenLayer){
                hiddenLayer.set({squash: synaptic.Neuron.squash.TANH})
            });
            this.perceptron.layers.output.set({squash: synaptic.Neuron.squash.TANH});
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

        return outputs;
    }

    static normalize(value) {
        // TODO: Research most fitting normalization scheme for INPUT_LAYERS!
        return (value);
    }
}