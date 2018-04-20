const { createError, json } = require('micro');

const token = process.env.NSW_TOKEN;

module.exports = async (req) => {
  if (req.method !== 'POST') {
    throw createError(405, 'Method not allowed');
  } else {
    const body = await json(req);
    if (!body.secret || body.secret !== token) {
      throw createError(403, 'Invalid token');
    }
  }
};
