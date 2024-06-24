const { login, authenticationToken }  =require('../services/authService');

const loginController = async (req, res) => {
    try {
        const { username, password, fingerprint } = req.body;
        const userAgent = req.headers['user-agent'];
        const { token, deviceId } = await login(username, password, userAgent, fingerprint);
        
        req.session.token = token;
        req.session.deviceId = deviceId;
        res.json({ message: 'Logged in'});
    } catch(err) {
        res.status(401).json({ message : err.message });
    }
};

const logoutController = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
};

module.exports = {
    loginController,
    logoutController,
  };