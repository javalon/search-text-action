const core = require('@actions/core');
const {getInputs, execute} = require('./lib/index.js');

const inputs = getInputs();

async function run() {
  try {
    const result = await execute(inputs.url, inputs.text, inputs.timeout, inputs.interval);
    core.setOutput('found', result);
    if (!result && inputs.failIfNotFound) {
      core.setFailed('The action ended without finding the search text.');
    }
  } catch (error) {
    core.setOutput('found', false);
    core.setFailed(error.message);
  }
}

run();
