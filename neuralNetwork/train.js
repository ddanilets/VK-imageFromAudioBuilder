import fs from 'fs';
import jimp from 'jimp';
const brain = require('brain.js');
import request from 'superagent';
const net = new brain.NeuralNetwork();
import scale from 'scale-number-range';

let users = null;

const reader = new Promise((resolve, reject) => {
  fs.readFile('./users.json', 'utf8', function (err, data) {
    if (err) {
      reject(console.log(err));
    }
    resolve(JSON.parse(data));
  });
});


reader.then(data => {
  users = data.map(el => {
    return {
      img: el.img,
      genres: el.genres.filter(genre => {
        return genre !== null && genre !== 18;
      }),
    };
  });
  Promise.all(users.map((user) => {
    return new Promise(resolve => {
      const req = request('GET', user.img);
      req.end((err, res) => {
        if (err) {
          resolve();
        } else {
          jimp.read(res.body).then(image => {
            resolve({ image, genres: user.genres });
          }).catch(e => {
            console.log(e);
          });
        }
      });
    });
  })).then((userImg) => {
    userImg = userImg.filter(el => el);
    const trainingData = userImg.map((user) => {
      const imageColor = [];
      for (let i = 0; i < 400; i++) {
        let tmp = 0;
        for (let j = 0; j < 400; j++) {
          tmp += user.image.getPixelColor(j, i);
        }
        imageColor.push(tmp / user.image.bitmap.width);
      }
      const newGenres = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        19: 0,
        21: 0,
        22: 0,
        1001: 0,
      };
      user.genres.forEach(genre => {
        newGenres[genre] = newGenres[genre] + 1;
      });
      for (const genre in newGenres) {
        if (newGenres.hasOwnProperty(genre)) {

          newGenres[genre] = 1 - (1 / newGenres[genre]);
          if (newGenres[genre] === -Infinity) {
            delete newGenres[genre];
          }
        }
      }
      const output = [];
      for (let i = 1; i <= 23; i++) {
        output.push(newGenres[i] > 0 ? newGenres[i] : 0);
      }
      output[23] = newGenres['1001'] > 0 ? newGenres['1001'] : 0;
      return {
        input: imageColor.map(el => {
          return scale(el,
            Math.min.apply(null, imageColor),
            Math.max.apply(null, imageColor), 0.001, 0.999);
        }),
        output,
      };
    }).filter(user => {
      return !!user.output[0] && !!user.input[0];
    });
    console.log('users dataset created.');
    console.log('start training.');
    net.train(trainingData, {
      errorThresh: 0.0006,
      iterations: 3000,
      log: true,
      logPeriod: 100,
      learningRate: 0.1,
    });
    console.log('users dataset with Brain.js train done.');
    fs.writeFile('./neuralNetwork/network/175Users_a_query_3000_0.0006.json',
      JSON.stringify(net.toJSON(), null, 2), (err) => {
      console.log(err);
    });
    console.log('users dataset with Brain.js saved to ./network/175Users_a_query_20000_0.005.json');
  }).catch(e => {
    console.log(e);
  });
}).catch(e => {
  console.log(e);
});
