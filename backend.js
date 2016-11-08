import request from 'superagent';

class Backend {
  postUsers(users) {
    this.postRequest('/users', JSON.stringify(users));
  }

  getRequest(url, params) {
    return new Promise((resolve, reject) => {
      const requestInstance = request('GET', url);

      requestInstance.accept('application/json')
        .query(params)
        .end((err, res) => {
          if (err) {
            reject(res.body);
          } else {
            resolve(res.body);
          }
        });
    });
  }

  postRequest(url, data) {
    return new Promise((resolve, reject) => {
      request('POST', url)
        .accept('application/json')
        .send({ data })
        .end((err, res) => {
          if (err) {
            reject(res.body);
          } else {
            resolve(res.body);
          }
        });
    });
  }
}

export default new Backend();
