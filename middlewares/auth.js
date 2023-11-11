const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.isAdmin !== true) {
      return res.status(403).json({
        status: 'fail',
        message: 'Only admins are allowed.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!',
    });
  }
};
