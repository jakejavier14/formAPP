const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Home' }));

app.get('/register', (req, res) => {
    res.render('form', { 
        title: 'Register', 
        errors: [], 
        old: {}   // always define old
    });
});

// POST /register - validate and re-render on error
app.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('form', { 
            title: 'Register', 
            errors: errors.array(),
            old: req.body    // send back what user typed
        });
    }

    res.render('success', { 
        title: 'Success', 
        user: req.body 
    });
});
// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));