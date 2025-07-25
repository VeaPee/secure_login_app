const xss = require('xss');
const validator = require('validator');

const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
        if (key === 'email') {
          req.body[key] = validator.isEmail(req.body[key]) ? req.body[key] : '';
        }
      }
    }
  }
  next();
};

module.exports = sanitizeInput;