const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// GET route - show the form
app.get('/', (req, res) => {
    res.render('index');
});

// POST route - handle form submission
app.post('/submit', (req, res) => {
    const { name, email, password, phone } = req.body;
    res.render('success', { name, email, phone });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});