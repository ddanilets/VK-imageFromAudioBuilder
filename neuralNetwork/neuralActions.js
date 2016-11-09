import fs from 'fs';
import jimp from 'jimp';
const brain = require('brain.js');
import request from 'superagent';
const net = new brain.NeuralNetwork();
import scale from 'scale-number-range';

const mask = {
  0: 0,
  1: 'Rock',
  2: 'Pop',
  3: 'Rap & Hip-Hop',
  4: 'Easy Listening',
  5: 'House & Dance',
  6: 'Instrumental',
  7: 'Metal',
  8: 'Dubstep',
  9: 0,
  10: 'Drum & Bass',
  11: 'Trance',
  12: 'Chanson',
  13: 'Ethnic',
  14: 'Acoustic & Vocal',
  15: 'Reggae',
  16: 'Classical',
  17: 'Indie Pop',
  18: 0,
  19: 'Speech',
  20: 0,
  21: 'Alternative',
  22: 'Electropop & Disco',
  23: 'Jazz & Blues',
};

export function getGenresByPhotoUrl(url = 'https://pp.vk.me/c629313/v629313574/240ad/ESi2RPvKKCc.jpg') {
  return new Promise((r, rj) => {
    new Promise((resolve, reject) => {
      fs.readFile('./neuralNetwork/network/175Users_a_query_3000_0.0006.json',
        'utf8', (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(JSON.parse(data));
        });
    }).then(data => {
      net.fromJSON(data);
      new Promise(resolve => {
        const req = request('GET', url);
        req.end((err, res) => {
          if (err) {
            resolve();
          } else {
            jimp.read(res.body).then(image => {
              resolve(image);
            });
          }
        });
      }).then((image) => {
        const imageColor = [];
        for (let i = 0; i < 400; i++) {
          let tmp = 0;
          for (let j = 0; j < 400; j++) {
            tmp += image.getPixelColor(j, i);
          }
          imageColor.push(tmp / image.bitmap.width);
        }
        r(net.run(imageColor.map(el => {
          return scale(el,
            Math.min.apply(null, imageColor),
            Math.max.apply(null, imageColor), 0.001, 0.999);
        })).map((el, key) => {
          return { value: el, genre: mask[key] };
        }).filter(el => {
          return el.genre !== 0;
        }).sort((a, b) => {
          if (a.value > b.value) {
            return -1;
          } else if (a.value < b.value) {
            return 1;
          }
          return 0;
        }).filter(el => {
          return el.value > 0.7;
        }));
      });
    });
  });
}
