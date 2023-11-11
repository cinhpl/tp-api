function authorize(req, res, next) {
  const isAdmin = req.user && req.user.isAdmin;

  if (!isAdmin) {
      return res.status(401).json({ error: 'Not authorized' });
  }

  next();
}

module.exports = authorize;