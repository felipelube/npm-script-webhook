const { send, createError } = require('micro');
const { parse } = require('url');
const { promisify } = require('util');

const validateReq = require('./lib/validateReq');
const exec = promisify(require('child_process').exec);

// Critical: exit early if the token is not defined.
if (!process.env.NSW_TOKEN) {
  console.error('NO TOKEN DEFINED, EXITING.');
  process.exit(1);
}

const workDir = process.env.NSW_WORK_DIR || '/var/www/html';
const scriptName = process.env.NSW_SCRIPT_NAME || 'build';
const timeout = process.env.NSW_TIMEOUT || 10 * 1000;

module.exports = async (req, res) => {
  const { pathname } = await parse(req.url, false);
  try {
    await validateReq(pathname);
  } catch (e) {
    throw createError(400, e.message);
  }

  try {
    await exec(`npm run ${scriptName}`, {
      cwd: workDir,
      timeout,
    });
    send(res, 204);
  } catch (e) {
    throw e; // HTTP 500
  }
};
