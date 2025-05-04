let currentClass = null;
// Student-specific functionality
const studentData = {
    name: '',
    email: '',
    enrolledClasses: []
  };

  let userName = '';

  let classData = [];
  let classCode = '';
  let userClasses = [];
  let announcements = []; 
  let assignmentsCount = 0;

  document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    const user = JSON.parse(localStorage.getItem('user'));
    userName = JSON.parse(localStorage.getItem('user'));

    // Inject sample class if none exist
    if (user) {
      document.getElementById('userName').textContent = user.FULL_NAME || 'Student';
      document.getElementById('userEmail').textContent = user.EMAIL || 'student@example.com';
      document.getElementById('userEmailDisplay').textContent = user.EMAIL || 'student@example.com';
      
      studentData.name = user.NAME;
      studentData.email = user.EMAIL;

      userName = user.USERNAME;
    }
    
    showJoinedClasses();

    // Load enrolled classes
    loadEnrolledClasses();
    
    // Initialize dashboard counts
    updateDashboardCounts();
    
    // Set up event listeners
    setupEventListeners();
  });
  
  async function loadEnrolledClasses() {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.USERNAME;
  
    const container = document.getElementById('classContainer');
    container.innerHTML = ''; // Clear existing content
  
    try {
      const response = await fetch(`http://localhost:3000/student-classes?username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }
  
      const enrolled = await response.json(); // Your array of class objects
      studentData.enrolledClasses = enrolled; // Save to global object
  
      if (enrolled.length === 0) {
        container.innerHTML = `
          <div class="empty-state-card">
            <i class="fas fa-book-open"></i>
            <h4>No classes yet</h4>
            <p>Join a class to get started</p>
            <button class="primary-btn" onclick="openJoinClassModal()">
              <i class="fas fa-plus"></i> Join Class
            </button>
          </div>
        `;
        return;
      }
  
      enrolled.forEach(cls => {
        const classBox = document.createElement('div');
        classBox.className = 'class-box';
        classBox.innerHTML = `
          <section class="class-info">
            <h3>${cls.CLASS_NAME}</h3>
            <p>Section: ${cls.SECTION || "N/A"}</p>
            <p>Professor: ${cls.NAME || "N/A"}</p>
          </section>
        `;

        classBox.addEventListener('click', () => openClassPage(cls));
        container.appendChild(classBox);
      });
  
    } catch (error) {
      console.error('Error loading classes:', error);
      container.innerHTML = `<p class="error-msg">Error loading classes. Please try again later.</p>`;
    }
  }  
  
  function openJoinClassModal() {
    const modal = document.getElementById('joinClassModal');
    const overlay = document.getElementById('modalOverlay');
  
    if (modal) modal.style.display = 'block';
    if (overlay) overlay.style.display = 'block';
  
    document.getElementById('classCodeInput').focus();
  }
  
  
  async function joinClass() {
    const classCode = document.getElementById('classCodeInput').value.trim().toUpperCase();

    if (!classCode || classCode.length < 5 || classCode.length > 8) {
        alert('Please enter a valid class code (5-8 characters)');
        return;
    }

    const userData = localStorage.getItem('user');
    
    if (!userData) {
        alert("User not logged in.");
        return;
    }

    const user = JSON.parse(userData);
    const student = {
        USERNAME: user.USERNAME,
        NAME: user.FULL_NAME
    };

    if (!student.USERNAME || !student.NAME) {
        alert("Missing student information.");
        return;
    }

    showLoading();

    try {
        const response = await fetch(`http://localhost:3000/join-class/${classCode}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${errorText}`);
        }

        const result = await response.json();

        // Clear input
        document.getElementById('classCodeInput').value = '';

        // Update UI
        setTimeout(() => {
            showJoinedClasses(); // Refresh the class list
            // redirectToMyClassesSection(); // Navigate if needed
            showToast("Successfully joined the class!", "success");
            hideLoading();
        }, 500);
    } catch (error) {
        console.error('Error joining class:', error);
        alert('An error occurred while joining the class. ' + error.message);
        hideLoading();
    }
}
  
function openClassPage(classData) {
  currentClass = classData; // Store globally
  classCode = classData.CLASS_CODE; // Set classCode from classData

  // Display class information
  document.getElementById('classNameDisplay').textContent = classData.CLASS_NAME;
  document.getElementById('sectionDisplay').textContent = classData.SECTION || 'N/A';
  document.getElementById('professorDisplay').textContent = classData.NAME || 'N/A';

  // Hide all content and show class page
  document.querySelectorAll('.content').forEach(content => {
    content.style.display = 'none';
  });
  document.getElementById('classPage').style.display = 'block';

  openClassTab('announcements'); // Default tab

  // Now load announcements for the given classCode
  loadAnnouncements(classCode); // Pass the correct classCode here
  loadClassWork();
}

async function loadAnnouncements() {
  const container = document.getElementById('announcementsList');
  container.innerHTML = ''; // Clear previous content

  try {
    const announcements = await fetchAnnouncements(classCode);

    if (announcements.length === 0) {
      document.getElementById('noAnnouncements').style.display = 'flex';
      return;
    }

    document.getElementById('noAnnouncements').style.display = 'none';

    announcements.forEach(announcement => {
      const element = document.createElement('div');
      element.className = 'announcement-card card';
      element.innerHTML = `
        <div class="announcement-header">
          <div class="announcement-author-avatar">
            ${announcement.NAME?.charAt(0) || "?"}
          </div>
          <div>
            <div class="announcement-author">${announcement.NAME || "Unknown"}</div>
            <div class="announcement-date">${new Date(announcement.DATE).toLocaleString()}</div>
          </div>
        </div>
        <div class="announcement-content">
          <p>${announcement.CONTENT}</p>
        </div>
      `;
      container.appendChild(element);
    });
  } catch (error) {
    console.error('Error loading announcements:', error);
    container.innerHTML = `<p class="error-msg">Error loading announcements. Please try again later.</p>`;
  }
}
  
async function loadClassWork() {
  const container = document.getElementById('classWorkclassesContainer');
  container.innerHTML = ''; // Clear previous content

  try {
    const response = await fetch(`http://localhost:3000/get-workclasses?CLASS_CODE=${encodeURIComponent(classCode)}`);
    if (!response.ok) throw new Error("Failed to fetch workclasses");

    const workclasses = await response.json();

    assignmentsCount = workclasses.length;

    if (workclasses.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <i class="fas fa-briefcase"></i>
          <h4>No work yet</h4>
          <p>Your professor hasn't assigned anything yet</p>
        </div>
      `;
      return;
    }

    workclasses.forEach(workclass => {
      const dueDate = new Date(workclass.DUEDATE || workclass.ENDDATETIME || workclass.STARTDATETIME || Date.now());

      const element = document.createElement('div');
      element.className = `workclass-card ${workclass.WORKCLASSTYPE}`;
      element.innerHTML = `
        <div class="workclass-card-header">
          <h3 class="workclass-card-title">${workclass.TITLE}</h3>
          <span class="workclass-card-type">
            ${workclass.WORKCLASSTYPE.charAt(0).toUpperCase() + workclass.WORKCLASSTYPE.slice(1)}
          </span>
        </div>
        <div class="workclass-card-body">
          <p>Due: ${dueDate.toLocaleDateString()}</p>
          <p>Status: <span class="submission-status ${getStatusClass(workclass)}">
            ${getStatusText(workclass)}
          </span></p>
        </div>
        <div class="workclass-card-footer">
          <button class="secondary-btn" onclick="viewWorkclass('${workclass._id}')">
            <i class="fas fa-eye"></i> View
          </button>
          ${workclass.STATUS === 'assigned' ? `
            <button class="primary-btn" onclick="submitWork('${workclass._id}')">
              <i class="fas fa-paper-plane"></i> Submit
            </button>
          ` : ''}
        </div>
      `;
      container.appendChild(element);
    });
  } catch (error) {
    console.error("Error loading class work:", error);
    container.innerHTML = `<p class="error-text">Unable to load workclasses. Please try again later.</p>`;
  }
}
  
//TO POLISH
  function getStatusClass(workclass) {
    if (workclass.STATUS === 'submitted') return 'turned-in';
    if (workclass.STATUS === 'assigned') {
      const dueSoon = workclass.dueDate - Date.now() < 2 * 24 * 60 * 60 * 1000;
      return dueSoon ? 'due-soon' : '';
    }
    return 'missing';
  }
  
  function getStatusText(workclass) {
    if (workclass.STATUS === 'submitted') return 'Turned in';
    if (workclass.STATUS === 'published') {
      const dueSoon = workclass.DUEDATE - Date.now() < 2 * 24 * 60 * 60 * 1000;
      return dueSoon ? 'Due soon' : 'Assigned';
    }
    return 'Missing';
  }
  
  function getGradeClass(grade) {
    if (!grade) return '';
    const percent = parseFloat(grade);
    if (percent >= 90) return 'A';
    if (percent >= 80) return 'B';
    if (percent >= 70) return 'C';
    if (percent >= 60) return 'D';
    return 'F';
  }
  
  function viewWorkclass(workclassId) {
    // In a real app, fetch workclass details
    const workclass = {
      id: workclassId,
      title: 'Sample Workclass',
      type: 'assignment',
      instructions: 'Complete the assigned readings and answer the questions.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      points: 100,
      status: 'assigned'
    };
    
    const container = document.getElementById('classWorkclassesContainer');
    container.innerHTML = `
      <div class="workclass-detail-view">
        <button class="back-btn" onclick="loadClassWork()">
          <i class="fas fa-arrow-left"></i> Back to Classwork
        </button>
        
        <div class="workclass-details card">
          <div class="workclass-header">
            <h2>${workclass.title}</h2>
            <span class="workclass-type-badge">
              ${workclass.type.charAt(0).toUpperCase() + workclass.type.slice(1)}
            </span>
          </div>
          
          <div class="workclass-section">
            <h3>Instructions</h3>
            <p>${workclass.instructions}</p>
          </div>
          
          <div class="workclass-section">
            <h3>Due Date</h3>
            <p>${workclass.dueDate.toLocaleString()}</p>
          </div>
          
          <div class="workclass-section">
            <h3>Points</h3>
            <p>${workclass.points}</p>
          </div>
          
          ${workclass.status === 'assigned' ? `
            <div class="workclass-section">
              <h3>Submit Work</h3>
              <div class="file-upload">
                <label for="workSubmission" class="file-upload-btn">
                  <i class="fas fa-paperclip"></i> Attach File
                  <input type="file" id="workSubmission" style="display: none;">
                </label>
                <span id="submissionFileName">No file chosen</span>
              </div>
              <button class="primary-btn" onclick="submitWork(${workclass.id})">
                <i class="fas fa-paper-plane"></i> Submit
              </button>
            </div>
          ` : `
            <div class="workclass-section">
              <h3>Your Submission</h3>
              <p>Submitted on ${new Date().toLocaleString()}</p>
            </div>
          `}
        </div>
      </div>
    `;
    
    // Set up file input
    document.getElementById('workSubmission').addEventListener('change', function(e) {
      const fileName = e.target.files[0]?.name || 'No file chosen';
      document.getElementById('submissionFileName').textContent = fileName;
    });
  }
  
  function submitWork(workclassId) {
    const fileInput = document.getElementById('workSubmission');
    if (!fileInput || !fileInput.files[0]) {
      alert('Please select a file to submit');
      return;
    }
    
    showLoading();
    
    // In a real app, this would upload to the server
    setTimeout(() => {
      hideLoading();
      showToast('Work submitted successfully!', 'success');
      
      // Update the workclass status
      const container = document.getElementById('classWorkclassesContainer');
      container.innerHTML = `
        <div class="workclass-detail-view">
          <button class="back-btn" onclick="loadClassWork()">
            <i class="fas fa-arrow-left"></i> Back to Classwork
          </button>
          
          <div class="workclass-details card">
            <div class="workclass-header">
              <h2>Work Submitted</h2>
            </div>
            
            <div class="workclass-section">
              <p>Your work has been submitted successfully.</p>
              <p>Submitted file: ${fileInput.files[0].name}</p>
              <p>Submitted on: ${new Date().toLocaleString()}</p>
            </div>
            
            <button class="primary-btn" onclick="loadClassWork()">
              <i class="fas fa-arrow-left"></i> Back to Classwork
            </button>
          </div>
        </div>
      `;
    }, 1500);
  }
  
  function loadClassPeople(classCode) {
    // In a real app, fetch from server
    const people = [
      { name: 'Professor Smith', role: 'teacher', email: 'prof@example.com' },
      { name: 'Student One', role: 'student', email: 'student1@example.com' },
      { name: 'Student Two', role: 'student', email: 'student2@example.com' },
      { name: 'Student Three', role: 'student', email: 'student3@example.com' }
    ];
    
    const container = document.getElementById('peopleList');
    container.innerHTML = '';
    
    people.forEach(person => {
      const element = document.createElement('div');
      element.className = 'person-card';
      element.innerHTML = `
        <div class="person-avatar">
          <img src="https://i.pravatar.cc/150?u=${person.email}" alt="${person.name}">
        </div>
        <div>
          <h4>${person.name}</h4>
          <p>${person.role.charAt(0).toUpperCase() + person.role.slice(1)}</p>
        </div>
      `;
      container.appendChild(element);
    });
  }
  
  async function updateDashboardCounts() {
    // Update basic counts from local studentData
    document.getElementById('course-count').textContent = userClasses.length;
    document.getElementById('active-course-count').textContent = userClasses.length;
  
    // Still static for now, unless you implement grade tracking
    document.getElementById('average-grade').textContent = '88%';
  
    try {

      const response = await fetch(`http://localhost:3000/student-workclasses-count/${userName}`);
      if (!response.ok) throw new Error("Failed to fetch student workclasses");
  
      const data = await response.json();
      const assignmentsCount = data.count;
  
      document.getElementById('assignments-due-count').textContent = assignmentsCount;
      console.log("Assignments due:", assignmentsCount);
  
    } catch (error) {
      console.error("Error updating dashboard counts:", error);
    }
  }  
  
  
  function showContent(section) {
    showLoading();
  
    // Hide all content sections
    document.querySelectorAll('.content').forEach(content => {
      content.style.display = 'none';
    });
  
    // Show selected section after short delay
    setTimeout(() => {
      document.getElementById(section).style.display = 'block';
      hideLoading();

      //errors
      // if (section === 'classes') {
      //   renderClasses();
      // } 
      if (section === 'rankings') {
        loadRankings();
      }
    }, 500);
  }

  function loadRankings() {
    const subjectsList = document.querySelector('.class-list');
    const podium = document.querySelector('.podium');
    const rankingsList = document.querySelector('.rankings-list');
  
    if (!subjectsList || !podium || !rankingsList) return;
  
    subjectsList.innerHTML = '';
    studentData.enrolledClasses.forEach((cls, index) => {
      const li = document.createElement('li');
      li.textContent = cls.name;
      li.setAttribute('data-subject', cls.name);
      if (index === 0) li.classList.add('active');
      li.addEventListener('click', () => selectRankingSubject(cls));
      subjectsList.appendChild(li);
    });
  
    if (studentData.enrolledClasses.length > 0) {
      selectRankingSubject(studentData.enrolledClasses[0]);
    }
  }
  
  function selectRankingSubject(cls) {
    document.querySelectorAll('.class-list li').forEach(li => li.classList.remove('active'));
    document.querySelector(`.class-list li[data-subject="${cls.name}"]`).classList.add('active');
  
    const podium = document.querySelector('.podium');
    const rankingsList = document.querySelector('.rankings-list');
  
    const students = [
      { name: 'John Smith', score: 97 },
      { name: 'Jane Doe', score: 92 },
      { name: 'Emily Clark', score: 89 },
      { name: 'Michael Lee', score: 86 },
      { name: 'Sarah Johnson', score: 85 },
      { name: 'Chris Evans', score: 83 }
    ];
  
    // Populate podium with animated pedestal and medal icons
    podium.innerHTML = '';
    const pedestalHeights = ['80px', '120px', '60px'];
    const medalIcons = ['🥈', '🥇', '🥉'];
    const orders = [1, 0, 2]; // To reorder: [2nd, 1st, 3rd]
  
    orders.forEach((idx, i) => {
      const student = students[idx];
      const div = document.createElement('div');
      div.className = `rank rank-${idx + 1}`;
      div.style.display = 'flex';
      div.style.flexDirection = 'column';
      div.style.alignItems = 'center';
      div.style.animation = 'riseUp 0.6s ease forwards';
      div.style.opacity = '0';
      div.style.animationDelay = `${i * 0.2}s`;
  
      div.innerHTML = `
        <div class="pedestal" style="height: ${pedestalHeights[i]}; width: 100%; background: #4285f4; border-radius: 4px 4px 0 0; display: flex; align-items: flex-end; justify-content: center;">
          <img src="Picture/default-student.png" alt="${idx + 1}" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 5px;">
        </div>
        <p style="font-size: 1.1em; margin: 5px 0;">${medalIcons[i]} ${student.name}</p>
        <span>${student.score}%</span>
      `;
      podium.appendChild(div);
    });
  
    // Populate ranking list (4th and below)
    rankingsList.innerHTML = '';
    students.slice(3).forEach((student, index) => {
      const div = document.createElement('div');
      div.className = 'ranking-list-item';
      div.innerHTML = `
        <span class="rank-number">${index + 4}</span>
        <img src="Picture/default-student.png" alt="Student">
        <p>${student.name}</p>
        <span>${student.score}%</span>
      `;
      rankingsList.appendChild(div);
    });
  }
  
  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes riseUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  
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
  
  function toggleProfileDropdown() {
    document.getElementById('profileDropdown').classList.toggle('show');
  }
  
  function signOut() {
    localStorage.clear();
    alert("You have been signed out.");
    window.location.href = "register.html";
  }
  
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
  
  function showToast(message, type) {
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
  
  function openClassTab(tabName) {
  // Deactivate all tab buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Hide all tabs
  document.getElementById('announcementsTab').style.display = 'none';
  document.getElementById('workclassesTab').style.display = 'none';
  document.getElementById('peopleTab').style.display = 'none';

  // Activate selected tab
  document.querySelector(`.tab-button[onclick="openClassTab('${tabName}')"]`).classList.add('active');
  document.getElementById(`${tabName}Tab`).style.display = 'block';

  // ✅ Load tab content if needed
  if (tabName === 'workclasses') {
    loadClassWork(currentClass.code);
  } else if (tabName === 'people') {
    loadClassPeople(currentClass.code);
  }
}
  
  function backToClasses() {
    document.getElementById('classPage').style.display = 'none';
    document.getElementById('classes').style.display = 'block';
  }
  
  function setupEventListeners() {
    // Set up any additional event listeners
    document.getElementById('classCodeInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        joinClass();
      }
    });
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

  // Add these helper functions
  function closeModal() {
  const modal = document.getElementById('joinClassModal');
  const overlay = document.getElementById('modalOverlay');

  if (modal) modal.style.display = 'none';
  if (overlay) overlay.style.display = 'none';
}
  
  function openModal() {
    document.getElementById('joinClassModal').classList.add('show');
    document.getElementById('modalOverlay').classList.add('show');
  }
  
  // Update toggleSidebar function
  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const navbar = document.querySelector('.navbar');
    const content = document.querySelector('.content');
    
    sidebar.classList.toggle('collapsed');
    navbar.classList.toggle('expanded');
    
    if (window.innerWidth <= 768) {
      if (sidebar.classList.contains('collapsed')) {
        sidebar.style.width = '60px';
        content.style.marginLeft = '60px';
      } else {
        sidebar.style.width = '250px';
        content.style.marginLeft = '250px';
      }
    }
  }

  // Add window resize handler
  window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    if (window.innerWidth <= 768) {
      if (sidebar.classList.contains('collapsed')) {
        content.style.marginLeft = '60px';
      } else {
        content.style.marginLeft = '250px';
      }
    } else {
      content.style.marginLeft = '250px';
    }
  });

  
  function loadGrades() {
    const container = document.getElementById('gradesContainer');
    container.innerHTML = '';
  
    if (studentData.enrolledClasses.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <i class="fas fa-clipboard-list"></i>
          <h4>No grades yet</h4>
          <p>Join classes to see your performance</p>
        </div>
      `;
      return;
    }
  
    studentData.enrolledClasses.forEach(cls => {
      const gradeCard = document.createElement('div');
      gradeCard.className = 'grade-card';
  
      // Simulated grade
      const grade = Math.floor(Math.random() * 21) + 80;
  
      gradeCard.innerHTML = `
        <h3>${cls.name}</h3>
        <p><strong>Section:</strong> ${cls.section}</p>
        <p><strong>Professor:</strong> ${cls.professor}</p>
        <p><strong>Grade:</strong> <span class="grade-display">${grade}%</span></p>
      `;
  
      container.appendChild(gradeCard);
    });
  }

  async function showJoinedClasses() {
    const user = JSON.parse(localStorage.getItem("user")); // if stored as object
    const username = user?.USERNAME;

    const response = await fetch(`http://localhost:3000/student-classes?username=${username}`)
    if (!response.ok) {
        throw new Error('Failed to fetch classes');
    }

    const classes = await response.json(); // Parse the JSON response

    const container = document.getElementById('classContainer');

    userClasses = classes;

    updateDashboardCounts();

    if (classes.length === 0) {
        container.innerHTML = '<p class="no-classes">No classes found</p>';
        return;
    }
  }

  async function fetchAnnouncements(classCode = null) {   
    const query = classCode ? `?CLASS_CODE=${encodeURIComponent(classCode)}` : "";
    const response = await fetch(`http://localhost:3000/show-announcements${query}`);
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch announcements: ${errorText}`);
    }
  
    const announcements = await response.json();
  
    return announcements;
  }
  