const { send } = require('micro');
const { existsSync } = require("fs")

const validateReq = require('./lib/validateReq');
const { exec } = require('child_process');

const workDir = process.env.NSW_WORK_DIR || '/var/www/html';
const scriptName = process.env.NSW_SCRIPT_NAME || 'build';
const timeout = parseInt(process.env.NSW_TIMEOUT) * 1000 || 30 * 1000;

// CRITICAL: exit early if no token is defined.
if (!process.env.NSW_TOKEN) {
  console.error('NO TOKEN DEFINED, EXITING.');
  process.exit(9);
}

// CRITICAL: exit early if the workDir does not exists
if (!existsSync(workDir)) {
  console.error('WORKDIR DOES NOT EXISTS, EXITING.');
  process.exit(1);
}

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (err) {
    if (process.env.NODE_ENV && process.NODE_ENV === 'development') {
      console.error(err.stack);
    }
    console.error(err.message);
    if (err.statusCode) {
      return send(res, err.statusCode, err.message);
    }
    return send(res, 500, 'Internal Server Error');
  }
};

module.exports = handleErrors(async (req, res) => {
  await validateReq(req);
  exec(`npm run ${scriptName}`, {cwd: workDir, timeout}, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      send(res, 500)
      return
    }
    console.log(stdout);
    send(res, 204);
  });
});
