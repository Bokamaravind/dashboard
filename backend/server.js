// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');


const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://bokamaravind_07:h6O9pI0zPx536SUD@cluster0.mfyvep3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connect error:', err));


app.use('/api', apiRoutes);
app.use('/', apiRoutes);

app.get('/', (req, res) => {
  res.send('API backend server is working!');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
