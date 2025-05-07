const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

const port = process.env.PORT || 5000;


const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);

const orderRoutes = require('./src/routes/orders');
app.use('/api/orders', orderRoutes);

const userRoutes = require('./src/routes/users');
app.use('/api/users', userRoutes);


async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
}

main().then(() => console.log("MongoDB connected successfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
