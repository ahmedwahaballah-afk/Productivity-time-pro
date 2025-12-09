// ============================================
// INITIALIZATION AND DATA
// ============================================

// DOM Elements
const pageTitle = document.getElementById('pageTitle');
const currentDate = document.getElementById('currentDate');
const mobileDate = document.getElementById('mobileDate');
const navItems = document.querySelectorAll('.nav-item');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const userAvatar = document.getElementById('userAvatar');
const displayUsername = document.getElementById('displayUsername');
const clearDataBtn = document.getElementById('clearDataBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');

// Dashboard counters
const todayTasksCount = document.getElementById('todayTasksCount');
const completedTasksCount = document.getElementById('completedTasksCount');
const activeProjectsCount = document.getElementById('activeProjectsCount');
const productivityScore = document.getElementById('productivityScore');

// Calendar elements
const calendarGrid = document.getElementById('calendarGrid');
const calendarMonth = document.getElementById('calendarMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const todayBtn = document.getElementById('todayBtn');

// To-Do elements
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const todoList = document.getElementById('todoList');
const dashboardTodoList = document.getElementById('dashboardTodoList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Project elements
const projectsGrid = document.getElementById('projectsGrid');
const newProjectInput = document.getElementById('newProjectInput');
const addProjectBtn = document.getElementById('addProjectBtn');

// Timer elements
const timerDisplay = document.getElementById('timerDisplay');
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const sessionCount = document.getElementById('sessionCount');
const motivationQuote = document.getElementById('motivationQuote');
const motivationAuthor = document.getElementById('motivationAuthor');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const timerPresets = document.querySelectorAll('.timer-preset');

// App State
let currentTab = 'dashboard';
let currentCalendarDate = new Date();
let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;
let sessionsCompleted = 0;
let currentFilter = 'all';

// Sample data for initial setup
const sampleTasks = [
    { id: 1, text: 'Complete project proposal', completed: false, priority: true },
    { id: 2, text: 'Schedule team meeting', completed: true, priority: false },
    { id: 3, text: 'Review quarterly reports', completed: false, priority: true },
    { id: 4, text: 'Prepare presentation slides', completed: false, priority: true },
    { id: 5, text: 'Update project documentation', completed: false, priority: false }
];

const sampleProjects = [
    {
        id: 1,
        title: 'Website Redesign',
        description: 'Complete redesign of company website with modern UI/UX',
        status: 'active',
        files: ['design-mockup.pdf', 'content-plan.docx']
    },
    {
        id: 2,
        title: 'Marketing Campaign',
        description: 'Q4 social media marketing campaign planning and execution',
        status: 'active',
        files: ['campaign-budget.xlsx']
    },
    {
        id: 3,
        title: 'Product Launch',
        description: 'Launch of new productivity software',
        status: 'completed',
        files: ['launch-plan.pdf', 'press-release.docx']
    }
];

const motivationQuotes = [
    { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.", author: "Paul J. Meyer" }
];

// ============================================
// INITIALIZATION FUNCTION
// ============================================

function initApp() {
    updateCurrentDate();
    initCalendar();
    loadTodoList();
    loadProjects();
    loadMotivationQuote();
    updateDashboardCounters();
    setupEventListeners();
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================

function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            closeMobileSidebar();
        });
    });
    
    // Mobile navigation
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            
            // Update active state
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Mobile menu button
    mobileMenuBtn.addEventListener('click', toggleMobileSidebar);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && sidebar.classList.contains('show')) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileSidebar();
            }
        }
    });
    
    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    todayBtn.addEventListener('click', goToToday);
    
    // To-Do list
    addTaskBtn.addEventListener('click', addNewTask);
    newTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNewTask();
    });
    
    // Todo filters
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setFilter(filter);
        });
    });
    
    // Projects
    addProjectBtn.addEventListener('click', addNewProject);
    newProjectInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNewProject();
    });
    
    // Timer
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    newQuoteBtn.addEventListener('click', loadMotivationQuote);
    
    // Timer presets
    timerPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-minutes'));
            setTimer(minutes);
        });
    });
    
    // Clear data button
    clearDataBtn.addEventListener('click', clearAllData);
    
    // Touch gestures for mobile
    setupTouchGestures();
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
}

// ============================================
// MOBILE FUNCTIONS
// ============================================

function toggleMobileSidebar() {
    sidebar.classList.toggle('show');
    
    // Add overlay when sidebar is open
    if (sidebar.classList.contains('show')) {
        createOverlay();
    } else {
        removeOverlay();
    }
}

function closeMobileSidebar() {
    sidebar.classList.remove('show');
    removeOverlay();
}

function createOverlay() {
    if (!document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 70px;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            display: block;
        `;
        overlay.addEventListener('click', closeMobileSidebar);
        document.body.appendChild(overlay);
    }
}

function removeOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function handleResize() {
    if (window.innerWidth > 768) {
        closeMobileSidebar();
        removeOverlay();
    }
    updateCurrentDate();
}

// ============================================
// TAB MANAGEMENT FUNCTIONS
// ============================================

function switchTab(tabName) {
    // Update desktop navigation
    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update tab content
    tabContents.forEach(content => {
        if (content.id === tabName) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Update page title
    const tabTitles = {
        dashboard: 'Dashboard',
        calendar: 'Calendar',
        todo: 'To-Do List',
        projects: 'Project Manager',
        procrastination: 'Fight Procrastination'
    };
    
    pageTitle.textContent = tabTitles[tabName] || 'Dashboard';
    currentTab = tabName;
    
    // Refresh calendar if on calendar tab
    if (tabName === 'calendar') {
        renderCalendar();
    }
    
    // Refresh dashboard todo list
    if (tabName === 'dashboard') {
        updateDashboardTodoList();
    }
    
    // Scroll to top on mobile
    if (window.innerWidth <= 768) {
        window.scrollTo(0, 0);
    }
}

// ============================================
// DATE AND TIME FUNCTIONS
// ============================================

function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const shortOptions = { month: 'short', day: 'numeric' };
    
    currentDate.textContent = now.toLocaleDateString('en-US', options);
    mobileDate.textContent = now.toLocaleDateString('en-US', shortOptions);
}

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

function updateDashboardCounters() {
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || sampleTasks;
    
    // Get projects from localStorage
    let projects = JSON.parse(localStorage.getItem('projects')) || sampleProjects;
    
    // Calculate counts
    const todayTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeProjects = projects.filter(project => project.status === 'active').length;
    
    // Calculate productivity score (simple formula)
    const totalTasks = tasks.length;
    const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update DOM
    todayTasksCount.textContent = todayTasks;
    completedTasksCount.textContent = completedTasks;
    activeProjectsCount.textContent = activeProjects;
    productivityScore.textContent = `${score}%`;
}

// ============================================
// CALENDAR FUNCTIONS
// ============================================

function initCalendar() {
    renderCalendar();
}

function renderCalendar() {
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Set month title
    const monthYear = currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    calendarMonth.textContent = monthYear;
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and total days
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    
    // Get today's date for comparison
    const today = new Date();
    const isToday = (day) => {
        return day === today.getDate() && 
               month === today.getMonth() && 
               year === today.getFullYear();
    };
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (isToday(day)) {
            dayElement.classList.add('today');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add sample events (in a real app, these would come from data)
        if (day === 10 || day === 15 || day === 22) {
            const event = document.createElement('div');
            event.className = 'calendar-event';
            event.textContent = day === 10 ? 'Team Meeting' : day === 15 ? 'Project Deadline' : 'Doctor Appointment';
            dayElement.appendChild(event);
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function changeMonth(offset) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
    renderCalendar();
}

function goToToday() {
    currentCalendarDate = new Date();
    renderCalendar();
}

// ============================================
// TO-DO LIST FUNCTIONS
// ============================================

function loadTodoList() {
    // Clear the list
    todoList.innerHTML = '';
    dashboardTodoList.innerHTML = '';
    
    // Load tasks from localStorage or use sample data
    let tasks = JSON.parse(localStorage.getItem('tasks')) || sampleTasks;
    
    // Filter tasks based on current filter
    let filteredTasks = filterTasks(tasks);
    
    // Add tasks to the main todo list
    filteredTasks.forEach(task => {
        addTaskToDOM(task, todoList);
    });
    
    // Update dashboard with priority tasks
    updateDashboardTodoList();
}

function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterButtons.forEach(button => {
        if (button.getAttribute('data-filter') === filter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Reload todo list with new filter
    loadTodoList();
}

function filterTasks(tasks) {
    switch(currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'priority':
            return tasks.filter(task => task.priority);
        default:
            return tasks;
    }
}

function addNewTask() {
    const taskText = newTaskInput.value.trim();
    
    if (!taskText) {
        alert('Please enter a task');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: false
    };
    
    // Add to DOM
    addTaskToDOM(newTask, todoList);
    
    // Save to localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || sampleTasks;
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Clear input
    newTaskInput.value = '';
    
    // Update dashboard
    updateDashboardTodoList();
    updateDashboardCounters();
    
    // Focus back to input on mobile
    if (window.innerWidth <= 768) {
        newTaskInput.focus();
    }
}

function addTaskToDOM(task, listElement) {
    const taskItem = document.createElement('li');
    taskItem.className = `todo-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    taskItem.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="todo-text">${task.text}</div>
        <div class="todo-actions">
            <button class="priority-btn" title="${task.priority ? 'Remove priority' : 'Mark as priority'}">
                <i class="fas fa-star"></i>
            </button>
            <button class="delete-btn" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const checkbox = taskItem.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', function() {
        taskItem.classList.toggle('completed');
        updateTaskStatus(task.id, this.checked);
    });
    
    const priorityBtn = taskItem.querySelector('.priority-btn');
    priorityBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        task.priority = !task.priority;
        icon.style.color = task.priority ? 'var(--warning)' : 'var(--gray)';
        updateTaskPriority(task.id, task.priority);
    });
    
    // Set initial priority color
    const priorityIcon = priorityBtn.querySelector('i');
    priorityIcon.style.color = task.priority ? 'var(--warning)' : 'var(--gray)';
    
    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        deleteTask(task.id);
        taskItem.remove();
    });
    
    // Add touch support for mobile
    if (window.innerWidth <= 768) {
        taskItem.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        });
        
        taskItem.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        });
    }
    
    listElement.appendChild(taskItem);
}

function updateTaskStatus(taskId, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || sampleTasks;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    updateDashboardTodoList();
    updateDashboardCounters();
}

function updateTaskPriority(taskId, priority) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || sampleTasks;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].priority = priority;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    updateDashboardTodoList();
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || sampleTasks;
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    updateDashboardTodoList();
    updateDashboardCounters();
}

function updateDashboardTodoList() {
    // Clear dashboard list
    dashboardTodoList.innerHTML = '';
    
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || sampleTasks;
    
    // Filter for priority tasks
    const priorityTasks = tasks.filter(task => task.priority && !task.completed).slice(0, 5);
    
    // If no priority tasks, show some regular tasks
    if (priorityTasks.length === 0) {
        const regularTasks = tasks.filter(task => !task.completed).slice(0, 3);
        regularTasks.forEach(task => {
            addTaskToDOM(task, dashboardTodoList);
        });
    } else {
        // Add priority tasks to dashboard
        priorityTasks.forEach(task => {
            addTaskToDOM(task, dashboardTodoList);
        });
    }
}

// ============================================
// PROJECT MANAGEMENT FUNCTIONS
// ============================================

function loadProjects() {
    // Clear projects grid
    projectsGrid.innerHTML = '';
    
    // Load projects from localStorage or use sample data
    let projects = JSON.parse(localStorage.getItem('projects')) || sampleProjects;
    
    // Add projects to DOM
    projects.forEach(project => {
        addProjectToDOM(project);
    });
    
    updateDashboardCounters();
}

function addNewProject() {
    const projectName = newProjectInput.value.trim();
    
    if (!projectName) {
        alert('Please enter a project name');
        return;
    }
    
    const newProject = {
        id: Date.now(),
        title: projectName,
        description: 'New project description. Click to edit.',
        status: 'active',
        files: []
    };
    
    // Add to DOM
    addProjectToDOM(newProject);
    
    // Save to localStorage
    let projects = JSON.parse(localStorage.getItem('projects')) || sampleProjects;
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    // Clear input
    newProjectInput.value = '';
    
    updateDashboardCounters();
}

function addProjectToDOM(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.dataset.id = project.id;
    
    // Create file items HTML
    let filesHTML = '';
    project.files.forEach(file => {
        const fileExtension = file.split('.').pop();
        let fileIcon = 'fa-file';
        
        if (['pdf'].includes(fileExtension)) fileIcon = 'fa-file-pdf';
        else if (['doc', 'docx'].includes(fileExtension)) fileIcon = 'fa-file-word';
        else if (['xls', 'xlsx'].includes(fileExtension)) fileIcon = 'fa-file-excel';
        else if (['jpg', 'png', 'gif'].includes(fileExtension)) fileIcon = 'fa-file-image';
        
        filesHTML += `
            <div class="file-item">
                <i class="fas ${fileIcon}"></i>
                <span>${file}</span>
            </div>
        `;
    });
    
    projectCard.innerHTML = `
        <div class="project-header">
            <div class="project-title">${project.title}</div>
            <div class="project-status ${project.status}">${project.status}</div>
        </div>
        <div class="project-description">${project.description}</div>
        
        <div class="project-files">
            ${filesHTML || '<p>No files attached</p>'}
        </div>
        
        <div class="file-upload">
            <input type="file" class="file-input" multiple>
            <p><i class="fas fa-cloud-upload-alt"></i> Click to upload files</p>
        </div>
    `;
    
    // Add file upload functionality
    const fileUpload = projectCard.querySelector('.file-upload');
    const fileInput = projectCard.querySelector('.file-input');
    
    fileUpload.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            // Add files to the project
            for (let i = 0; i < this.files.length; i++) {
                const fileName = this.files[i].name;
                
                // Add to project files array
                let projects = JSON.parse(localStorage.getItem('projects')) || sampleProjects;
                const projectIndex = projects.findIndex(p => p.id === project.id);
                
                if (projectIndex !== -1) {
                    projects[projectIndex].files.push(fileName);
                    localStorage.setItem('projects', JSON.stringify(projects));
                }
                
                // Add to DOM
                const fileExtension = fileName.split('.').pop();
                let fileIcon = 'fa-file';
                
                if (['pdf'].includes(fileExtension)) fileIcon = 'fa-file-pdf';
                else if (['doc', 'docx'].includes(fileExtension)) fileIcon = 'fa-file-word';
                else if (['xls', 'xlsx'].includes(fileExtension)) fileIcon = 'fa-file-excel';
                else if (['jpg', 'png', 'gif'].includes(fileExtension)) fileIcon = 'fa-file-image';
                
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <i class="fas ${fileIcon}"></i>
                    <span>${fileName}</span>
                `;
                
                projectCard.querySelector('.project-files').appendChild(fileItem);
            }
            
            alert(`${this.files.length} file(s) added to project "${project.title}"`);
            this.value = '';
        }
    });
    
    // Make project title and description editable
    const projectTitle = projectCard.querySelector('.project-title');
    const projectDescription = projectCard.querySelector('.project-description');
    const projectStatus = projectCard.querySelector('.project-status');
    
    projectTitle.addEventListener('dblclick', function() {
        const currentText = this.textContent;
        this.innerHTML = `<input type="text" value="${currentText}" class="edit-input">`;
        const input = this.querySelector('.edit-input');
        input.focus();
        
        input.addEventListener('blur', function() {
            const newText = this.value.trim();
            projectTitle.textContent = newText || currentText;
            
            // Update in localStorage
            let projects = JSON.parse(localStorage.getItem('projects')) || sampleProjects;
            const projectIndex = projects.findIndex(p => p.id === project.id);
            if (projectIndex !== -1) {
                projects[projectIndex].title = newText || currentText;
                localStorage.setItem('projects', JSON.stringify(projects));
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });
    });
    
    projectDescription.addEventListener('dblclick', function() {
        const currentText = this.textContent;
        this.innerHTML = `<textarea class="edit-textarea">${currentText}</textarea>`;
        const textarea = this.querySelector('.edit-textarea');
        textarea.focus();
        
        textarea.addEventListener('blur', function() {
            const newText = this.value.trim();
            projectDescription.textContent = newText || currentText;
            
            // Update in localStorage
            let projects = JSON.parse(localStorage.getItem('projects')) || sampleProjects;
            const projectIndex = projects.findIndex(p => p.id === project.id);
            if (projectIndex !== -1) {
                projects[projectIndex].description = newText || currentText;
                localStorage.setItem('projects', JSON.stringify(projects));
            }
        });
        
        textarea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.blur();
            }
        });
    });
    
    // Toggle project status on click
    projectStatus.addEventListener('click', function() {
        const newStatus = this.classList.contains('active') ? 'completed' : 'active';
        this.textContent = newStatus;
        this.className = `project-status ${newStatus}`;
        
        // Update in localStorage
        let projects = JSON.parse(localStorage.getItem('projects')) || sampleProjects;
        const projectIndex = projects.findIndex(p => p.id === project.id);
        if (projectIndex !== -1) {
            projects[projectIndex].status = newStatus;
            localStorage.setItem('projects', JSON.stringify(projects));
        }
        
        updateDashboardCounters();
    });
    
    projectsGrid.appendChild(projectCard);
}

// ============================================
// TIMER AND MOTIVATION FUNCTIONS
// ============================================

function startTimer() {
    if (timerRunning) return;
    
    timerRunning = true;
    startTimerBtn.disabled = true;
    pauseTimerBtn.disabled = false;
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            startTimerBtn.disabled = false;
            pauseTimerBtn.disabled = true;
            
            // Increment session count
            sessionsCompleted++;
            sessionCount.textContent = sessionsCompleted;
            localStorage.setItem('pomodoroSessions', sessionsCompleted);
            
            // Vibrate if available (mobile)
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
            
            alert('Time\'s up! Take a 5-minute break.');
            
            // Reset timer for break (5 minutes)
            timerSeconds = 5 * 60;
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    if (!timerRunning) return;
    
    clearInterval(timerInterval);
    timerRunning = false;
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 25 * 60;
    updateTimerDisplay();
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
}

function setTimer(minutes) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = minutes * 60;
    updateTimerDisplay();
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function loadMotivationQuote() {
    const randomIndex = Math.floor(Math.random() * motivationQuotes.length);
    const randomQuote = motivationQuotes[randomIndex];
    
    motivationQuote.textContent = `"${randomQuote.quote}"`;
    motivationAuthor.textContent = `- ${randomQuote.author}`;
}

// ============================================
// TOUCH GESTURES FOR MOBILE
// ============================================

function setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        // Left swipe (next tab)
        if (Math.abs(diff) > swipeThreshold) {
            const tabs = ['dashboard', 'calendar', 'todo', 'projects', 'procrastination'];
            const currentIndex = tabs.indexOf(currentTab);
            
            if (diff > 0 && currentIndex < tabs.length - 1) {
                // Swipe left - next tab
                switchTab(tabs[currentIndex + 1]);
                updateMobileNav(tabs[currentIndex + 1]);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous tab
                switchTab(tabs[currentIndex - 1]);
                updateMobileNav(tabs[currentIndex - 1]);
            }
        }
    }
}

function updateMobileNav(tab) {
    mobileNavItems.forEach(nav => {
        if (nav.getAttribute('data-tab') === tab) {
            nav.classList.add('active');
        } else {
            nav.classList.remove('active');
        }
    });
}

// ============================================
// DATA MANAGEMENT FUNCTIONS
// ============================================

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This will reset tasks, projects, and timer sessions.')) {
        // Clear localStorage
        localStorage.removeItem('tasks');
        localStorage.removeItem('projects');
        localStorage.removeItem('pomodoroSessions');
        
        // Reset timer
        sessionsCompleted = 0;
        sessionCount.textContent = '0';
        resetTimer();
        
        // Reload the app with sample data
        loadTodoList();
        loadProjects();
        updateDashboardCounters();
        
        alert('All data has been cleared. The app has been reset to initial state.');
    }
}

// ============================================
// INITIALIZE THE APPLICATION
// ============================================

// Load saved session count
const savedSessions = localStorage.getItem('pomodoroSessions');
if (savedSessions) {
    sessionsCompleted = parseInt(savedSessions);
    sessionCount.textContent = sessionsCompleted;
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', initApp);