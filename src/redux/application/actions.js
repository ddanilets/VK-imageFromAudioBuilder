/* global VK*/
import * as constants from './constants';
import backend from '../../../backend';

export function login() {
  return dispatch => {
    VK.Auth.login((e) => {
      dispatch({ type: constants.APPLICATION_LOGIN_TO_VK_SUCCESS, payload: e });
    }, VK.access.AUDIO);

    dispatch({ type: constants.APPLICATION_LOGIN_TO_VK });
  };
}

export function getUsersAndAudios() {
  return dispatch => {
    VK.Api.call('users.search',
      { q: 'a', fields: 'photo_400_orig,can_see_audio', count: 1000 }, (r) => {
        const usersWithAudio = [];
        Promise.all(r.response.filter(el => {
          return el.can_see_audio === 1;
        }).map(el => {
          return { id: el.uid, photo: el.photo_400_orig };
        }).map((el, key) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              VK.Api.call('audio.get', { owner_id: el.id }, (res) => {
                if (res.error) {
                  resolve({});
                  console.log(`rejected user no. ${key}`);
                }
                if (res.response) {
                  resolve({
                    img: el.photo, genres: res.response.map(item => { return item.genre; }), });
                  console.log(`pushed user no. ${key}`);
                }
              });
            }, (key * 600));
          });
        })).then(values => {
          backend.postUsers(values.filter(el => { return el.img; }));
        });
      }
    );
  };
}

export function postUrl(url) {
  return dispatch => {
    backend.postUrl(url).then(result => {
      dispatch({ type: constants.GET_GENRES, payload: result });
    });
  };
}
