const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const createUser = require('../entities/User');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  devices: [
    {
      deviceId: String,
      userAgent: String,
      type: String,
      lastLogin: Date,
      fingerprint: String,
    },
  ],
});

const UserModel = mongoose.model('User', userSchema);

const findUserByUsernameAndPassword = async (username, password) => {
  const userDoc = await UserModel.findOne({ username });
  if (!userDoc) return null;

  const isPasswordMatch = await bcrypt.compare(password, userDoc.password);
  if (!isPasswordMatch) return null;

  return createUser(userDoc.toObject());
};

const findUserByUsername = async (username) => {
  const userDoc = await UserModel.findOne({ username });
  if (!userDoc) return null;
  return createUser(userDoc.toObject());
};

const saveUser = async (user) => {
  let userDoc = await UserModel.findOne({ username: user.username });
  if (userDoc) {
    userDoc.password = user.password;
    userDoc.devices = user.devices;
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    userDoc = new UserModel(user);
  }
  await userDoc.save();
  return createUser(userDoc.toObject());
};

module.exports = {
  findUserByUsernameAndPassword,
  findUserByUsername,
  saveUser
};
