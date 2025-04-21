const userData = [
    userName = '',
    userEmail = ''
]

const sampleStudents = [
    { name: "Alice Johnson", image: "https://i.pravatar.cc/150?img=1" },
    { name: "Bob Smith", image: "https://i.pravatar.cc/150?img=2" },
    { name: "Charlie Brown", image: "https://i.pravatar.cc/150?img=3" },
    { name: "Dana Lee", image: "https://i.pravatar.cc/150?img=4" },
    { name: "Evan Garcia", image: "https://i.pravatar.cc/150?img=5" },
    { name: "Fiona Chen", image: "https://i.pravatar.cc/150?img=6" },
    { name: "George Wilson", image: "https://i.pravatar.cc/150?img=7" },
    { name: "Hannah Kim", image: "https://i.pravatar.cc/150?img=8" },
    { name: "Ian Davis", image: "https://i.pravatar.cc/150?img=9" },
    { name: "Julia Martinez", image: "https://i.pravatar.cc/150?img=10" },
    { name: "Kevin Taylor", image: "https://i.pravatar.cc/150?img=11" },
    { name: "Lily Anderson", image: "https://i.pravatar.cc/150?img=12" },
    { name: "Mike Thompson", image: "https://i.pravatar.cc/150?img=13" },
    { name: "Nina White", image: "https://i.pravatar.cc/150?img=14" },
    { name: "Oscar Harris", image: "https://i.pravatar.cc/150?img=15" },
    { name: "Paula Clark", image: "https://i.pravatar.cc/150?img=16" },
    { name: "Quinn Lewis", image: "https://i.pravatar.cc/150?img=17" },
    { name: "Rachel Walker", image: "https://i.pravatar.cc/150?img=18" },
    { name: "Steve Hall", image: "https://i.pravatar.cc/150?img=19" },
    { name: "Tina Young", image: "https://i.pravatar.cc/150?img=20" },
    { name: "Umar King", image: "https://i.pravatar.cc/150?img=21" },
    { name: "Vera Scott", image: "https://i.pravatar.cc/150?img=22" },
    { name: "William Green", image: "https://i.pravatar.cc/150?img=23" },
    { name: "Xena Adams", image: "https://i.pravatar.cc/150?img=24" },
    { name: "Yosef Baker", image: "https://i.pravatar.cc/150?img=25" },
    { name: "Zoe Carter", image: "https://i.pravatar.cc/150?img=26" },
    { name: "Aaron Hill", image: "https://i.pravatar.cc/150?img=27" },
    { name: "Bella Mitchell", image: "https://i.pravatar.cc/150?img=28" },
    { name: "Caleb Perez", image: "https://i.pravatar.cc/150?img=29" },
    { name: "Daisy Roberts", image: "https://i.pravatar.cc/150?img=30" },
    { name: "Eli Turner", image: "https://i.pravatar.cc/150?img=31" },
    { name: "Freya Phillips", image: "https://i.pravatar.cc/150?img=32" },
    { name: "Gavin Campbell", image: "https://i.pravatar.cc/150?img=33" },
    { name: "Holly Parker", image: "https://i.pravatar.cc/150?img=34" },
    { name: "Ivan Evans", image: "https://i.pravatar.cc/150?img=35" },
    { name: "Jasmine Edwards", image: "https://i.pravatar.cc/150?img=36" },
    { name: "Kai Collins", image: "https://i.pravatar.cc/150?img=37" },
    { name: "Luna Stewart", image: "https://i.pravatar.cc/150?img=38" },
    { name: "Milo Sanchez", image: "https://i.pravatar.cc/150?img=39" },
    { name: "Nora Morris", image: "https://i.pravatar.cc/150?img=40" },
    { name: "Owen Rogers", image: "https://i.pravatar.cc/150?img=41" },
    { name: "Piper Reed", image: "https://i.pravatar.cc/150?img=42" },
    { name: "Quincy Cook", image: "https://i.pravatar.cc/150?img=43" },
    { name: "Riley Morgan", image: "https://i.pravatar.cc/150?img=44" },
    { name: "Sawyer Bell", image: "https://i.pravatar.cc/150?img=45" },
    { name: "Tessa Murphy", image: "https://i.pravatar.cc/150?img=46" },
    { name: "Uriah Bailey", image: "https://i.pravatar.cc/150?img=47" },
    { name: "Violet Rivera", image: "https://i.pravatar.cc/150?img=48" },
    { name: "Wesley Cooper", image: "https://i.pravatar.cc/150?img=49" },
    { name: "Xander Richardson", image: "https://i.pravatar.cc/150?img=50" }
];

// Test with sample images
updateStudentAvatars(sampleStudents);

// ===== CORE FUNCTIONS ===== //

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    const userData = localStorage.getItem('user')

    if (userData) {

        const user = JSON.parse(userData)

        document.getElementById('userName').textContent = user.FULL_NAME;
        document.getElementById('userEmail').textContent = user.EMAIL;
        document.getElementById('userEmailDisplay').textContent = user.EMAIL;

        userName = user.USERNAME;
        userEmail = user.EMAIL;
    }

    // Initialize UI
    showContent('dashboard');

    // Load initial data
    renderClasses();

    //Dashboard
    updateActiveCourses();
    updateSectionCount();

    // Set up modal button
    document.querySelector('.modal-btn-create').addEventListener('click', createClass);

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

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === document.getElementById('createClassModal')) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});

// Bind the Enter key to the Post button
document.addEventListener('keydown', function (event) {
    // Check if the Enter key is pressed and the announcement text area is focused
    const announcementText = document.getElementById('announcementText');
    if (event.key === 'Enter' && announcementText === document.activeElement) {
        event.preventDefault(); // Prevent default Enter behavior (e.g., new line)
        postAnnouncement(); // Trigger the postAnnouncement function
    }
});

function showContent(section, event) {
    showLoading();

    // Hide all content sections
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'none';
    });

    // Show selected section
    setTimeout(() => {
        document.getElementById(section).style.display = 'block';
        hideLoading();

        if (section === 'classes') {
            renderClasses();

        }
    }, 500);
}

function clearModalInputs() {
    const inputs = document.querySelectorAll('#createClassModal .modal-input');
    inputs.forEach(input => {
        input.value = '';
    });
}

function openModal() {
    clearModalInputs();
    document.getElementById('createClassModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('createClassModal').style.display = 'none';
}

function createClass() {
    showLoading();

    const inputs = document.querySelectorAll('#createClassModal .modal-input');
    const className = inputs[0].value.trim();
    const section = inputs[1].value.trim();
    const teacherName = inputs[2].value.trim();

    if (!className) {
        hideLoading();
        alert("Class name cannot be empty!");
        return;
    }

    fetch('http://localhost:3000/create-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            USERNAME: userName,
            CLASS_NAME: className,
            CLASS_CODE: generateClassCode(),
            SECTION: section,
            NAME: teacherName,
        })
    })
        .then(response => {
            if (response.ok) return response.json(); // ✅ this parses it as JSON
            else throw new Error('Failed to create.');
        })


    setTimeout(() => {
        const newClass = { className, section, teacherName };
        const savedClasses = JSON.parse(localStorage.getItem('classes')) || [];
        savedClasses.push(newClass);
        localStorage.setItem('classes', JSON.stringify(savedClasses));

        renderClasses();
        updateActiveCourses();
        updateSectionCount();
        closeModal();
        hideLoading();
    }, 800);
}

function deleteClass(index, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this class?')) {
        const savedClasses = JSON.parse(localStorage.getItem('classes')) || [];
        savedClasses.splice(index, 1);
        localStorage.setItem('classes', JSON.stringify(savedClasses));
    }
}

// Loading States
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showSkeletonLoader() {
    const container = document.getElementById('classContainer');
    container.innerHTML = `
        <div class="class-box skeleton-card" style="height: 250px;"></div>
        <div class="class-box skeleton-card" style="height: 250px;"></div>
        <div class="class-box skeleton-card" style="height: 250px;"></div>
    `;
}

async function renderClasses() {
    showSkeletonLoader(); // Assuming this shows a loading indicator

    try {
        // Fetch classes from the backend
        const user = JSON.parse(localStorage.getItem("user")); // if stored as object
        const username = user?.USERNAME;

        const response = await fetch(`http://localhost:3000/classes?username=${username}`)
        if (!response.ok) {
            throw new Error('Failed to fetch classes');
        }

        const classes = await response.json(); // Parse the JSON response

        const container = document.getElementById('classContainer');
        container.innerHTML = ''; // Clear any existing content

        if (classes.length === 0) {
            container.innerHTML = '<p class="no-classes">No classes found</p>';
            return;
        }

        // Loop through the fetched classes and display them
        classes.forEach((cls, index) => {
            const classBox = document.createElement('div');
            classBox.classList.add('class-box');
            classBox.innerHTML = `
                <section class="class-info" onclick="openClassPage(${JSON.stringify(cls).replace(/"/g, '&quot;')})">
                    <h3>${cls.CLASS_NAME}</h3> <!-- Use correct property names from DB -->
                    <p>Section: ${cls.SECTION || "N/A"}</p>
                    <p>Teacher: ${cls.NAME || "N/A"}</p>
                    <button class="delete-btn" onclick="deleteClass(${index}, event)">Delete</button>
                </section>
                <section class="class-actions"></section>
            `;
            container.appendChild(classBox);
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        const container = document.getElementById('classContainer');
        container.innerHTML = '<p class="error-message">Failed to load classes. Please try again later.</p>';
    }
}

function updateActiveCourses() {
    const user = JSON.parse(localStorage.getItem("user")); // if stored as object
    const username = user?.USERNAME;

    fetch(`http://localhost:3000/active-courses?username=${username}`) // Replace with your actual endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Assuming the response has a key 'activeCourses'
            const count = data.activeCourses || 0;
            document.getElementById('active-course-count').textContent = count;
        })
        .catch(error => {
            console.error('Error fetching active courses:', error);
        });
}

function updateSectionCount() {
    const user = JSON.parse(localStorage.getItem("user")); // if stored as object
    const username = user?.USERNAME;

    fetch(`http://localhost:3000/section-count?username=${username}`) // Replace with your actual endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Assuming the response has a key 'activeCourses'
            const count = data.sectionsHandled || 0;
            document.getElementById('section-count').textContent = count;
        })
        .catch(error => {
            console.error('Error fetching section count:', error);
        });
}

// Enhanced Class Page Functions
function openClassPage(classData) {
    // Update class info
    document.getElementById('classNameDisplay').textContent = classData.className;
    document.getElementById('sectionDisplay').textContent = classData.section || 'N/A';
    document.getElementById('professorDisplay').textContent = classData.teacherName || 'You';

    // Generate random class code
    const classCode = generateClassCode();
    document.getElementById('classCodeDisplay').textContent = classCode;

    // Show class page
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById('classPage').style.display = 'block';

    // Add responsive check
    if (window.innerWidth < 768) {
        document.querySelector('.sidebar').style.width = '60px';
    }

    // Load initial data
    loadAnnouncements();
    updateStudentAvatars(sampleStudents); // Use the sample data
}

// Add window resize listener
window.addEventListener('resize', function () {
    if (document.getElementById('classPage').style.display === 'block') {
        if (window.innerWidth < 768) {
            document.querySelector('.sidebar').style.width = '60px';
        } else {
            document.querySelector('.sidebar').style.width = '250px';
        }
    }
});

function updateStudentAvatars(students) {
    const avatarsContainer = document.getElementById('studentAvatars');
    const studentCount = document.querySelector('.student-count');

    studentCount.textContent = `(${students.length})`;

    let avatarsHTML = '';
    const maxAvatars = 20; // Limit the number of avatars to 13

    // Display student avatars
    students.slice(0, maxAvatars).forEach(student => {
        avatarsHTML += `
            <div class="student-avatar" title="${student.name}">
                <img src="${student.image || 'default-avatar.png'}" alt="${student.name}">
            </div>
        `;
    });

    // Show "+X" counter if there are more students
    if (students.length > maxAvatars) {
        avatarsHTML += `
            <div class="more-students">+${students.length - maxAvatars}</div>
        `;
    }

    // Always keep the "Add Students" button
    avatarsHTML += `
        <div class="empty-avatar" onclick="showAddStudents()">
            <i class="fas fa-user-plus"></i>
        </div>
    `;

    avatarsContainer.innerHTML = avatarsHTML;
}

function getAvatarInitials(name) {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
}

function showAddStudents() {
    const classCode = document.getElementById('classCodeDisplay').textContent;
    alert(`Share this class code with students: ${classCode}\n\nStudents can join using this code.`);
}

function generateClassCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function copyClassCode() {
    const code = document.getElementById('classCodeDisplay').textContent;
    navigator.clipboard.writeText(code);
    alert('Class code copied to clipboard!');
}

// Handle file upload
function handleFileUpload(event) {
    const fileInput = event.target;
    const fileName = fileInput.files[0]?.name || "No file chosen";
    const fileNameDisplay = document.getElementById('fileName');

    fileNameDisplay.textContent = fileName;
    if (fileInput.files[0]) {
        fileNameDisplay.classList.add('has-file');
    } else {
        fileNameDisplay.classList.remove('has-file');
    }
}

// Open Google Drive Picker
function openGoogleDrivePicker() {
    alert("Google Drive integration would open here");
    // Add Google Picker API integration here if needed
}

// Add YouTube video
function addYouTubeVideo() {
    const videoUrl = prompt("Enter YouTube video URL:");
    if (videoUrl) {
        if (videoUrl.match(/youtube\.com|youtu\.be/)) {
            const announcementText = document.getElementById('announcementText');
            announcementText.value += `\n\nYouTube Video: ${videoUrl}`;
        } else {
            alert("Please enter a valid YouTube URL");
        }
    }
}

// Add a link
function addLink() {
    let linkUrl = prompt("Enter the link URL:");
    if (linkUrl) {
        // Ensure the link has a protocol (http:// or https://)
        if (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
            linkUrl = "https://" + linkUrl;
        }

        // Display the link in the "No file chosen" area
        const fileNameDisplay = document.getElementById('fileName');
        fileNameDisplay.textContent = linkUrl;
        fileNameDisplay.classList.add('has-file');
    }
}

// Enhanced postAnnouncement function
function postAnnouncement() {
    const text = document.getElementById('announcementText').value.trim();
    const fileInput = document.getElementById('fileUpload');
    const fileNameDisplay = document.getElementById('fileName').textContent;

    if (!text && fileNameDisplay === 'No file chosen') {
        alert('Please enter announcement text or attach a file/link');
        return;
    }

    // Create announcement object
    const announcement = {
        id: Date.now(),
        author: 'You',
        date: new Date().toLocaleString(),
        content: text,
        attachment: fileInput.files[0] ? {
            name: fileInput.files[0].name,
            type: fileInput.files[0].type,
            size: fileInput.files[0].size,
            url: URL.createObjectURL(fileInput.files[0]) // For local files
        } : null,
        link: fileNameDisplay !== 'No file chosen' && !fileInput.files[0] ? fileNameDisplay : null
    };

    // Save to localStorage
    const classCode = document.getElementById('classCodeDisplay').textContent;
    const announcements = JSON.parse(localStorage.getItem(`announcements_${classCode}`)) || [];
    announcements.unshift(announcement);
    localStorage.setItem(`announcements_${classCode}`, JSON.stringify(announcements));

    // Refresh announcements
    loadAnnouncements();
    resetForm();
}

// Update the loadAnnouncements function to display links
function loadAnnouncements() {
    const classCode = document.getElementById('classCodeDisplay').textContent;
    const announcements = JSON.parse(localStorage.getItem(`announcements_${classCode}`)) || [];
    const announcementsList = document.getElementById('announcementsList');

    announcementsList.innerHTML = '';

    if (announcements.length === 0) {
        document.getElementById('noAnnouncements').style.display = 'flex';
        return;
    }

    document.getElementById('noAnnouncements').style.display = 'none';

    // Sort announcements
    const sortBy = document.getElementById('sortFeed').value;
    const sortedAnnouncements = [...announcements];

    if (sortBy === 'newest') {
        sortedAnnouncements.sort((a, b) => b.id - a.id);
    } else {
        sortedAnnouncements.sort((a, b) => a.id - b.id);
    }

    // Display announcements
    sortedAnnouncements.forEach(announcement => {
        const announcementElement = document.createElement('div');
        announcementElement.className = 'announcement-card card';
        announcementElement.dataset.id = announcement.id; // Add ID for deletion

        let announcementHTML = `
            <div class="announcement-header">
                <div class="announcement-author-avatar">
                    ${getAvatarInitials(announcement.author)}
                </div>
                <div>
                    <div class="announcement-author">${announcement.author}</div>
                    <div class="announcement-date">${announcement.date}</div>
                </div>
                <button class="delete-btn" onclick="deleteAnnouncement(${announcement.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="announcement-content">
        `;

        if (announcement.content) {
            announcementHTML += `<p>${announcement.content}</p>`;
        }

        if (announcement.link) {
            announcementHTML += `<p><a href="${announcement.link}" target="_blank">${announcement.link}</a></p>`;
        }

        if (announcement.attachment) {
            announcementHTML += `
                <div class="attachment-preview">
                    <div class="attachment-icon">
                        <i class="fas ${getFileIcon(announcement.attachment.type)}"></i>
                    </div>
                    <div>
                        <div class="attachment-name">${announcement.attachment.name}</div>
                        <div class="attachment-size">${formatFileSize(announcement.attachment.size)}</div>
                    </div>
                </div>
            `;
        }

        announcementHTML += `</div>`;
        announcementElement.innerHTML = announcementHTML;
        announcementsList.appendChild(announcementElement);
    });
}

// Reset form after posting
function resetForm() {
    document.getElementById('announcementText').value = '';
    document.getElementById('fileUpload').value = '';
    document.getElementById('fileName').textContent = 'No file chosen';
    document.getElementById('fileName').classList.remove('has-file');
}

// Delete announcement function
function deleteAnnouncement(id) {
    const classCode = document.getElementById('classCodeDisplay').textContent;
    let announcements = JSON.parse(localStorage.getItem(`announcements_${classCode}`)) || [];

    // Filter out the announcement with the given ID
    announcements = announcements.filter(announcement => announcement.id !== id);

    // Save updated announcements to localStorage
    localStorage.setItem(`announcements_${classCode}`, JSON.stringify(announcements));

    // Reload announcements
    loadAnnouncements();
}

function getFileIcon(fileType) {
    if (fileType.includes('image')) return 'fa-image';
    if (fileType.includes('pdf')) return 'fa-file-pdf';
    if (fileType.includes('word')) return 'fa-file-word';
    if (fileType.includes('excel')) return 'fa-file-excel';
    if (fileType.includes('powerpoint')) return 'fa-file-powerpoint';
    if (fileType.includes('zip')) return 'fa-file-archive';
    return 'fa-file';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Update file input display
document.getElementById('fileUpload').addEventListener('change', function (e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
    document.getElementById('fileName').textContent = fileName;
});

// Add sorting functionality
document.getElementById('sortFeed').addEventListener('change', loadAnnouncements);

// Profile Functions
function toggleProfileDropdown() {
    document.getElementById('profileDropdown').classList.toggle('show');
}

// View All Students function
function viewAllStudents() {
    // Set the class title
    const className = document.getElementById('classNameDisplay').textContent;
    document.getElementById('allStudentsClassTitle').textContent = className;

    // Hide current page and show all students page
    document.getElementById('classPage').style.display = 'none';
    document.getElementById('allStudentsPage').style.display = 'block';

    // Render all students
    renderAllStudents();
}

// Back to Class Page function
function backToClassPage() {
    document.getElementById('allStudentsPage').style.display = 'none';
    document.getElementById('classPage').style.display = 'block';
}

// Render all students in grid view
function renderAllStudents() {
    const gridContainer = document.getElementById('allStudentsGrid');
    gridContainer.innerHTML = '';

    sampleStudents.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
        <div class="student-card-avatar">
          <img src="${student.image}" alt="${student.name}">
        </div>
        <div class="student-card-name">${student.name}</div>
      `;
        gridContainer.appendChild(studentCard);
    });
}

// Update the updateStudentAvatars function to include the student count:
function updateStudentAvatars(students) {
    const avatarsContainer = document.getElementById('studentAvatars');
    const studentCount = document.querySelector('.student-count');

    studentCount.textContent = `(${students.length})`;

    let avatarsHTML = '';
    const maxAvatars = 21; // Show 5 avatars by default

    // Display student avatars
    students.slice(0, maxAvatars).forEach(student => {
        avatarsHTML += `
              <div class="student-avatar" title="${student.name}">
                  <img src="${student.image}" alt="${student.name}">
              </div>
          `;
    });

    // Show "+X" counter if there are more students
    if (students.length > maxAvatars) {
        avatarsHTML += `
              <div class="more-students" title="View all ${students.length} students">
                  +${students.length - maxAvatars}
              </div>
          `;
    }

    // Always keep the "Add Students" button
    avatarsHTML += `
          <div class="empty-avatar" onclick="showAddStudents()" title="Add students">
              <i class="fas fa-user-plus"></i>
          </div>
      `;

    avatarsContainer.innerHTML = avatarsHTML;

    // Make the "+X" counter clickable to view all students
    const moreStudents = document.querySelector('.more-students');
    if (moreStudents) {
        moreStudents.style.cursor = 'pointer';
        moreStudents.addEventListener('click', viewAllStudents);
    }
}

function signOut() {
    localStorage.clear();
    alert("You have been signed out.");
    window.location.href = "register.html";
}
