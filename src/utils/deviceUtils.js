const { v4: uuidv4 } = require('uuid');

const detectDeviceType = (userAgent) => {
    return /mobile/i.text(userAgent) ? 'mobile' : 'pc';
}

const createDevice = (userAgent, fingerprint) => ({
    userAgent,
    fingerprint,
    deviceId: uuidv4(),
    type: detectDeviceType(userAgent),
    lastLogin: new Date()
});

module.exports = {
    detectDeviceType,
    createDevice
}