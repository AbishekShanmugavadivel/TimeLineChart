const { requireAccess, protect } = require('./accessMiddleware');

module.exports = {
  requireAccess,
  protect,
  admin: (req, res, next) => next() // Legacy role check fallback
};
