const express = require('express');
const { loginController, logoutController } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/data', authenticate, (req, res) => {
    res.json({ data: 'Secure data' });
});
module.exports = router;
