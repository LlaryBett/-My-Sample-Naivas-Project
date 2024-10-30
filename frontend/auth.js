// Login form submission
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signinUsername').value;
    const password = document.getElementById('signinPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {  
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.status === 404) {
            // User does not exist
            alert('User does not exist. Please check your username or register for an account.');
        } else if (response.status === 401) {
            // Invalid password
            alert('Invalid password. Please try again.');
        } else if (response.ok) {
            // Successful login
            alert('Login successful! Redirecting to the home page...');

            // Store the token
            localStorage.setItem('token', data.token);

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'http://127.0.0.1:5500/frontend/index.html';
            }, 2000); 
        } else {
            // General error
            alert('An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
});

// Registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value; // Either email or phone number
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        return alert('Passwords do not match.');
    }

    // Validate the username (must be email or phone number)
    if (!username) {
        return alert('Please provide a valid email or phone number.');
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {  // Updated API endpoint
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ username, password }) // Send username (email or phone number) and password
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message and optionally switch to login form
            alert('Registration successful! Please log in.');
            document.getElementById('signinUsername').value = username; // Pre-fill login
            showForm('signin'); // Switch to login form
        } else {
            // Show error message
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
    }
});
// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body; // username can be phone number or email

    try {
        // Check if user already exists
        const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists.' }); // User exists
        }

        // Proceed to hash password and insert new user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error saving user to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
