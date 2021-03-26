// No idea how exactly it exactly works, copied it from:
// https://github.com/Sean12697/MobileNet-via-TensorFlowJS-in-NodeJS/

const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
global.fetch = require('node-fetch');

// Import image loading functions
const {readImage, imageToInput} = require('./loadImages.js');

// Used to speed things up by binding to TF C++
// Not sure if it will work while deployed to heroku
// TODO: Fix the issue with registering backend
// require('@tensorflow/tfjs-node');

const NUMBER_OF_CHANNELS = 3;

const loadModel = async path => {
  const mn = new mobilenet.MobileNet(1, 1);
  await mn.load()
  return mn
}

const classify = async (model, path, callback) => {
  const image = readImage(path)
  const input = imageToInput(image, NUMBER_OF_CHANNELS)

  const mn_model = await loadModel(model)
  const predictions = await mn_model.classify(input)

  // console.log(`Classifications results: ${predictions[0].className}, probability: ${predictions[0].probability}`);
  let isPackage = (predictions[0].className == 'carton' || predictions[0].className == 'packet') && predictions[0].probability > 0.2;
  if(isPackage) {
    console.log("Probably a package has arrived");
  } else {
    console.log("Event occured, but probably not a package");
  }
  
  callback();
}

module.exports = {
  classify: classify
}
