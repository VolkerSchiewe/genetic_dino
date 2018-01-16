export const INPUT_LAYERS = 5;
export const HIDDEN_LAYERS = 6;
export const OUTPUT_LAYERS = 2;

export const NEURONS = HIDDEN_LAYERS + OUTPUT_LAYERS;
export const CONNECTIONS = INPUT_LAYERS * HIDDEN_LAYERS + HIDDEN_LAYERS * OUTPUT_LAYERS;

export class DinoBrain {
    constructor(shouldUseLSTM) {
        if (!shouldUseLSTM) {
            this.perceptron = new synaptic.Architect.Perceptron(INPUT_LAYERS, HIDDEN_LAYERS, OUTPUT_LAYERS);
            this.perceptron.layers.input.set({squash: synaptic.Neuron.squash.TANH});
            this.perceptron.layers.hidden.forEach(function (hiddenLayer) {
                hiddenLayer.set({squash: synaptic.Neuron.squash.TANH})
            });
            this.perceptron.layers.output.set({squash: synaptic.Neuron.squash.TANH});
        }
        else {
            // TODO: implement option to create LSTM network when controller.duck() is integrated
            throw Error('LSTM is not implemented yet.');
        }
    }

    static normalize(value) {
        // TODO: Research most fitting normalization scheme for INPUT_LAYERS!
        if (value == 'CACTUS_SMALL') return (1);
        if (value == 'CACTUS_LARGE') return (2);
        if (value == 'PTERODACTYL') return (3);
        return (value);
    }

    activateDinoBrain(distance, width, height, dinoY, obstacleType) {
        distance = distance;
        width = width;
        height = height;
        dinoY = dinoY;
        obstacleType = DinoBrain.normalize(obstacleType);
        let inputs = [distance, width, height, dinoY, obstacleType];
        return this.perceptron.activate(inputs);
    }
}