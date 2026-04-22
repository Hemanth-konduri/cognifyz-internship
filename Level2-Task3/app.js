const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Temporary server-side storage
const users = [];

// GET route - show the form
app.get('/', (req, res) => {
    res.render('index', { errors: [] });
});

// POST route - server-side validation + store data
app.post('/submit', (req, res) => {
    const { name, email, password, phone } = req.body;
    const errors = [];

    // Server-side validation
    if (!name || name.trim() === '') errors.push('Name is required');
    if (!email || !email.includes('@')) errors.push('Valid email is required');
    if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
    if (!phone || phone.length < 10) errors.push('Valid phone number is required');

    if (errors.length > 0) {
        return res.render('index', { errors });
    }

    // Store in temporary storage
    users.push({ name, email, phone });
    console.log('Registered Users:', users);

    res.render('success', { name, email, phone });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});