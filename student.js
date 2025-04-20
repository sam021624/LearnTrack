// Sample class data
const userClasses = [
    { id: 'SE101', name: 'SE101-Software Engineering', section: 'SBIT-2C', professor: 'Rose Anne Taniente' },
    { id: 'CS102', name: 'CS102-Data Structures', section: 'SBIT-2C', professor: 'Redentor Bucaling' }
];

// Sample schedule data
const classSchedules = {
    'SE101': 'Wed 7:00AM-10:00AM',
    'CS102': 'Tue 1:00PM-4:00PM'
};

// Sample announcements data
const announcements = [
    {
        teacherAvatar: "Picture/barbie.jpg",
        teacherEmail: "example@gmail.com",
        teacherName: "Rose Anne Taniente",
        subject: "SE101-Software Engineering",
        schedule: "SBIT-2C Wednesday 7:00AM-10:00AM/11:00AM-1:00PM",
        badge: "New assignment",
        title: "Midterm Project Guidelines",
        time: "March 10, 2025 9:30:45 AM",
        content: "Please submit your project proposals by Friday..."
    },
    {
        teacherAvatar: "Picture/sir.png",
        teacherEmail: "professor@gmail.com",
        teacherName: "Redentor Bucaling",
        subject: "CS102-Data Structures",
        schedule: "SBIT-2C Tuesday 1:00PM-4:00PM",
        badge: "Quiz alert",
        title: "Chapter 5 Quiz",
        time: "March 09, 2025 3:15:20 PM",
        content: "There will be a quiz next week covering..."
    }
];

// ===== CORE FUNCTIONS ===== //

function showContent(sectionId) {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        if (content.id === sectionId) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
}

function openModal() {
    const modal = document.getElementById('joinClassModal');
    modal.style.display = 'block'; // or modal.classList.add('visible');
}

function closeModal() {
    const modal = document.getElementById('joinClassModal');
    modal.style.display = 'none'; // or modal.classList.remove('visible');
}

function joinClass() {
    const classCode = document.querySelector('.modal-input').value.trim();
    if (classCode.length < 5 || classCode.length > 8) { // Fixed invalid emoji in condition
        alert('Please enter a valid class code (5-8 characters)');
        return;
    }

    // Simulate joining a class
    alert(`Successfully joined class with code: ${classCode}`); // Fixed missing backticks for template literal
    closeModal();

    // In a real app, you would make an API call here
    // and update the UI with the new class
}

// Toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const headers = document.querySelectorAll('header');
    const contents = document.querySelectorAll('.content');
    const burgerMenuBtn = document.querySelector('.burger-menu-btn');

    // Toggle the hidden class on the sidebar
    sidebar.classList.toggle('hidden');

    // Adjust headers, content, and burger menu button dynamically
    if (sidebar.classList.contains('hidden')) {
        headers.forEach(header => {
            header.style.left = '0';
            header.style.width = '100%';
        });
        contents.forEach(content => {
            content.style.marginLeft = '0';
        });
        burgerMenuBtn.style.left = '10px'; // Move burger menu button to the left
    } else {
        headers.forEach(header => {
            header.style.left = '250px';
            header.style.width = 'calc(100% - 250px)';
        });
        contents.forEach(content => {
            content.style.marginLeft = '250px';
        });
        burgerMenuBtn.style.left = '250px'; // Align burger menu button with the sidebar
    }
}

// ===== CLASS-RELATED FUNCTIONS ===== //

function toggleClasses(event) {
    event.preventDefault();
    const container = event.currentTarget.closest('.classes-container');
    container.classList.toggle('expanded');
}

function populateClassLinks() {
    const container = document.querySelector('.joined-classes');
    container.innerHTML = '';

    userClasses.forEach(cls => {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'class-link';
        link.dataset.class = cls.id;
        link.innerHTML = `<i class="fas fa-book"></i> ${cls.name}`; // Fixed missing backticks for template literal
        link.addEventListener('click', function (e) {
            e.preventDefault();
            redirectToClass(this.dataset.class);
        });
        container.appendChild(link);
    });
}

function setupClassCards() {
    const container = document.querySelector('.class-cards-container');
    container.innerHTML = '';

    userClasses.forEach(cls => {
        const card = document.createElement('div');
        card.className = 'class-card';
        card.dataset.class = cls.id;

        // Upper section
        const upperSection = document.createElement('div');
        upperSection.className = 'class-card-upper';
        upperSection.innerHTML = `
            <h3>${cls.name}</h3>
            <p>Prof. ${cls.professor}</p>
            <p>${cls.section || 'Section not available'}</p>
        `;

        // Lower section
        const lowerSection = document.createElement('div');
        lowerSection.className = 'class-card-lower';
        lowerSection.innerHTML = `
            <h4>Unfinished Tasks</h4>
            <ul class="unfinished-tasks">
                <li>Loading tasks...</li>
            </ul>
        `;

        // Append sections to the card
        card.appendChild(upperSection);
        card.appendChild(lowerSection);

        // Add click event to the card
        card.addEventListener('click', function () {
            redirectToClass(this.dataset.class);
        });

        // Append card to the container
        container.appendChild(card);

        // Fetch and display unfinished tasks
        fetchUnfinishedTasks(cls.id, lowerSection.querySelector('.unfinished-tasks'));
    });
}

function fetchUnfinishedTasks(classId, taskListElement) {
    // Simulate fetching tasks from the database
    setTimeout(() => {
        const tasks = getUnfinishedTasksFromDatabase(classId);
        taskListElement.innerHTML = ''; // Clear loading message

        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = task;
                taskListElement.appendChild(taskItem);
            });
        } else {
            taskListElement.innerHTML = '<li>No unfinished tasks</li>';
        }
    }, 500); // Simulate delay
}

function getUnfinishedTasksFromDatabase(classId) {
    const tasksDatabase = {
        SE101: ['Complete Project Proposal', 'Submit Assignment 3'],
        CS102: ['Prepare for Quiz 5', 'Finish Lab Exercise 4']
    };
    return tasksDatabase[classId] || [];
}

function redirectToClass(classId) {
    // Hide all content sections
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'none';
    });

    // Show class-specific content
    const classContent = document.getElementById('class-specific');
    classContent.style.display = 'block';

    // Update class title
    document.getElementById('class-title').textContent =
        userClasses.find(c => c.id === classId)?.name || 'Class';

    // Load class content
    loadClassContent(classId);
}

function loadClassContent(classId) {
    const classContent = document.querySelector('.class-content');

    // Show loading state
    classContent.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading class information...</p>
        </div>
    `;

    // Simulate loading data
    setTimeout(() => {
        const currentClass = userClasses.find(c => c.id === classId);
        classContent.innerHTML = `
            <div class="class-announcements">
                <h3>Announcements</h3>
                <div class="announcement">
                    <h4>Welcome to ${currentClass?.name || 'this class'}!</h4>
                    <p class="announcement-time">Posted on ${new Date().toLocaleDateString()}</p>
                    <p>Check the syllabus for important dates and course requirements.</p>
                </div>
                <div class="announcement">
                    <h4>First Assignment Posted</h4>
                    <p class="announcement-time">Posted on ${new Date().toLocaleDateString()}</p>
                    <p>The first assignment is now available in the resources section.</p>
                </div>
            </div>
            <div class="class-resources">
                <h3>Resources</h3>
                <ul>
                    <li><a href="#"><i class="fas fa-file-pdf"></i> Course Syllabus</a></li>
                    <li><a href="#"><i class="fas fa-file-word"></i> Assignment 1 Guidelines</a></li>
                    <li><a href="#"><i class="fas fa-file-powerpoint"></i> Lecture 1 Slides</a></li>
                    <li><a href="#"><i class="fas fa-link"></i> Helpful Resources</a></li>
                </ul>
            </div>
            <div class="class-grades">
                <h3>Grades</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Assignment</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Quiz 1</td>
                            <td>${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                            <td>Pending</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>Assignment 1</td>
                            <td>${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
                            <td>Not Submitted</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }, 800);
}

function redirectToMyClassesSection(event) {
    event.preventDefault();
    showContent('classes');
}

// ===== ANNOUNCEMENT FUNCTIONS ===== //

function createAnnouncement(announcementData) {
    const template = document.getElementById('announcement-template');
    const clone = template.content.cloneNode(true);

    // Fill in the data
    clone.querySelector('.teacher-avatar').src = announcementData.teacherAvatar;
    clone.querySelector('.teacher-avatar').alt = `${announcementData.teacherName}'s profile`; // Fixed missing backticks for template literal
    clone.querySelector('.teacher-email').textContent = announcementData.teacherEmail;
    clone.querySelector('.teacher-name').textContent = announcementData.teacherName;
    clone.querySelector('.subject-name').textContent = announcementData.subject;
    clone.querySelector('.class-schedule').textContent = announcementData.schedule;
    clone.querySelector('.announcement-badge').textContent = announcementData.badge;
    clone.querySelector('.announcement-title').textContent = announcementData.title;
    clone.querySelector('.announcement-time').textContent = announcementData.time;
    clone.querySelector('.announcement-text').textContent = announcementData.content;

    return clone;
}

function loadAnnouncements() {
    const container = document.getElementById('announcements-area');
    container.innerHTML = '';

    if (announcements.length === 0) {
        container.innerHTML = '<p class="no-announcements">No announcements yet. Check back later!</p>';
        return;
    }

    announcements.forEach(announcement => {
        const newAnnouncement = createAnnouncement(announcement);
        container.appendChild(newAnnouncement);
    });
}

// ===== PROFILE FUNCTIONS ===== //

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

function signOut() {
    // In a real app, you would:
    // 1. Clear any authentication tokens
    // 2. Redirect to login page
    alert('Sign out functionality would be implemented here');
    return false;
}

// ===== INITIALIZATION ===== //

document.addEventListener('DOMContentLoaded', function () {
    const userData = localStorage.getItem('user');

    if (userData) {

        const user = JSON.parse(userData)

        document.getElementById('userName').textContent = user.FULL_NAME;
        document.getElementById('userEmail').textContent = user.EMAIL;
        document.getElementById('userEmailDisplay').textContent = user.EMAIL;
    }

    // Initialize UI
    showContent('dashboard');
    loadAnnouncements();

    // Initialize class system
    populateClassLinks();
    setupClassLinks();

    // Set up modal button
    document.querySelector('.modal-btn-join').addEventListener('click', joinClass);

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.matches('.profile-button') &&
            !event.target.closest('.profile-dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // Close modal when clicking outside or pressing Escape
    window.addEventListener('click', function (event) {
        if (event.target === document.getElementById('joinClassModal')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});

function setupClassLinks() {
    // This is now handled in populateClassLinks()
}

// Sample Data (matches your image exactly)
const rankingsData = {
    SE101: [
        { name: "Laïrone Yulo", grade: 95 },
        { name: "Lance Bacang", grade: 93, yourRank: false },
        { name: "Rianne Vincent", grade: 90 },
        { name: "Liester Bendico", grade: 88 },
        { name: "Arth Angelo Mendoza", grade: 84 }
    ],
    CS102: [
        { name: "Laïrone Yulo", grade: 93 },
        { name: "Lance Bacang", grade: 95, yourRank: false },
        { name: "Rianne Vincent", grade: 90 },
        { name: "Liester Bendico", grade: 84 },
        { name: "Arth Angelo Mendoza", grade: 88 }
    ]
};

// Initialize Rankings
function initRankings() {
    const classLinks = document.querySelectorAll('.class-list li');

    classLinks.forEach(link => {
        link.addEventListener('click', function () {
            classLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            updateLeaderboard(this.dataset.class);
        });
    });

    // Load initial data
    updateLeaderboard('SE101');
}

// Update Entire Leaderboard
function updateLeaderboard(classId) {
    const data = [...rankingsData[classId]].sort((a, b) => b.grade - a.grade);

    // Update Podium (Top 3)
    updatePodium(data.slice(0, 3));

    // Update Full Rankings List
    updateRankingsList(data);
}

function updatePodium(topStudents) {
    const podium = document.querySelector('.podium');
    podium.innerHTML = '';

    // Define podium order: [2nd, 1st, 3rd]
    const podiumOrder = [
        {
            student: topStudents[1], // 2nd place (left)
            type: 'silver',
            medal: '🥈',
            height: '80%'
        },
        {
            student: topStudents[0], // 1st place (center)
            type: 'gold',
            medal: '🥇',
            height: '100%'
        },
        {
            student: topStudents[2], // 3rd place (right)
            type: 'bronze',
            medal: '🥉',
            height: '60%'
        }
    ];

    podiumOrder.forEach((item) => {
        const spot = document.createElement('div');
        spot.className = `podium-spot ${item.type}`; // Fixed missing backticks for template literal
        spot.style.height = item.height;
        spot.innerHTML = `
        <div class="medal">${item.medal}</div>
        <div class="student-info">
          <span class="name">${item.student.name}</span>
          <span class="score">${item.student.grade}%</span>
        </div>
      `;

        // Highlight current user
        if (item.student.yourRank) {
            spot.classList.add('current-user');
        }

        podium.appendChild(spot);
    });
}

function updateRankingsList(data) {
    const listContainer = document.querySelector('.rankings-list');
    listContainer.innerHTML = `
        <div class="list-header">
            <span>Rank</span>
            <span>Student</span>
            <span>Grade</span>
        </div>
    `;

    data.forEach((student, index) => {
        const row = document.createElement('div');
        row.className = `student-row ${student.yourRank ? 'current-user' : ''}`; // Fixed missing backticks for template literal
        row.innerHTML = `
            <span class="rank">${index + 1}</span>
            <span class="name">${student.name}</span>
            <span class="score">${student.grade}%</span>
        `;
        listContainer.appendChild(row);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initRankings);

function signOut() {
    // Clear any session or local storage data (if applicable)
    alert("You have been signed out.");
    // Redirect to the login page
    window.location.href = "register.html"; // Replace with the actual login page URL
}