/*
  NOTE:
  Exports a function named classifier, that takes 2 or 3 params:
  the ML model, the image to classify and an optional callback
  
  No idea how exactly it exactly works, copied it from:
  https://github.com/Sean12697/MobileNet-via-TensorFlowJS-in-NodeJS/
*/

const jpeg = require('jpeg-js');

const mobilenet = require('@tensorflow-models/mobilenet');
global.fetch = require('node-fetch');

// Import image loading functions
const { imageToInput } = require('./imageOptimizer.js');

const NUMBER_OF_CHANNELS = 3;

const loadModel = async path => {
  const mn = new mobilenet.MobileNet(1, 1);
  await mn.load()
  return mn
}

const classify = async (model, image, callback) => {
  const pixels = jpeg.decode(image, true);
  const input = imageToInput(pixels, NUMBER_OF_CHANNELS)
  const mn_model = await loadModel(model)
  const predictions = await mn_model.classify(input)

  let result = {
    detectedObj: predictions[0].className,
    probability: predictions[0].probability
  }
  
  return callback(result);
}

module.exports = { classify: classify }
