const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const session = require('express-session');

// Create an Express application instance
const cors = require('cors');
const app = express();
const PORT = 3000;

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Define a schema for the User collection
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
});

// Define a schema for the Trip collection
const tripSchema = new mongoose.Schema({
    name: String,
    destination: String,
    startDate: String,
    endDate: String,
    budget: Number,
    actualSpent: Number,
    status: String,
    description: String,
    email: String,
});

// Create a user & trip model baseed on the schema
const User = mongoose.model('User', userSchema);
const Trip = mongoose.model('Trip', tripSchema);

// Middleware to parse JSON bodies
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));     
app.use(express.json());
app.use(session({
    secret: 'your_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Middleware for JWT validation
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

// Route to register a new user
app.post('/api/signup', async (req, res) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email});
        if (existingUser) {
            return res.status(400).json({error: 'Email already exists'});
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
         res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

// Route to authenticate and log in a user
app.post('/api/login', async (req, res) => {
    try {
        // Check if the email exists
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).json({error: 'Account with this email does not exist'});
        }
        // Compare passwords
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({error: 'Invalid password. Please try again.'});
        }
        // Generate JWT token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token });   
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

// Route to authenticate and log in a user using google login
app.post('/api/google-login', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = new User({
                firstName: payload.given_name,
                lastName: payload.family_name,
                email: payload.email,
                password: '',
            });
            await user.save();
        }
        const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: jwtToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid Google token' });
    }
});


// Protected route to get user details 
app.get('/api/user', verifyToken, async (req, res) => {
    try {
        // Fetch user details
        const user = await User.findOne({email: req.user.email});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
});

// Route to get trip details
app.get('/api/trips', verifyToken, async (req, res) => {
    try {
        const trips = await Trip.find({ email: req.user.email });
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Route to get individual trips
app.get('/api/trips/:id', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // Optional: check if the trip belongs to the authenticated user
        if (trip.email !== req.user.email) {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.status(200).json(trip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trip' });
    }
});

// Route to sign user out
app.post('/api/signout', async (req, res) => {
    try {
        req.session?.destroy(error => {
            if (error) {
                return res.status(500).json({ message: 'Sign out failed' });
            }
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Signed out successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to create a new trip
app.post('/api/trips', verifyToken, async (req, res) => {
    try {
        const { name, destination, startDate, endDate, budget, actualSpent, status, description } = req.body;
  
        const newTrip = new Trip({
            name,
            destination,
            startDate,
            endDate,
            budget,
            actualSpent,
            status,
            description,
            email: req.user.email,
        });
  
        await newTrip.save();
        res.status(201).json({ message: 'Trip created successfully', trip: newTrip });
    } catch (err) {
        console.error('Error creating trip:', err);
        res.status(500).json({ error: 'Failed to create trip' });
    }
});
  
// Route to delete trip
app.delete('/api/trips/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Trip.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Trip not found' });
        res.json({ message: 'Trip deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to edit and update trip
app.put('/api/trips/:id', verifyToken, async (req, res) => {
    const { name, destination, budget, actualSpent, startDate, endDate, status, description } = req.body;
    try {
        const updatedTrip = await Trip.findByIdAndUpdate(
            req.params.id,
            { name, destination, budget, actualSpent, startDate, endDate, status, description },
            { new: true }
        );
        res.json(updatedTrip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update trip' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to my User Registration and Login API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});