// Check if the user is admin 
function authorize(req, res, next) {
  const isAdmin = req.user && req.user.isAdmin;

  if (!isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = authorize;