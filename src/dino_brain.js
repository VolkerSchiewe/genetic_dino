import {MAPS_COUNT} from "./components/app.jsx";
import {precisionRound} from "./utils.js";

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
            this.perceptron.layers.hidden.forEach((hiddenLayer) => {
                hiddenLayer.set({squash: synaptic.Neuron.squash.TANH})
            });
            this.perceptron.layers.output.set({squash: synaptic.Neuron.squash.TANH});
            this.isAlive = new Array(MAPS_COUNT);
            for (let i = 0; i < this.isAlive.length; i++) {
                this.isAlive[i] = 1;
            }
        }
        else {
            // TODO: implement option to create LSTM network when controller.duck() is integrated
            throw Error('LSTM is not implemented yet.');
        }
    }

    static normalize(value) {
        // TODO: Research most fitting normalization scheme for INPUT_LAYERS!
        return (value);
    }

    activateDinoBrain(distance, width, height) {
        distance = DinoBrain.normalize(distance);
        width = DinoBrain.normalize(width);
        height = DinoBrain.normalize(height);
        let inputs = [distance, width, height];
        return this.perceptron.activate(inputs);
    }

    toJson() {
        return this.perceptron.toJSON()
    }

    parseJson(json) {
        this.perceptron = JSON.parse(json)
    }

    countDinosAlive() {
        return this.isAlive.reduce((a, b) => a + b, 0);
    }

    // for debugging
    getNnValues(){
        return {
            neurons: this.perceptron.neurons().map((object) => {
                return precisionRound(object.neuron.bias, 2)
            }).join(','),
            // weights: this.perceptron.connections().map((connection) => (connection.weights))
        }
    }
}