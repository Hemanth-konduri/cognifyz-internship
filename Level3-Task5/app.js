const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Temporary storage
let users = [];
let idCounter = 1;

// GET all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET single user
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// POST - create user
app.post('/api/users', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newUser = { id: idCounter++, name, email, phone };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT - update user
app.put('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'User not found' });
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
});

// DELETE - delete user
app.delete('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'User not found' });
    users.splice(index, 1);
    res.json({ message: 'User deleted successfully' });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});