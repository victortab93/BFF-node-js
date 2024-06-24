const authService = require('../services/authService');

const authenticate = async(req, res, next) => {
    const token = req.session.token;
    if(!token) {
        return res.status(401).json({message: 'Unathorized'});
    }

    try {
        const userId = await authService.authenticateToken(token
            , req.headers['user-agent']
            , req.headers['fingerprint']
            , req.session.deviceId)
        
        req.userId = userId;
        next();
    } catch(err) {
        res.status(401).json({ message: err.message });
    }
};

module.exports = authenticate;