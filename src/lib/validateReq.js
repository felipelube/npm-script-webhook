const token = process.env.NSW_TOKEN;

module.exports = (pathname) => {
  if (!pathname) {
    throw new Error('Invalid request');
  } else {
    const urlToken = pathname.split('/')[1];
    if (!urlToken || (token !== urlToken)) {
      throw new Error('Invalid token');
    }
  }
};
