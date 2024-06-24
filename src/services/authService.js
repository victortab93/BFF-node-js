const jwt = require('jsonwebtoken');
const { createDevice } = require('../utils/deviceUtils');
const UserRepository = require('../repositories/userRepositoryMongoose');

const login = async (username, password, userAgent, fingerprint) => {
    const user = await UserRepository.findUserByUsernameAndPassword(username, password);
    if(!user){
        throw new Error('Invalid credentials');
    }

    const deviceType = createDevice(userAgent, fingerprint).type;
    const existingDevice = user.getDevice(fingerprint);

    const deviceCount = user.getDevicesByType(deviceType).length;
    const deviceLimit = deviceType === 'mobile' ? 2 : 2;

    if (deviceCount >= deviceLimit && !existingDevice) {
        throw new Error('Device limit reached');
    }

    const deviceId = existingDevice ? existingDevice.deviceId : createDevice(userAgent, fingerprint).deviceId;

    if (!existingDevice) {
        user.addDevice({ deviceId, userAgent, type: deviceType, lastLogin: new Date(), fingerprint });
    } else {
        user.updateDevice(deviceId, new Date());
    }

    await UserRepository.saveUser(user);

    const token = jwt.sign({ userId: user.username, userAgent, deviceId, fingerprint }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, deviceId };
};

const authenticateToken = async (token, userAgent, fingerprint, sessionDeviceId) => {
    return jwt.verify( token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            throw new Error('Unauthorized');
        }
        
        const user = await UserRepository.findUserByUsername(decode.userId);
        const device = user.getDevice(decoded.deviceId);

        if(!device || jwt.decode.userAgent !== userAgent || 
            decoded.deviceId !== sessionDeviceId || decoded.fingerprint !== fingerprint){
            throw new Error('Unauthorized: Invalid user-agent, device ID, or fingerprint');
        }

        return decoded.userId;
    });
};

module.exports = {
    login,
    authenticateToken
}