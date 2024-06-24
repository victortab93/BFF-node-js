const createUser = ({username, password, devices = []}) => ({
    username,
    password,
    devices,
    
    addDevice(device) {
        this.devices.push(device);
    },
    updateDevice(deviceId, lastLogin) {
        const device = this.devices.find(d => d.deviceId === deviceId);
        if(device){
            device.lastLogin = lastLogin;
        }
    },
    getDevice(deviceId) {
        return this.devices.find(d => d.deviceId === deviceId);
    },
    getDevicesByType(type){
        return this.devices.filter(d => d.type === type);
    }
});

module.exports = createUser;