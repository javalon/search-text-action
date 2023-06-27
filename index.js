const core = require('@actions/core');
const {getInputs, execute} = require('./lib/index.js');

const inputs = getInputs();

async function run() {
  try {
    const result = await execute(inputs.url, inputs.text, inputs.timeout, inputs.interval);
    core.setOutput('found', result);
  if(inputs.fail_if_not_found) {
    core.setFailed('The action ended without finding the search text.');
  }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();


