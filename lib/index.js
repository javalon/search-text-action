const core = require('@actions/core');
const axios = require('axios');

function checkUrl(url, text) {
  return new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      const contentType = response.headers['content-type'];
      var dataResponse = response.data;
      if (contentType && contentType.includes('application/json')) {
        dataResponse = JSON.stringify(response.data);
      }
      resolve(dataResponse.includes(text));
    }).catch((error) => {
      reject(error);
    });
  });
}

function getInputs() {
  return {
    url: core.getInput('url', { required: true }),
    text: core.getInput('text', { required: true }),
    timeout: parseInt(core.getInput('timeout', { required: false })) || 600, // 10 minutes
    interval: parseInt(core.getInput('interval', { required: false })) || 1, // 1 second
    failIfNotFound: core.getInput('fail-if-not-found', { required: false }) != '' ? core.getBooleanInput('fail-if-not-found', { required: false }) : true
  }
}

async function execute(url, text, timeout, interval) {
  return new Promise((resolve) => {
      const endTime = Date.now() + timeout * 1000; // to milliseconds

      const intervalId = setInterval(async () => {
        console.log("Searching...");
        const foundText = await checkUrl(url, text);
        if (foundText) {
          console.log(`Found "${text}" in the response!`);
          clearInterval(intervalId);
          resolve(true);
        } else {
          console.log(`"${text}" not found in the response for now.`);
        }
        if (Date.now() >= endTime) {
          clearInterval(intervalId);
          resolve(false);
        }
      }, interval * 1000);
  });
}

module.exports = {
  execute,
  getInputs,
  checkUrl
};