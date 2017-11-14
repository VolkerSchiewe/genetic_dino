var synaptic = require('synaptic');

const INPUT = 2;
const HIDDEN = 5;
const OUTPUT = 1;

// Two networks of the same size
var network1 = createDinoBrain(INPUT, HIDDEN, OUTPUT);
var network2 = createDinoBrain(INPUT, HIDDEN, OUTPUT);
var offSpringNetwork = crossOver(network1, network2);

// Testing some stuff with random initialized networks
activateDinoBrain(network1, 0.20, 0.11);
activateDinoBrain(network2, 54, 31);
activateDinoBrain(offSpringNetwork, 1050, 2100);

function createDinoBrain(INPUT, HIDDEN, OUTPUT){
  // Create basic fully connected perceptron according to input-, hidden- and output-layers
  network = new synaptic.Architect.Perceptron(INPUT, HIDDEN, OUTPUT);
  return network
}

function activateDinoBrain(network, distance, width){   
  // input 1: the horizontal distance between dino and cactus
  var input1 = normalize(distance)
  
  // input 2: the width of stacked cacteens by x-axis
  var input2 = normalize(width)

  // create an array of all inputs
  var inputs = [input1, input2];
  
  // calculate outputs by activating synaptic neural network
  var outputs = network.activate(inputs);
    
  // jump if output is higher than 0.50
  if (outputs[0] > 0.50) console.log(outputs[0]);
}

// Method to merge two networks bias and weights.
function crossOver(network1, network2){
  // Converting the networks to JSON makes it all a whole lot easier
  network1 = network1.toJSON();
  network2 = network2.toJSON();
  
  // Create a network, this will be the result of the two networks
  var offspring = new synaptic.Architect.Perceptron(INPUT, HIDDEN, OUTPUT);
  offspring = offspring.toJSON();
  
  var neurons = HIDDEN + OUTPUT; // you only need to crossover the bias of the hidden and output neurson
  var connections = INPUT * HIDDEN + HIDDEN * OUTPUT; // amount of connections of which you can modify the weight
  
  // Let's combine the neuron biases for the offspring
  for(var i = 0; i < neurons; i++){
    var bias1 = network1.neurons[INPUT+i].bias; // get's the bias of neuron i of network1
    var bias2 = network2.neurons[INPUT+i].bias; // get's the bias of neuron i of network2
    
    var new_bias = (bias1 + bias2) / 2; // this is the function that calculates the new bias, do whatever you want here
    
    offspring.neurons[INPUT+i].bias = new_bias; 
  }
  
  // Let's combine the neuron conection weights for the offspring
  for(var i = 0; i < connections; i++){
    var weight1 = network1.connections[i].weight; // get's the weight of connection i of network1
    var weight2 = network2.connections[i].weight; // get's the weight of connection i of network2
    
    var new_weight = (weight1 + weight2) / 2; // this is the function that calculates the new bias, do whatever you want here
    
    offspring.connections[i].weight = new_weight; 
    console.log(offspring.neurons)
  }
  // Now convert the offspring JSON back to a network and return it
  return synaptic.Network.fromJSON(offspring);
}

function normalize(value){
  // do some normalization here so the synaptic perceptron can output some reasonable values with perceptron
  return (value);
}