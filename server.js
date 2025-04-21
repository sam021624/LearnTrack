const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const verificationCodes = {};

// MongoDB setup
const uri = "mongodb+srv://learntrackdb:DzCmjn3uUe6U9Wz9@cluster0.lfqezux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = "learntrackdb";

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "LearnTrackDB@gmail.com",
        pass: "imtm rwds bbxl lraa",
    },
});

// --- SIGN UP ---
app.post('/signup', async (req, res) => {
    const { FULLNAME, USERNAME, PASSWORD, EMAIL, ROLE } = req.body;

    try {

        const collection = ROLE === "Student" ? "LT_Students" : "LT_Teachers";

        const database = client.db(dbName);
        const accounts = database.collection(collection);

        await accounts.insertOne({
            FULL_NAME: FULLNAME,
            USERNAME: USERNAME,
            PASSWORD: PASSWORD,
            EMAIL: EMAIL,
            ROLES: ROLE
        });

        res.status(200).send('User registered successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving user to database.');
    }
});

// --- LOGIN ---
app.post("/login", async (req, res) => {
    const { USERNAME, PASSWORD } = req.body;

    try {
        const database = client.db(dbName);

        // Check in LT_Students first
        let user = await database.collection("LT_Students").findOne({ USERNAME, PASSWORD });

        // If not found, check in LT_Teachers
        if (!user) {
            user = await database.collection("LT_Teachers").findOne({ USERNAME, PASSWORD });
        }

        if (user) {
            res.status(200).json({
                success: true, message: "Login successful.", role: user.ROLES, user: {
                    FULL_NAME: user.FULL_NAME,
                    EMAIL: user.EMAIL,
                    USERNAME: user.USERNAME
                }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password." });
            console.log(user);
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});

// --- SEND OTP ---
app.post("/send-verification-code", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = code;

    try {
        await transporter.sendMail({
            from: '"Learn Track" <learntrackdb@gmail.com>',
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is: ${code}`,
        });

        res.json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP." });
    }
});

// --- VERIFY OTP ---
app.post("/verify-code", (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: "Email and code are required." });
    }

    const storedCode = verificationCodes[email];

    if (storedCode && storedCode.toString() === code.toString()) {
        delete verificationCodes[email];
        return res.json({ success: true, message: "Verification successful." });
    } else {
        return res.json({ success: false, message: "Invalid or expired verification code." });
    }
});

app.post("/join-class/:classCode/students", async (req, res) => {
    const { student } = req.body;
    const classCode = req.params.classCode;

    if (!student || !student.USERNAME || !student.NAME) {
        return res.status(400).json({ message: "Missing student info." });
    }

    try {
        const database = client.db(dbName);
        const collection = database.collection("LT_Classes");

        const result = await collection.updateOne(
            { CLASS_CODE: classCode },
            { $addToSet: { STUDENTS: student } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Class not found." });
        }

        res.status(200).json({ message: "Student successfully joined the class." });
    } catch (error) {
        console.error("Error joining class:", error);
        res.status(500).json({ message: "Server error while joining class." });
    }
});

//PROFESSOR FUNCTIONALITIES
app.post("/create-class", async (req, res) => {
    const { USERNAME, CLASS_NAME, CLASS_CODE, SECTION, NAME } = req.body;

    try {
        const database = client.db(dbName);
        const collection = database.collection("LT_Classes");

        await collection.insertOne({
            USERNAME,
            CLASS_NAME,
            CLASS_CODE,
            SECTION,
            NAME,
        });

        res.status(200).json({ message: 'Class registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving class to database.');
    }
});

app.get("/classes", async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const database = client.db(dbName);
        const collection = database.collection("LT_Classes");

        const classes = await collection.find({ USERNAME: username }).toArray();

        res.json(classes);
    } catch (err) {
        console.error("Error fetching classes:", err);
        res.status(500).json({ message: "Failed to fetch classes" });
    }
});

app.get("/active-courses", async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const database = client.db(dbName);
        const collection = database.collection("LT_Classes");

        // Assuming "STATUS" field denotes whether a course is active
        const activeCount = await collection.countDocuments({
            USERNAME: username,
        });

        res.json({ activeCourses: activeCount });
    } catch (err) {
        console.error("Error fetching active course count:", err);
        res.status(500).json({ message: "Failed to fetch active course count" });
    }
});

app.get("/section-count", async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const database = client.db(dbName);
        const collection = database.collection("LT_Classes");

        const results = await collection.aggregate([
            { $match: { USERNAME: username } },
            { $group: { _id: "$SECTION" } },
            { $count: "uniqueSections" }
        ]).toArray();

        // Properly read the count from the aggregation result
        const sectionCount = results.length > 0 ? results[0].uniqueSections : 0;

        res.json({ sectionsHandled: sectionCount });
    } catch (err) {
        console.error("Error fetching section count:", err);
        res.status(500).json({ message: "Failed to fetch section count" });
    }
});

//STUDENT FUNCTIONALITIES
app.get("/student-classes", async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const database = client.db(dbName);
        const collection = database.collection("LT_Classes");

        const classes = await collection.find({
            STUDENTS: { $elemMatch: { USERNAME: username } }
        }).toArray();

        res.json(classes);
    } catch (err) {
        console.error("Error fetching classes:", err);
        res.status(500).json({ message: "Failed to fetch classes" });
    }
});



// --- START SERVER AND CONNECT DB ---
client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Failed to connect to MongoDB", err);
    });
