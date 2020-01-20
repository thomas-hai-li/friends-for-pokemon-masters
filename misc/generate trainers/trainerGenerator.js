const uuidv1 = require('uuid/v1');
const randomize = require('randomatic');
const randomName = require('random-name');
const fs = require('fs');

// console.log(randomize('0', 12));
// console.log(randomName.first());
function randomIcon() {
  return (Math.ceil(Math.random() * 29))
}

let predata = {
  "trainers": {}
};

for (var i = 0; i < 10; i++) {
  var obj = {
    "date" : 1566707610000 + i,
    "trainerID" : randomize('0', 16),
    "trainerIconIndex" : randomIcon(),
    "trainerMsg" : "",
    "trainerName" : randomName.first()
  }
  var id = uuidv1();
  console.log(id);

  predata.trainers[id] = obj;
}

var data = JSON.stringify(predata);
fs.writeFile('fakeTrainers.json', data, (err) => {
  console.log(err);
})
