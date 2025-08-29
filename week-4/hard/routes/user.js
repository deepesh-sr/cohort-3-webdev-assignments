const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Todo } = require("../database");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


// User Routes
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email and username"
            })
        }

        //hashed password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user 
        const user = new User({
            username,
            email,
            password: hashedPassword
        })

        await user.save();

        res.status(201).json({
            message: "User created succesfully",
            userId: user._id
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Error Creating user",
            error: e.message
        })
    }

});

router.post('/login', async (req, res) => {
    // Implement user login logic
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({
            username: username,
        })

        if (!existingUser) {
            return res.status(400).json({
                message: "User doesn't exist"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid username or password"
            });
        }

        //generate JWT token
        const token = jwt.sign(
            { userId: existingUser._id, username: existingUser.username },
            "todo",
            {
                 expiresIn: '24h'
            }
        );

        console.log("JWT_SECRET:", process.env.JWT_SECRET);


        res.status(200).json({
            message: "Login Successful",
            token: token,
            userId: existingUser._id
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Error during login",
            error: e.message
        });
    }
});

router.get('/todos', userMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({
            userId: req.user.userId
        });

        res.status(200).json({
            message: "User todos retrieved successfully",
            todos: todos
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving todos",
            error: error.message
        });
    }
});

let blacklistedTokens = new Set();
router.post('/logout', userMiddleware, (req, res) => {
    // Implement logout logic
    const token = req.headers.authorization.substring(7);

    blacklistedTokens.add(token);

    res.status(200).json({
        message : "Logged out successfully"
    });
});

module.exports = router