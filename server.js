const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');

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

// SENDING EMAIL TO NOTIFY THAT AN ACTIVITY IS DUE
app.post("/send-email-due-soon", async (req, res) => {
    const { workclassId, classCode } = req.body;

    if (!workclassId || !classCode) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    let objectId;
    try {
        objectId = new ObjectId(workclassId);
    } catch (e) {
        console.error("Invalid ObjectId:", workclassId);
        return res.status(400).json({ error: "Invalid workclassId format." });
    }

    try {
        const db = client.db(dbName);

        const workclassDoc = await db.collection("LT_Workclasses").findOne({
            _id: objectId,
            CLASS_CODE: classCode
        });

        const newDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const updateResult = await db.collection("LT_Workclasses").updateOne(
            { _id: objectId, CLASS_CODE: classCode },
            { $set: { DUEDATE: newDueDate } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).json({ error: "Workclass not found or class code mismatch." });
        }

        if (!workclassDoc) {
            return res.status(404).json({ error: "Workclass not found." });
        }

        const title = workclassDoc.TITLE;
        const dueDate = new Date(workclassDoc.DUEDATE);

        const subject = `Reminder: ${title} is due soon!`;


        const classDoc = await db.collection("LT_Classes").findOne({ CLASS_CODE: classCode });

        if (!classDoc || !Array.isArray(classDoc.STUDENTS)) {
            return res.status(404).json({ error: "No students found for this class." });
        }
        
        const className = classDoc.CLASS_NAME || classCode; // fallback if name is missing
        const message = `Dear students, the workclass "${title}" in your class "${className}" is due on ${newDueDate.toLocaleString()}. Please make sure to submit it on time!`;

        console.log("Class document:", classDoc);

        const usernames = classDoc.STUDENTS.map(student => student.USERNAME).filter(Boolean);

        if (usernames.length === 0) {
            return res.status(404).json({ error: "No student usernames found." });
        }

        const users = await db.collection("LT_Students").find({ USERNAME: { $in: usernames } }).toArray();
        const emails = users.map(u => u.EMAIL).filter(Boolean);

        if (emails.length === 0) {
            return res.status(404).json({ error: "No valid student emails found." });
        }

        await Promise.all(
            emails.map(email =>
                transporter.sendMail({
                    from: '"Learn Track" <learntrackdb@gmail.com>',
                    to: email,
                    subject,
                    text: message,
                }).catch(err => {
                    console.error(`Failed to send email to ${email}:`, err);
                })
            )
        );

        res.status(200).json({ message: `Sent reminder about "${title}" to ${emails.length} students.` });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Server error." });
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

app.post("/create-announcements", async (req, res) => {
    const { CLASS_CODE, NAME, EMAIL, CONTENT, DATE } = req.body;

    try {
        const database = client.db(dbName);
        const collection = database.collection("LT_Announcement");

        await collection.insertOne({
            CLASS_CODE,
            NAME,
            EMAIL,
            CONTENT,
            DATE,
        });

        res.status(200).json({ message: 'Announcement created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving announcement to database.');
    }
});

// Working for only assignments and material type classwork.
app.post("/create-workclass", async (req, res) => {
    const {
        CLASS_CODE,
        TITLE,
        WORKCLASSTYPE,
        INSTRUCTIONS,
        QUESTIONS,
        TIMELIMIT,
        STARTDATETIME,
        ENDDATETIME,
        POINTSPOSSIBLE,
        DESCRIPTION,
        DUEDATE,
        ALLOWLATESUBMISSIONS,
        GRADEIMMEDIATELY,
        ATTACHMENTS,
        STATUS
    } = req.body;

    if (!CLASS_CODE || !TITLE || !WORKCLASSTYPE) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // Validate DUE_DATE and parse it
    let dueDate = null;
    if (WORKCLASSTYPE === 'assignment' && DUEDATE) {
        dueDate = new Date(DUEDATE);
        if (isNaN(dueDate.getTime())) {
            return res.status(400).json({ error: "Invalid due date format." });
        }
    }

    const newWorkclass = {
        CLASS_CODE,
        TITLE,
        WORKCLASSTYPE,
        STATUS: STATUS || "published",
        CREATED_AT: new Date().toISOString()
    };

    // Add type-specific fields based on WORKCLASSTYPE
    if (WORKCLASSTYPE === "quiz") {
        Object.assign(newWorkclass, {
            INSTRUCTIONS,
            QUESTIONS,
            TIMELIMIT,
            STARTDATETIME,
            ENDDATETIME,
            POINTSPOSSIBLE
        });
    } else if (WORKCLASSTYPE === "material") {
        newWorkclass.DESCRIPTION = DESCRIPTION;
    } else if (WORKCLASSTYPE === "question") {
        Object.assign(newWorkclass, {
            INSTRUCTIONS,
            POINTSPOSSIBLE,
            DUEDATE: dueDate, 
            TYPE: "question"
        });
        console.log('Received DUE_DATE (Backend):', dueDate); 
    } else if (WORKCLASSTYPE === "assignment") {
        Object.assign(newWorkclass, {
            INSTRUCTIONS,
            DUEDATE: dueDate,  
            POINTSPOSSIBLE,
            ALLOWLATESUBMISSIONS,
            GRADEIMMEDIATELY,
            ATTACHMENTS,
            WORKCLASSTYPE: "assignment"
        });
    } else {
        return res.status(400).json({ error: "Invalid workclass type." });
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection("LT_Workclasses");

        await collection.insertOne(newWorkclass);

        res.status(200).json({ message: "Workclass created successfully." });
    } catch (error) {
        console.error("Error inserting workclass:", error);
        res.status(500).send("Error saving workclass to database.");
    }
});


  // Display Worksclasses
  app.get("/get-workclasses", async (req, res) => {
    const { CLASS_CODE } = req.query;
  
    if (!CLASS_CODE) {
      return res.status(400).json({ error: "Missing required query parameter: CLASS_CODE." });
    }
  
    try {
      const db = client.db(dbName);
      const collection = db.collection("LT_Workclasses");
  
      const workclasses = await collection.find({ CLASS_CODE }).toArray();
  
      res.status(200).json(workclasses);
    } catch (error) {
      console.error("Error retrieving workclasses:", error);
      res.status(500).send("Error retrieving workclasses from database.");
    }
  });  


app.get("/show-announcements", async (req, res) => {
    const classCode = req.query.CLASS_CODE;

    try {
        const database = client.db(dbName);
        const collection = database.collection("LT_Announcement");

        const query = classCode ? { CLASS_CODE: classCode } : {};

        const announcements = await collection
            .find(query)
            .sort({ DATE: -1 }) // Optional: Sort by most recent
            .toArray();

        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).send("Error fetching announcements from database.");
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

app.get("/student-count", async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const database = client.db(dbName);
        const collection = database.collection("LT_Classes");

        // Fetch all STUDENTS arrays for classes created by this username
        const classes = await collection.find({ USERNAME: username }).toArray();

        const studentUsernamesSet = new Set();

        classes.forEach(cls => {
            if (Array.isArray(cls.STUDENTS)) {
                cls.STUDENTS.forEach(student => {
                    if (student.USERNAME !== username) {
                        studentUsernamesSet.add(student.USERNAME);
                    }
                });
            }
        });

        const uniqueStudentCount = studentUsernamesSet.size;

        res.json({ uniqueStudents: uniqueStudentCount });
    } catch (err) {
        console.error("Error fetching student count:", err);
        res.status(500).json({ message: "Failed to fetch student count" });
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

app.get("/student-workclasses-count/:username", async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Missing username." });
    }

    try {
        const db = client.db(dbName);

        // Step 1: Find all classes the student is joined in
        const joinedClasses = await db.collection("LT_Classes").find({
            "STUDENTS.USERNAME": username
        }).toArray();

        if (joinedClasses.length === 0) {
            return res.status(200).json({ count: 0, workclasses: [] });
        }

        const joinedClassCodes = joinedClasses.map(cls => cls.CLASS_CODE);

        // Step 2: Fetch all workclasses for those class codes
        const workclasses = await db.collection("LT_Workclasses").find({
            CLASS_CODE: { $in: joinedClassCodes }
        }).toArray();

        res.status(200).json({
            count: workclasses.length,
            workclasses: workclasses
        });

    } catch (error) {
        console.error("Error fetching student workclasses:", error);
        res.status(500).json({ error: "Server error." });
    }
});

app.delete('/delete-class/:classCode', async (req, res) => {
    const { classCode } = req.params;
    console.log("Attempting to delete class with CLASS_CODE:", classCode);

    const database = client.db(dbName);
    const collection = database.collection("LT_Classes");

    try {
        const result = await collection.deleteOne({ CLASS_CODE: classCode });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: `Class with CLASS_CODE ${classCode} deleted successfully.` });
        } else {
            res.status(404).json({ message: `No class found with CLASS_CODE ${classCode}` });
        }
    } catch (err) {
        console.error("Error during deletion:", err);
        res.status(500).json({ message: 'Error deleting class: ' + err.message });
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

        res.json({ 
            classes, 
            count: classes.length 
          });
          
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
