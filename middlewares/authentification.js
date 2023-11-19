const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check if there is an authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({error: 'Unauthorized!'});
  }
  const token = authHeader.split(' ')[1];
  try {
    // Check JWT token validity
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({error: 'Unauthorized!'})
  }
};