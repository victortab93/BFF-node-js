const dotenv = require('dotenv');
const app = require('./app');

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}`});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running in ${env} mode on port ${PORT}`);
})