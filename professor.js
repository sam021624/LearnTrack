const userData = [
    userName = '',
    userEmail = ''
]

const classData = [];
let currentStudents = [];
let announcementData = [];
let classCode = [];

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

    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            if (currentStudents.length > 0) {
                viewAllStudents(currentStudents);
            } else {
                alert('No students yet!');
            }
        });
    }

    // Initialize workclasses

    //renderWorkClasses doesn't work in this version so i commented it out.
    // renderWorkclasses();

    //Dashboard
    updateActiveCourses();
    updateSectionCount();
    updateStudentCount();

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
    checkUrlForClass();
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

async function createClass() {
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

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.USERNAME) {
        hideLoading();
        alert("User session not found. Please login again.");
        return;
    }

    const classData = {
        USERNAME: user.USERNAME,
        CLASS_NAME: className,
        CLASS_CODE: generateClassCode(),
        SECTION: section || 'N/A',
        NAME: teacherName || user.FULL_NAME || 'N/A',
    };

    try {
        const response = await fetch('http://localhost:3000/create-class', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(classData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Update local storage
        const savedClasses = JSON.parse(localStorage.getItem('classes')) || [];
        savedClasses.push(classData);
        localStorage.setItem('classes', JSON.stringify(savedClasses));

        // Update UI
        renderClasses();
        updateActiveCourses();
        updateSectionCount();
        closeModal();

        alert('Class created successfully!');
    } catch (error) {
        console.error('Error creating class:', error);
        alert('Failed to create class. Please try again.');
    } finally {
        hideLoading();
    }
}

async function deleteClass(classCode) {
    const confirmDelete = confirm(`Are you sure you want to delete class with code: ${classCode}?`);
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:3000/delete-class/${classCode}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete class');
        }

        const result = await response.json();
        console.log('Success:', result.message);

        // Refresh the class list after deletion
        showLoading();
        setTimeout(() => {
            document.getElementById(section).style.display = 'block';
            hideLoading();
            renderClasses();

        }, 500);
    } catch (error) {
        console.error('Error deleting class:', error);
    }
}

// Function to render classes
async function renderClasses() {
    showSkeletonLoader(); // Assuming this shows a loading indicator

    try {
        const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data from localStorage
        const username = user?.USERNAME;

        const response = await fetch(`http://localhost:3000/classes?username=${username}`);
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
        classes.forEach((cls) => {
            const classBox = document.createElement('div');
            classBox.classList.add('class-box');
            classBox.innerHTML = `
                <section class="class-info">
                    <h3>${cls.CLASS_NAME}</h3> <!-- Use correct property names from DB -->
                    <p>Section: ${cls.SECTION || "N/A"}</p>
                    <p>Teacher: ${cls.NAME || "N/A"}</p>
                    
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteClass('${cls.CLASS_CODE}')">Delete</button>
                </section>
                <section class="class-actions"></section>
            `;

            // Pass the class object directly to openClassPage when the class card is clicked
            classBox.querySelector('.class-info').addEventListener('click', async () => {
                openClassPage(cls); // Pass the full class object to openClassPage
                const announcementData = await fetchAnnouncements(cls.CLASS_CODE); // Get announcements
                loadAnnouncements(announcementData); // Load announcements into the UI
            });

            container.appendChild(classBox);
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        const container = document.getElementById('classContainer');
        container.innerHTML = '<p class="error-message">Failed to load classes. Please try again later.</p>';
    }
}


// Loading States
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showSkeletonLoader() {
    const container = document.getElementById('classContainer');
    container.innerHTML = `
        <div class="class-box skeleton-card" style="height: 250px;"></div>
        <div class="class-box skeleton-card" style="height: 250px;"></div>
        <div class="class-box skeleton-card" style="height: 250px;"></div>
    `;
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
    document.getElementById('classNameDisplay').textContent = classData.CLASS_NAME;
    document.getElementById('sectionDisplay').textContent = classData.SECTION || 'N/A';
    document.getElementById('professorDisplay').textContent = classData.NAME || 'You';

    // Generate random class code
    document.getElementById('classCodeDisplay').textContent = classData.CLASS_CODE;

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
    updateStudentAvatars(classData.STUDENTS || []);
    
    // Initialize tabs - force workclasses to load
    openClassTab('workclasses');
    document.querySelector('.tab-button.active').click();
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

function updateStudentAvatars(classId, students) {
    // Check if 'students' is null, undefined, or not an array
    if (!students || !Array.isArray(students)) {
        console.warn(`Invalid students data for class with ID: ${classId}`);
        return;
    }

    // Clear the avatars container to prevent leftover avatars from previous classes
    const avatarsContainer = document.getElementById('studentAvatars');
    avatarsContainer.innerHTML = '';  // Clear any previous avatars

    // If no students are present in this class
    if (students.length === 0) {
        console.warn(`No students have joined the class with ID: ${classId}`);
        // Show a default message or an empty state if no students are present
        avatarsContainer.innerHTML = '<p>No students have joined yet.</p>';
        return;
    }

    const studentCount = document.querySelector('.student-count');
    studentCount.textContent = `(${students.length})`;

    let avatarsHTML = '';
    const maxAvatars = 20;

    // Loop through and display avatars for the students of the current class
    students.slice(0, maxAvatars).forEach(student => {
        avatarsHTML += `
            <div class="student-avatar" title="${student.NAME}">
                <img src="default-avatar.png" alt="${student.NAME}">
            </div>
        `;
    });

    // Show "+X" counter if there are more students
    if (students.length > maxAvatars) {
        avatarsHTML += `<div class="more-students">+${students.length - maxAvatars}</div>`;
    }

    // Add "Add Student" button
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
async function postAnnouncement() {
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

    // FOR DB
    const newAnnouncement = {
        CLASS_CODE: classCode,
        NAME: userName,
        EMAIL: userEmail,
        CONTENT: text,
        DATE: new Date().toLocaleString(),
    }

    createAnnouncement(newAnnouncement)
    .then(result => {
        console.log(result.message); // success message
        alert("Announcement posted!");
    })
    .catch(error => {
        console.error(error);
        alert("Failed to post announcement.");
    });

    announcementData = await fetchAnnouncements(classCode);

    // Refresh announcements
    loadAnnouncements(announcementData);
    resetForm();
}

// Update the loadAnnouncements function to display links
function loadAnnouncements(announcementData) {
    const announcementsList = document.getElementById('announcementsList');
    announcementsList.innerHTML = '';

    if (!announcementData || announcementData.length === 0) {
        document.getElementById('noAnnouncements').style.display = 'flex';
        return;
    }

    document.getElementById('noAnnouncements').style.display = 'none';

    // Sort announcements
    const sortBy = document.getElementById('sortFeed').value;
    const sortedAnnouncements = [...announcementData];

    sortedAnnouncements.sort((a, b) => {
        const idA = a.id || 0;
        const idB = b.id || 0;
        return sortBy === 'newest' ? idB - idA : idA - idB;
    });

    // Display announcements
    sortedAnnouncements.forEach(announcement => {
        const announcementElement = document.createElement('div');
        announcementElement.className = 'announcement-card card';
        announcementElement.dataset.id = announcement.id || ''; // Safe fallback

        let announcementHTML = `
            <div class="announcement-header">
                <div class="announcement-author-avatar">
                    ${getAvatarInitials(announcement.NAME)}
                </div>
                <div>
                    <div class="announcement-author">${announcement.NAME}</div>
                    <div class="announcement-date">${announcement.DATE}</div>
                </div>
                <button class="delete-btn" onclick="deleteAnnouncement(${announcement.NAME})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="announcement-content">
        `;

        if (announcement.CONTENT) {
            announcementHTML += `<p>${announcement.CONTENT}</p>`;
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
function viewAllStudents(students) {
    // Set the class title
    const className = document.getElementById('classNameDisplay').textContent;
    document.getElementById('allStudentsClassTitle').textContent = className;

    // Hide current page and show all students page
    document.getElementById('classPage').style.display = 'none';
    document.getElementById('allStudentsPage').style.display = 'block';

    // Render all students
    renderAllStudents(students);
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

function updateStudentCount() {
    const user = JSON.parse(localStorage.getItem("user")); // if stored as object
    const username = user?.USERNAME;

    fetch(`http://localhost:3000/student-count?username=${username}`) // Replace with your actual endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Assuming the response has a key 'activeCourses'
            const count = data.uniqueStudents || 0;
            document.getElementById('total-student-count').textContent = count;
        })
        .catch(error => {
            console.error('Error fetching section count:', error);
        });
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
    currentStudents = students;

    const avatarsContainer = document.getElementById('studentAvatars');
    const studentCount = document.querySelector('.student-count');

    studentCount.textContent = `(${students.length})`;

    let avatarsHTML = '';
    const maxAvatars = 21; // Show 5 avatars by default

    // Display student avatars
    students.slice(0, maxAvatars).forEach(student => {
        avatarsHTML += `
              <div class="student-avatar" title="${student.NAME}">
                  <img src="${student.image}" alt="${student.NAME}">
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

// Workclass functions
function openWorkclassModal() {
    // Check if we're in a class context
    const classPage = document.getElementById('classPage');
    if (classPage.style.display !== 'block') {
      alert("Please open a class first to create workclasses");
      return;
    }
    
    // Reset form
    document.getElementById('workclassNameInput').value = '';
    document.getElementById('workclassDescription').value = '';
    document.getElementById('workclassType').value = '';
    
    // Clear any previous selections
    document.querySelectorAll('.type-option').forEach(option => {
      option.classList.remove('selected');
    });
    
    // Show modal
    document.getElementById('workclassModal').style.display = 'block';
  }
  
  function closeWorkclassModal() {
    const modal = document.getElementById('workclassModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
  

  function copyWorkclassCode(code) {
    navigator.clipboard.writeText(code);
    alert('Workclass code copied to clipboard!');
  }
  

// Add this function to handle type selection
function selectWorkclassType(type) {
    // Remove selected class from all options
    document.querySelectorAll('.type-option').forEach(option => {
      option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.currentTarget.classList.add('selected');
    
    // Set the hidden input value
    document.getElementById('workclassType').value = type;
  }

function signOut() {
    localStorage.clear();
    alert("You have been signed out.");
    window.location.href = "register.html";
}


// Add this function to handle tab switching
function openClassTab(tabName) {
    // Hide all tab contents
    document.querySelector('.announcements-feed').style.display = 'none';
    document.getElementById('workclassesTab').style.display = 'none';
    
    // Show selected tab content
    if (tabName === 'announcements') {
      document.querySelector('.announcements-feed').style.display = 'block';
    } else if (tabName === 'workclasses') {
      document.getElementById('workclassesTab').style.display = 'block';
      renderClassWorkclasses();
    }
  
    // Update active tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
      if (button.textContent.toLowerCase().includes(tabName)) {
        button.classList.add('active');
      }
    });
  }

  async function renderClassWorkclasses() {
    const classCode = document.getElementById('classCodeDisplay').textContent;
    const container = document.getElementById('classWorkclassesContainer');
    
    // Clear container and add the grid container
    container.innerHTML = `
      <div class="workclass-grid-container">
        <div id="workclassList"></div>
      </div>
    `;
  
    const workclassList = document.getElementById('workclassList');
  
    try {
      // Fetch workclasses from the server
      const response = await fetch(`http://localhost:3000/get-workclasses?CLASS_CODE=${encodeURIComponent(classCode)}`);
      const workclasses = await response.json();
  
      if (!Array.isArray(workclasses) || workclasses.length === 0) {
        workclassList.innerHTML = `
          <div class="empty-state-card">
            <i class="fas fa-briefcase"></i>
            <h4>No workclasses yet</h4>
            <p>Create your first workclass</p>
          </div>
        `;
        return;
      }
  
      // Sort by creation date (newest first)
      workclasses.sort((a, b) => new Date(b.CREATED_AT) - new Date(a.CREATED_AT));
  
      // Render cards
      workclassList.innerHTML = workclasses.map(workclass => `
        <div class="workclass-card" data-id="${workclass._id}">
          <div class="workclass-card-header">
            <h3 class="workclass-card-title">${workclass.TITLE}</h3>
            <span class="workclass-card-type">
              ${getWorkclassTypeIcon(workclass.WORKCLASSTYPE)} ${workclass.WORKCLASSTYPE.charAt(0).toUpperCase() + workclass.WORKCLASSTYPE.slice(1)}
            </span>
          </div>
          <div class="workclass-card-body">
            ${workclass.INSTRUCTIONS ? `<p>${workclass.INSTRUCTIONS.substring(0, 150)}${workclass.INSTRUCTIONS.length > 150 ? '...' : ''}</p>` : ''}
          </div>
          <div class="workclass-card-footer">
            <div class="workclass-card-due">
              ${workclass.DUEDATE ? `Due: ${new Date(workclass.DUEDATE).toLocaleDateString()}` : 'No due date'}
            </div>
            <div class="workclass-card-actions">
              <button class="secondary-btn" onclick="viewWorkclass('${workclass._id}')">
                <i class="fas fa-eye"></i> View
              </button>
              <button class="delete-btn" onclick="deleteWorkclass('${classCode}', '${workclass._id}')">
                <i class="fas fa-trash"></i> Delete
              </button>
              <button class="end-workclass-btn" onclick="endWorkclassInOneDay('${workclass._id}', '${workclass.CLASS_CODE}')">

                <i class="fas fa-hourglass-end"></i> End in One Day
              </button>
            </div>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading workclasses:', error);
      workclassList.innerHTML = `<p style="color:red;">Failed to load workclasses. Please try again later.</p>`;
    }
  }
  

// Add this helper function to get class by code
function getClassByCode(classCode) {
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    return classes.find(cls => cls.CLASS_CODE === classCode);
}

// Update the createWorkclass function to associate with current class
function createWorkclass() {
    const name = document.getElementById('workclassNameInput').value.trim();
    const description = document.getElementById('workclassDescription').value.trim();
    const type = document.getElementById('workclassType').value;

    if (!name) {
        alert("Workclass name cannot be empty!");
        return;
    }

    if (!type) {
        alert("Please select a workclass type!");
        return;
    }

    showLoading();

    const classCode = document.getElementById('classCodeDisplay').textContent;

    const workclass = {
        id: Date.now(),
        name,
        description,
        type,
        createdAt: new Date().toISOString()
    };

    let stored = JSON.parse(localStorage.getItem(`workclasses_${classCode}`)) || [];
    stored.push(workclass);
    localStorage.setItem(`workclasses_${classCode}`, JSON.stringify(stored));

    closeWorkclassModal();
    renderClassWorkclasses();
    hideLoading();
}

// Add this function to delete a workclass from a class
function deleteClassWorkclass(classCode, workclassCode) {
    if (!confirm('Are you sure you want to delete this workclass?')) return;
    
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    const classIndex = classes.findIndex(cls => cls.CLASS_CODE === classCode);
    
    if (classIndex !== -1 && classes[classIndex].workclasses) {
        classes[classIndex].workclasses = classes[classIndex].workclasses.filter(
            wc => wc.code !== workclassCode
        );
        
        localStorage.setItem('classes', JSON.stringify(classes));
        renderClassWorkclasses();
    }
}

function viewWorkclass(workclassId) {
    // Convert to number if it's a string (for comparison)
    workclassId = Number(workclassId);
    
    const workclasses = JSON.parse(localStorage.getItem('workclasses')) || [];
    const workclass = workclasses.find(wc => wc.id === workclassId);
  
    if (!workclass) {
      alert('Workclass not found.');
      return;
    }
  
    // Clear and setup the container
    const container = document.getElementById('classWorkclassesContainer');
    container.innerHTML = `
      <div class="workclass-detail-view">
        <button class="back-btn" onclick="renderClassWorkclasses()">
          <i class="fas fa-arrow-left"></i> Back to Classwork
        </button>
  
        <div class="workclass-details card">
          <div class="workclass-header">
            <h2>${workclass.title}</h2>
            <span class="workclass-type-badge ${getWorkclassBadgeClass(workclass.type)}">
              ${getWorkclassTypeIcon(workclass.type)} ${workclass.type.charAt(0).toUpperCase() + workclass.type.slice(1)}
            </span>
          </div>
          
          ${workclass.instructions ? `
            <div class="workclass-section">
              <h3>Instructions</h3>
              <p>${workclass.instructions}</p>
            </div>
          ` : ''}
          
          ${workclass.dueDate ? `
            <div class="workclass-section">
              <h3>Due Date</h3>
              <p>${new Date(workclass.dueDate).toLocaleString()}</p>
            </div>
          ` : ''}
          
          <div class="workclass-section">
            <h3>Points</h3>
            <p>${workclass.pointsPossible || 'Not specified'}</p>
          </div>
          
          ${workclass.attachments && workclass.attachments.length > 0 ? `
            <div class="workclass-section">
              <h3>Attachments</h3>
              <div class="attachments-list">
                ${workclass.attachments.map(attachment => `
                  <div class="attachment-item">
                    <i class="fas ${getFileIcon(attachment.type)}"></i>
                    <span>${attachment.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
  
        <div class="comments-section card">
          <h3>Comments</h3>
          <div id="workclassCommentsList" class="comments-list">
            <!-- Comments will be loaded here -->
          </div>
          
          <div class="comment-input">
            <textarea id="newWorkclassComment" placeholder="Write a comment..."></textarea>
            <button onclick="postWorkclassComment(${workclassId})">
              <i class="fas fa-paper-plane"></i> Post
            </button>
          </div>
        </div>
      </div>
    `;
  
    // Load comments
    loadWorkclassComments(workclassId);
  }

  function getWorkclassBadgeClass(type) {
    switch(type) {
      case 'assignment': return 'assignment-badge';
      case 'quiz': return 'quiz-badge';
      case 'question': return 'question-badge';
      case 'material': return 'material-badge';
      default: return '';
    }
  }

  function getWorkclassTypeIcon(type) {
    switch(type) {
      case 'assignment': return '<i class="fas fa-tasks"></i>';
      case 'quiz': return '<i class="fas fa-clipboard-question"></i>';
      case 'question': return '<i class="fas fa-question-circle"></i>';
      case 'material': return '<i class="fas fa-book"></i>';
      default: return '';
    }
  }

function openWorkclassTypePage(type) {
    const classCode = document.getElementById('classCodeDisplay').textContent;
    if (!classCode) {
      alert('No class selected.');
      return;
    }
  
    // Save the current class code to localStorage
    localStorage.setItem('currentClassCode', classCode);
  
    // Redirect based on type
    if (type === 'assignment') {
      window.location.href = 'assignment-form.html';
    } else if (type === 'quiz') {
      window.location.href = 'quiz-form.html';
    } else if (type === 'question') {
      window.location.href = 'question-form.html';
    } else if (type === 'material') {
      window.location.href = 'material-form.html';
    }
  }
  
// Update the dropdown toggle function in professor.js
document.querySelector('.create-workclass-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('workclassDropdownOptions');
    dropdown.classList.toggle('show');
    
    // Reset positioning first
    dropdown.style.right = '100%';
    dropdown.style.left = 'auto';
    dropdown.style.top = '0';
    dropdown.style.marginRight = '5px';
    dropdown.style.marginLeft = '0';
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.workclass-dropdown')) {
        const dropdown = document.getElementById('workclassDropdownOptions');
        dropdown.classList.remove('show');
    }
});


function deleteWorkclass(workclassId) {
  if (!confirm("Are you sure you want to delete this Workclass?")) return;

  // Get the current list of workclasses
  let workclasses = JSON.parse(localStorage.getItem('workclasses')) || [];

  // Filter out the one you want to delete
  workclasses = workclasses.filter(wc => wc.id !== workclassId);

  // Save the updated list
  localStorage.setItem('workclasses', JSON.stringify(workclasses));

  // Also update the related class's workclasses
  let classes = JSON.parse(localStorage.getItem('classes')) || [];
  const classCode = localStorage.getItem('currentClassCode');
  const classIndex = classes.findIndex(c => c.CLASS_CODE === classCode);

  if (classIndex !== -1) {
    classes[classIndex].workclasses = classes[classIndex].workclasses.filter(id => id !== workclassId);
    localStorage.setItem('classes', JSON.stringify(classes));
  }

  // Show success message
  showToast('Workclass deleted successfully!', 'success');

  // Refresh the page or re-render workclasses
  loadWorkclasses();
}


function initializeResponsiveLayout() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    const navbar = document.querySelector('.navbar');
    const allContents = document.querySelectorAll('.content');
    const allHeaders = document.querySelectorAll('.content-header');
    const body = document.body;

    function updateLayout(isCollapsed) {
        const isMobile = window.innerWidth <= 768;
        
        // Update all headers
        allHeaders.forEach(header => {
            if (isCollapsed) {
                header.style.left = '0';
                header.style.width = '100%';
            } else {
                header.style.left = isMobile ? '60px' : '250px';
                header.style.width = isMobile ? 'calc(100% - 60px)' : 'calc(100% - 250px)';
            }
        });

        // Update all content areas
        allContents.forEach(content => {
            if (isCollapsed) {
                content.style.marginLeft = '0';
            } else {
                content.style.marginLeft = isMobile ? '60px' : '250px';
            }
        });

        // Update navbar
        navbar.style.left = isCollapsed ? '0' : (isMobile ? '60px' : '250px');
        navbar.style.width = isCollapsed ? '98%' : (isMobile ? 'calc(98% - 60px)' : 'calc(98% - 250px)');
    }

    // Enhanced toggle sidebar handler
    function toggleSidebar() {
        hamburgerBtn.classList.toggle('active');
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('active');
        navbar.classList.toggle('expanded');
        body.classList.toggle('sidebar-open');
        
        const isCollapsed = sidebar.classList.contains('collapsed');
        sidebar.style.width = isCollapsed ? '0' : (window.innerWidth <= 768 ? '60px' : '250px');
        
        // Close dropdowns when sidebar is toggled
        if (!sidebar.classList.contains('active')) {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
        
        updateLayout(isCollapsed);
    }

    // Event Listeners
    hamburgerBtn.addEventListener('click', toggleSidebar);

    // Handle window resize
    window.addEventListener('resize', () => {
        const isCollapsed = sidebar.classList.contains('collapsed');
        updateLayout(isCollapsed);
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !hamburgerBtn.contains(event.target) && 
            !sidebar.classList.contains('collapsed')) {
            toggleSidebar();
        }
    });

    // Close sidebar when clicking on content (mobile only)
    allContents.forEach(content => {
        content.addEventListener('click', function() {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
    });

    // Initial layout setup
    updateLayout(sidebar.classList.contains('collapsed'));
}

// Update your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize responsive layout
    initializeResponsiveLayout();
    
    // ... rest of your existing DOMContentLoaded code ...
});

// Add this function to handle fullscreen toggling
function toggleFullscreen() {
    const btn = document.querySelector('.fullscreen-btn');
    const icon = btn.querySelector('i');

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
            btn.classList.add('active');
        });
    } else {
        document.exitFullscreen().then(() => {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
            btn.classList.remove('active');
        });
    }
}

// Add event listener for fullscreen changes
document.addEventListener('fullscreenchange', () => {
    const btn = document.querySelector('.fullscreen-btn');
    const icon = btn.querySelector('i');
    
    if (!document.fullscreenElement) {
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
        btn.classList.remove('active');
    }
});

function cleanupWorkclasses() {
    const classes = JSON.parse(localStorage.getItem('classes')) || [];
    const allWorkclasses = JSON.parse(localStorage.getItem('workclasses')) || [];
    
    // Get all referenced workclass IDs
    const referencedIds = classes.flatMap(c => c.workclasses || []);
    
    // Filter out workclasses not referenced by any class
    const validWorkclasses = allWorkclasses.filter(w => referencedIds.includes(w.id));
    
    localStorage.setItem('workclasses', JSON.stringify(validWorkclasses));
}

function saveQuizAndRedirect(quizData) {
    showLoading();
    
    const classCode = localStorage.getItem('currentClassCode');
    const type = localStorage.getItem('currentWorkclassType');
    
    const workclass = {
        id: Date.now(),
        classCode: classCode,
        title: quizData.title,
        description: quizData.description,
        type: type,
        questions: quizData.questions,
        pointsPossible: quizData.pointsPossible,
        dueDate: quizData.dueDate,
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    let workclasses = JSON.parse(localStorage.getItem('workclasses')) || [];
    workclasses.push(workclass);
    localStorage.setItem('workclasses', JSON.stringify(workclasses));
    
    // Update class reference
    let classes = JSON.parse(localStorage.getItem('classes')) || [];
    const classIndex = classes.findIndex(c => c.CLASS_CODE === classCode);
    if (classIndex !== -1) {
        if (!classes[classIndex].workclasses) {
            classes[classIndex].workclasses = [];
        }
        classes[classIndex].workclasses.push(workclass.id);
        localStorage.setItem('classes', JSON.stringify(classes));
    }
    
    // Clean up temporary storage
    localStorage.removeItem('currentClassCode');
    localStorage.removeItem('currentWorkclassType');
    
    // Redirect back to professor page
    window.location.href = 'professor.html';
}

function checkUrlForClass() {
    const urlParams = new URLSearchParams(window.location.search);
    const classCode = urlParams.get('class');
    
    if (classCode) {
      // Find the class in localStorage
      const classes = JSON.parse(localStorage.getItem('classes')) || [];
      const classData = classes.find(c => c.CLASS_CODE === classCode);
      
      if (classData) {
        openClassPage(classData);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    checkUrlForClass();
  });

function backToClasswork() {
  renderClassWorkclasses(); // re-renders the original Classwork list
}

function postWorkclassComment(workclassId) {
  const input = document.getElementById('newWorkclassComment');
  const commentText = input.value.trim();
  if (!commentText) {
    alert('Please write a comment.');
    return;
  }

  let comments = JSON.parse(localStorage.getItem(`workclassComments_${workclassId}`)) || [];

  comments.push({
    id: Date.now(),
    author: 'Professor', // Later dynamic based on user
    text: commentText,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(`workclassComments_${workclassId}`, JSON.stringify(comments));
  input.value = '';
  loadWorkclassComments(workclassId);
}

function loadWorkclassComments(workclassId) {
  const container = document.getElementById('workclassCommentsList');
  container.innerHTML = '';

  const comments = JSON.parse(localStorage.getItem(`workclassComments_${workclassId}`)) || [];

  if (comments.length === 0) {
    container.innerHTML = '<p>No comments yet.</p>';
    return;
  }

  comments.forEach(comment => {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.innerHTML = `
      <strong>${comment.author}</strong> <small>${new Date(comment.createdAt).toLocaleString()}</small>
      <p>${comment.text}</p>
    `;
    container.appendChild(div);
  });
}


function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

class DataService {
    static getClasses() {
        return JSON.parse(localStorage.getItem('classes')) || [];
    }

    static saveClass(classData) {
        const classes = this.getClasses();
        const existingIndex = classes.findIndex(c => c.CLASS_CODE === classData.CLASS_CODE);
        
        if (existingIndex >= 0) {
            classes[existingIndex] = classData;
        } else {
            classes.push(classData);
        }
        
        localStorage.setItem('classes', JSON.stringify(classes));
        return classData;
    }

    static getWorkclasses() {
        return JSON.parse(localStorage.getItem('workclasses')) || [];
    }

    static saveWorkclass(workclass) {
        const workclasses = this.getWorkclasses();
        const existingIndex = workclasses.findIndex(w => w.id === workclass.id);
        
        if (existingIndex >= 0) {
            workclasses[existingIndex] = workclass;
        } else {
            workclasses.push(workclass);
        }
        
        localStorage.setItem('workclasses', JSON.stringify(workclasses));
        return workclass;
    }
}


function loadClassWorkForGrading() {
    const classCode = document.getElementById('classSelect').value;
    const workclasses = JSON.parse(localStorage.getItem(`workclasses_${classCode}`)) || [];
    const workclassGradingList = document.getElementById('workclassGradingList');

    workclassGradingList.innerHTML = '';
    if (workclasses.length === 0) {
        workclassGradingList.innerHTML = '<p>No workclasses available for grading.</p>';
        return;
    }

    workclasses.forEach(workclass => {
        workclassGradingList.innerHTML += `
            <div class="workclass-item">
                <h4>${workclass.title}</h4>
                <button onclick="loadStudentSubmissions('${workclass.id}')">View Submissions</button>
            </div>
        `;
    });
}

function loadStudentSubmissions(workclassId) {
    const submissions = JSON.parse(localStorage.getItem(`submissions_${workclassId}`)) || [];
    const studentGradingList = document.getElementById('studentGradingList');

    studentGradingList.innerHTML = '';
    if (submissions.length === 0) {
        studentGradingList.innerHTML = '<p>No submissions available for grading.</p>';
        return;
    }

    submissions.forEach(submission => {
        studentGradingList.innerHTML += `
            <div class="submission-item">
                <h4>${submission.studentName}</h4>
                <p>Submitted on: ${new Date(submission.submittedAt).toLocaleString()}</p>
                <textarea placeholder="Enter grade here">${submission.grade || ''}</textarea>
                <button onclick="saveGrade('${workclassId}', '${submission.studentId}')">Save Grade</button>
            </div>
        `;
    });
}

function saveGrade(workclassId, studentId) {
    const submissions = JSON.parse(localStorage.getItem(`submissions_${workclassId}`)) || [];
    const submissionIndex = submissions.findIndex(sub => sub.studentId === studentId);

    if (submissionIndex !== -1) {
        const gradeInput = document.querySelector(`.submission-item textarea`);
        submissions[submissionIndex].grade = gradeInput.value;
        localStorage.setItem(`submissions_${workclassId}`, JSON.stringify(submissions));
        alert('Grade saved successfully!');
    }
}

function showSettings() {
    // Hide all other content sections
    document.querySelectorAll('.content').forEach(content => {
      content.style.display = 'none';
    });
    
    // Show settings section
    document.getElementById('settings').style.display = 'block';
  }
  
  function switchSettingsTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.settings-nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelectorAll('.settings-tab').forEach(content => {
      content.classList.remove('active');
    });
    
    // Add active class to selected tab
    document.querySelector(`button[onclick="switchSettingsTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}Settings`).classList.add('active');
  }
  
  function uploadProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('profilePreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

// Add this function to generate dummy rankings data
function getDummyRankings(sectionId) {
    // Create different rankings for each section
    const rankingsData = {
        'Section A': [
            { name: 'John Doe', score: 95, avatar: 'https://i.pravatar.cc/150?img=1' },
            { name: 'Jane Smith', score: 92, avatar: 'https://i.pravatar.cc/150?img=2' },
            { name: 'Mike Johnson', score: 88, avatar: 'https://i.pravatar.cc/150?img=3' },
            { name: 'Sarah Williams', score: 85, avatar: 'https://i.pravatar.cc/150?img=4' },
            { name: 'Tom Brown', score: 82, avatar: 'https://i.pravatar.cc/150?img=5' }
        ],
        'Section B': [
            { name: 'Emily Davis', score: 98, avatar: 'https://i.pravatar.cc/150?img=6' },
            { name: 'James Wilson', score: 94, avatar: 'https://i.pravatar.cc/150?img=7' },
            { name: 'Lisa Anderson', score: 91, avatar: 'https://i.pravatar.cc/150?img=8' },
            { name: 'David Taylor', score: 87, avatar: 'https://i.pravatar.cc/150?img=9' },
            { name: 'Amy Martinez', score: 84, avatar: 'https://i.pravatar.cc/150?img=10' }
        ],
        'Section C': [
            { name: 'Robert Clark', score: 96, avatar: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Maria Garcia', score: 93, avatar: 'https://i.pravatar.cc/150?img=12' },
            { name: 'Daniel Lee', score: 89, avatar: 'https://i.pravatar.cc/150?img=13' },
            { name: 'Emma White', score: 86, avatar: 'https://i.pravatar.cc/150?img=14' },
            { name: 'Kevin Moore', score: 83, avatar: 'https://i.pravatar.cc/150?img=15' }
        ]
    };

    // Return rankings for the selected section or empty array if section not found
    return rankingsData[sectionId] || [];
}

  // Function to switch between sections in rankings
function switchSection(sectionId) {
    // Remove active class from all section items
    document.querySelectorAll('.class-list li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected section
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Update podium and rankings list for the selected section
    updateRankings(sectionId);
}

// Function to update rankings display
function updateRankings(sectionId) {
    const podium = document.querySelector('.podium');
    const rankingsList = document.querySelector('.rankings-list');
    
    // Clear existing content
    podium.innerHTML = '';
    rankingsList.innerHTML = '';
    
    // Fetch and display rankings for the selected section
    // This is where you would normally fetch data from your backend
    // For now, we'll use dummy data
    const rankings = getDummyRankings(sectionId);
    
    // Create podium for top 3
    createPodium(rankings.slice(0, 3));
    
    // Create full rankings list
    createRankingsList(rankings);
}

// Helper function to create podium display
function createPodium(topThree) {
    const podium = document.querySelector('.podium');
    const positions = [2, 1, 3]; // Order for visual display (2nd, 1st, 3rd)
    
    positions.forEach((pos, index) => {
        const student = topThree[pos - 1];
        if (student) {
            const pedestal = document.createElement('div');
            pedestal.className = `pedestal rank-${pos}`;
            pedestal.innerHTML = `
                <div class="student-avatar">
                    <img src="${student.avatar || 'default-avatar.png'}" alt="${student.name}">
                </div>
                <div class="student-name">${student.name}</div>
                <div class="student-score">${student.score}pts</div>
            `;
            podium.appendChild(pedestal);
        }
    });
}

// Helper function to create rankings list
function createRankingsList(rankings) {
    const rankingsList = document.querySelector('.rankings-list');
    
    rankings.forEach((student, index) => {
        const rankItem = document.createElement('div');
        rankItem.className = 'rank-item';
        rankItem.innerHTML = `
            <div class="rank-position">${index + 1}</div>
            <div class="student-info">
                <img src="${student.avatar || 'default-avatar.png'}" alt="${student.name}">
                <span>${student.name}</span>
            </div>
            <div class="student-score">${student.score}pts</div>
        `;
        rankingsList.appendChild(rankItem);
    });
}

// Add event listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for section selection
    document.querySelectorAll('.class-list li').forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            switchSection(sectionId);
        });
    });
    
    // Initialize with first section
    const firstSection = document.querySelector('.class-list li');
    if (firstSection) {
        switchSection(firstSection.getAttribute('data-section'));
    }
});

// Sample data for classes and their workclasses
const sampleClasses = [
    {
        id: 1,
        name: "Web Development",
        section: "BSIT 3-1",
        workclasses: [
            {
                id: 101,
                name: "HTML Basics Quiz",
                type: "quiz",
                dueDate: "2025-05-01",
                submissions: [
                    { studentId: 1, studentName: "John Doe", submitted: true, grade: null },
                    { studentId: 2, studentName: "Jane Smith", submitted: true, grade: null },
                    { studentId: 3, studentName: "Mike Johnson", submitted: false, grade: null }
                ]
            },
            {
                id: 102,
                name: "CSS Project",
                type: "assignment",
                dueDate: "2025-05-05",
                submissions: [
                    { studentId: 1, studentName: "John Doe", submitted: true, grade: null },
                    { studentId: 2, studentName: "Jane Smith", submitted: false, grade: null },
                    { studentId: 3, studentName: "Mike Johnson", submitted: true, grade: null }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Database Management",
        section: "BSIT 3-2",
        workclasses: [
            {
                id: 201,
                name: "SQL Fundamentals",
                type: "quiz",
                dueDate: "2025-05-03",
                submissions: [
                    { studentId: 4, studentName: "Sarah Williams", submitted: true, grade: null },
                    { studentId: 5, studentName: "Tom Brown", submitted: true, grade: null },
                    { studentId: 6, studentName: "Emily Davis", submitted: true, grade: null }
                ]
            }
        ]
    }
];

// Function to populate class dropdown
function populateClassDropdown() {
    const classSelect = document.getElementById('classSelect');
    classSelect.innerHTML = '<option value="" disabled selected>Select a class</option>';
    
    sampleClasses.forEach(classItem => {
        const option = document.createElement('option');
        option.value = classItem.id;
        option.textContent = `${classItem.name} - ${classItem.section}`;
        classSelect.appendChild(option);
    });
}

// Function to load workclasses for selected class
function loadClassWorkForGrading() {
    const classSelect = document.getElementById('classSelect');
    const workclassList = document.getElementById('workclassGradingList');
    const selectedClass = sampleClasses.find(c => c.id == classSelect.value);
    
    workclassList.innerHTML = '';
    
    if (selectedClass) {
        selectedClass.workclasses.forEach(workclass => {
            const workclassElement = document.createElement('div');
            workclassElement.className = 'workclass-item';
            workclassElement.innerHTML = `
                <div class="workclass-info">
                    <h4>${workclass.name}</h4>
                    <p>Type: ${workclass.type}</p>
                    <p>Due: ${workclass.dueDate}</p>
                </div>
                <button onclick="loadStudentSubmissions(${workclass.id})">
                    View Submissions
                </button>
            `;
            workclassList.appendChild(workclassElement);
        });
    }
}

// Function to load student submissions for a workclass
function loadStudentSubmissions(workclassId) {
    const gradingList = document.getElementById('studentGradingList');
    let submissions = [];
    
    // Find submissions for the selected workclass
    sampleClasses.forEach(classItem => {
        classItem.workclasses.forEach(workclass => {
            if (workclass.id === workclassId) {
                submissions = workclass.submissions;
            }
        });
    });
    
    gradingList.innerHTML = '';
    
    submissions.forEach(submission => {
        const submissionElement = document.createElement('div');
        submissionElement.className = 'student-submission';
        submissionElement.innerHTML = `
            <div class="student-info">
                <h4>${submission.studentName}</h4>
                <p>Status: ${submission.submitted ? 'Submitted' : 'Not Submitted'}</p>
            </div>
            ${submission.submitted ? `
                <div class="grading-inputs">
                    <input type="number" min="0" max="100" placeholder="Enter grade" 
                           value="${submission.grade || ''}"
                           onchange="saveGrade(${workclassId}, ${submission.studentId}, this.value)">
                    <button class="grade-btn">Save Grade</button>
                </div>
            ` : ''}
        `;
        gradingList.appendChild(submissionElement);
    });
}

// Function to save grade
function saveGrade(workclassId, studentId, grade) {
    // Find and update the grade in the sample data
    sampleClasses.forEach(classItem => {
        classItem.workclasses.forEach(workclass => {
            if (workclass.id === workclassId) {
                const submission = workclass.submissions.find(s => s.studentId === studentId);
                if (submission) {
                    submission.grade = grade;
                    // Show success message
                    alert(`Grade saved successfully for ${submission.studentName}`);
                }
            }
        });
    });
}

// Add event listener to load classes when the grading page is shown
document.addEventListener('DOMContentLoaded', () => {
    populateClassDropdown();
});

function endClassInOneDay() {
    const classId = getCurrentClassId(); // You'll need to implement this to get current class ID
    
    // Show confirmation dialog
    if (confirm('Are you sure you want to end this class in 24 hours? Students will be notified.')) {
        // Calculate end time (24 hours from now)
        const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        // Show success message
        alert(`Class will end on ${endTime.toLocaleString()}`);
        
        // Here you would typically:
        // 1. Update the class status in your database
        // 2. Send notifications to students
        // 3. Update the UI to reflect the pending end time
        
        // Add a countdown timer to the class header
        const classHeader = document.querySelector('#classNameDisplay');
        const endingBadge = document.createElement('span');
        endingBadge.className = 'ending-badge';
        endingBadge.innerHTML = `<i class="fas fa-clock"></i> Ending in 24h`;
        classHeader.appendChild(endingBadge);
    }
}

function endWorkclassInOneDay(workclassId, classCode) {
    if (confirm('Are you sure you want to end this workclass in 24 hours? Students will be notified.')) {
        const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        // Show the ending badge
        const badge = document.querySelector(`#endingBadge-${workclassId}`);
        // badge.style.display = 'flex';
        
        // Start countdown
        updateCountdown(workclassId, endTime);
        
        // Store the end time (you might want to save this to your backend)
        localStorage.setItem(`workclass-${workclassId}-endTime`, endTime.getTime());
        
        // Send email notification to students
        sendEndOfWorkclassEmailNotification(workclassId, classCode);
    }
}

// Function to send the email notification to students
async function sendEndOfWorkclassEmailNotification(workclassId, classCode) {
    const payload = {
        workclassId: workclassId, // Pass the workclassId
        classCode: classCode,     // Pass the classCode
    };

    console.log("Sending email with payload:", payload); // Log the payload

    try {
        const response = await fetch('http://localhost:3000/send-email-due-soon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Wait for the response to be processed
        const data = await response.json();
        
        if (response.ok) {
            console.log(data.message); // Handle success
        } else {
            console.error('Failed to send email:', data.error); // Handle error from the backend
        }
    } catch (error) {
        console.error('Error sending email:', error); // Handle any network or other errors
    }
}

function updateCountdown(workclassId, endTime) {
    const badge = document.querySelector(`#endingBadge-${workclassId} .countdown`);
    
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        if (distance < 0) {
            clearInterval(timer);
            badge.parentElement.innerHTML = '<i class="fas fa-check"></i> Ended';
            // Here you would typically handle the workclass ending
        } else {
            badge.textContent = `Ending in ${hours}h ${minutes}m`;
        }
    }, 1000);
}

async function createAnnouncement(announcementData) {
    const response = await fetch("http://localhost:3000/create-announcements", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(announcementData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create announcement: ${errorText}`);
    }

    const result = await response.json();
    return result; // contains the message
}

async function fetchAnnouncements(classCode = null) {   
    const query = classCode ? `?CLASS_CODE=${encodeURIComponent(classCode)}` : "";
    const response = await fetch(`http://localhost:3000/show-announcements${query}`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch announcements: ${errorText}`);
    }

    const announcements = await response.json();

    renderClasses();

    return announcements;
}