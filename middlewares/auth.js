const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const tokenControl = jwt.verify(token, process.env.JWT_SECRET);
        const userId = tokenControl.user_id; 
        req.auth = { userId: userId }; 
        next();
    } catch (error) {
        res.status(401).json({ error: error || 'Unauthorized' });
    }
};