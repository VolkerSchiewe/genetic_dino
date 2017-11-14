var synaptic = require('synaptic');
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

function Perceptron(input, hidden, output)
{
	// create the layers
	var inputLayer = new Layer(input);
	var hiddenLayer = new Layer(hidden);
	var outputLayer = new Layer(output);

	// connect the layers
	inputLayer.project(hiddenLayer);
	hiddenLayer.project(outputLayer);

	// set the layers
	this.set({
		input: inputLayer,
		hidden: [hiddenLayer],
		output: outputLayer
	});
}

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;
var dinoBrain = new Perceptron(2,5,1);
console.log("random initialized weights..")
console.log(dinoBrain.activate([0,0])); // ~0.5
console.log(dinoBrain.activate([1,0])); // ~0.5
console.log(dinoBrain.activate([0,1])); // ~0.5
console.log(dinoBrain.activate([1,1])); // ~0.5


var myTrainer = new Trainer(dinoBrain);
myTrainer.XOR(); //{ error: 0.004998819355993572, iterations: 21871, time: 356 }

console.log("training done..")
console.log(dinoBrain.activate([0,0])); // 0.0268581547421616
console.log(dinoBrain.activate([1,0])); // 0.9829673642853368
console.log(dinoBrain.activate([0,1])); // 0.9831714267395621
console.log(dinoBrain.activate([1,1])); // 0.02128894618097928