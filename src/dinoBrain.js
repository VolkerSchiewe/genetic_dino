import { MAPS_COUNT } from './components/app';
import * as synaptic from 'synaptic';

export const INPUT_LAYERS = 4;
export const HIDDEN_LAYERS = 6;
export const OUTPUT_LAYERS = 2;

export const NEURONS = HIDDEN_LAYERS + OUTPUT_LAYERS;
export const CONNECTIONS = INPUT_LAYERS * HIDDEN_LAYERS + HIDDEN_LAYERS * OUTPUT_LAYERS;

// base dinosaur class, contains the neuronal network and a isAlive indicator
export class DinoBrain {
    constructor() {
        // initialize neuronal network
        this.perceptron = new synaptic.Architect.Perceptron(INPUT_LAYERS, HIDDEN_LAYERS, OUTPUT_LAYERS);
        this.perceptron.layers.input.set({squash: synaptic.Neuron.squash.TANH});
        this.perceptron.layers.hidden.forEach((hiddenLayer) => {
            hiddenLayer.set({squash: synaptic.Neuron.squash.TANH});
        });
        this.perceptron.layers.output.set({squash: synaptic.Neuron.squash.TANH});

        // initialize isAlive indicator
        this.isAlive = new Array(MAPS_COUNT);
        for (let i = 0; i < this.isAlive.length; i++) {
            this.isAlive[i] = 1;
        }
    }

    // activates the neuronal network and returns its output value
    activateDinoBrain(distance, width, height, dinoHeight, isOverObstacle) {
        let inputs = [distance, height, dinoHeight, isOverObstacle];
        return this.perceptron.activate(inputs);
    }

    toJson() {
        return this.perceptron.toJSON();
    }

    static parseJson(json) {
        let dino = new DinoBrain();
        dino.perceptron = synaptic.Network.fromJSON((json));
        return dino;
    }

    countDinosAlive() {
        return this.isAlive.reduce((a, b) => a + b, 0);
    }
}