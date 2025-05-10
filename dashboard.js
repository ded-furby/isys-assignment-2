// Dashboard Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sample mission data if none exists
    initializeSampleMissions();

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Initialize calendar if mission calendar tab is active
            if (tabId === 'mission-calendar') {
                initializeCalendar();
            }
        });
    });

    // Add tracking sidebar button functionality
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(button => {
    button.addEventListener('click', () => {
    const target = button.dataset.target;
    if (target) window.location.href = target;   // or window.open(target, '_blank');
    });
    });

    // Load and display missions from localStorage
    loadMissions();
    
    // Check for conflicts
    checkMissionConflicts();

    // Handle mission filtering
    const filterDropdown = document.getElementById('filter-dropdown');
    filterDropdown.addEventListener('change', () => {
        filterMissions(filterDropdown.value);
    });

    // Handle mission sorting
    const sortDropdown = document.getElementById('sort-dropdown');
    sortDropdown.addEventListener('change', () => {
        sortMissions(sortDropdown.value);
    });

    // Handle "Create Mission" button click
    const createMissionBtn = document.querySelector('.btn-create');
    createMissionBtn.addEventListener('click', () => {
        window.location.href = 'create-mission.html';
    });
    
    // Handle conflict resolution form events
    initConflictResolutionForm();
    
    // Initialize Calendar
    initializeCalendar();
    
    // Mission calendar slide panel events
    initializeCalendarPanel();

    // Force refresh the sample missions and calendar for demo
    forceSampleDataRefresh();

    // Mission filtering function
    function filterMissions(filterValue) {
        const rows = document.querySelectorAll('.mission-table tbody tr');
        
        rows.forEach(row => {
            const statusCell = row.querySelector('td:nth-child(4)');
            const statusText = statusCell.textContent.trim();
            
            if (filterValue === 'all') {
                row.style.display = '';
            } else if (filterValue === 'active' && statusText === 'ACTIVE') {
                row.style.display = '';
            } else if (filterValue === 'pending' && statusText === 'PENDING') {
                row.style.display = '';
            } else if (filterValue === 'completed' && statusText === 'COMPLETED') {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Mission sorting function
    function sortMissions(sortBy) {
        const table = document.querySelector('.mission-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Sort rows based on selected option
        rows.sort((a, b) => {
            let aValue, bValue;
            
            if (sortBy === 'id') {
                aValue = a.cells[0].textContent.trim();
                bValue = b.cells[0].textContent.trim();
                return aValue.localeCompare(bValue, undefined, { numeric: true });
            } else if (sortBy === 'name') {
                aValue = a.cells[1].textContent.trim();
                bValue = b.cells[1].textContent.trim();
                return aValue.localeCompare(bValue);
            } else if (sortBy === 'status') {
                aValue = a.cells[3].textContent.trim();
                bValue = b.cells[3].textContent.trim();
                return aValue.localeCompare(bValue);
            }
            
            return 0;
        });
        
        // Re-append rows in sorted order
        rows.forEach(row => tbody.appendChild(row));
    }

    // Link from login page
    // Check if coming from login page and show an animation
    if (document.referrer.includes('login.html')) {
        document.body.classList.add('from-login');
    }
});

// Force refresh the sample missions and calendar
function forceSampleDataRefresh() {
    // Clear existing missions
    localStorage.removeItem('missions');
    
    // Re-initialize with sample data
    initializeSampleMissions();
    
    // Initialize calendar
    initializeCalendar();
    
    // Activate calendar tab if it's not already active
    const calendarTab = document.querySelector('[data-tab="mission-calendar"]');
    if (calendarTab && !calendarTab.classList.contains('active')) {
        calendarTab.click();
    }
}

// Initialize sample mission data if none exists
function initializeSampleMissions() {
    let missions = JSON.parse(localStorage.getItem('missions')) || [];
    
    // Only add sample data if no missions exist
    if (missions.length === 0) {
        // Get current date for displayed month
        const currentDate = new Date();
        
        // Use current year and month, or can be set to match the calendar view (May 2025)
        const year = 2025; // Using the year from the displayed calendar
        const month = 4;   // 0-based index, so 4 = May
        
        // Generate dates for this month
        const sampleMissions = [
            {
                name: 'Woodland Reconnaissance',
                date: new Date(year, month, 5).toISOString().split('T')[0],
                startTime: '08:00',
                endTime: '12:00',
                units: ['unit1', 'unit3'],
                status: 'ACTIVE',
                routePoints: [
                    { x: 20, y: 30 },
                    { x: 35, y: 45 },
                    { x: 50, y: 40 }
                ]
            },
            {
                name: 'Mountain Patrol',
                date: new Date(year, month, 8).toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '14:00',
                units: ['unit2', 'unit5'],
                status: 'ACTIVE',
                routePoints: [
                    { x: 60, y: 20 },
                    { x: 75, y: 30 },
                    { x: 80, y: 50 }
                ]
            },
            {
                name: 'Desert Exploration',
                date: new Date(year, month, 12).toISOString().split('T')[0],
                startTime: '07:30',
                endTime: '11:30',
                units: ['unit4'],
                status: 'PENDING',
                routePoints: [
                    { x: 30, y: 60 },
                    { x: 45, y: 70 },
                    { x: 60, y: 65 }
                ]
            },
        
            
            {
                name: 'Swamp Surveillance',
                date: new Date(year, month, 23).toISOString().split('T')[0],
                startTime: '06:00',
                endTime: '14:00',
                units: ['unit1', 'unit6'],
                status: 'ACTIVE',
                routePoints: [
                    { x: 35, y: 15 },
                    { x: 45, y: 25 },
                    { x: 55, y: 20 }
                ]
            },
            {
                name: 'Cave Investigation',
                date: new Date(year, month, 27).toISOString().split('T')[0],
                startTime: '10:00',
                endTime: '15:00',
                units: ['unit3', 'unit5'],
                status: 'COMPLETED',
                routePoints: [
                    { x: 75, y: 65 },
                    { x: 85, y: 75 },
                    { x: 90, y: 85 }
                ]
            },
            {
                name: 'Night Reconnaissance',
                date: new Date(year, month, 9).toISOString().split('T')[0],
                startTime: '22:00',
                endTime: '02:00',
                units: ['unit2', 'unit4'],
                status: 'ACTIVE',
                routePoints: [
                    { x: 30, y: 40 },
                    { x: 45, y: 50 },
                    { x: 60, y: 45 }
                ]
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('missions', JSON.stringify(sampleMissions));
    }
}

// Load missions from localStorage
function loadMissions() {
    const missionTableBody = document.getElementById('mission-table-body');
    if (!missionTableBody) return;
    
    // Clear existing rows
    missionTableBody.innerHTML = '';
    
    // Get missions from localStorage
    let missions = JSON.parse(localStorage.getItem('missions')) || [];
    
    if (missions.length === 0) {
        // Add empty state message if no missions
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-state';
        emptyRow.innerHTML = `
            <td colspan="5" class="empty-message">
                No missions available. Click "CREATE MISSION" to add one.
            </td>
        `;
        missionTableBody.appendChild(emptyRow);
        return;
    }
    
    // Add missions to table
    missions.forEach((mission, index) => {
        const missionId = `#${1138 + index}`;
        const row = document.createElement('tr');
        row.setAttribute('data-mission-id', missionId);
        
        // If this mission has route points, store them as a data attribute
        if (mission.routePoints && mission.routePoints.length > 0) {
            row.setAttribute('data-route', JSON.stringify(mission.routePoints));
        }
        
        const unitsText = mission.units
            .map(unit => unit.replace('unit', 'Unit'))
            .join(', ');
            
        const status = mission.status || 'ACTIVE'; // Default to ACTIVE if not specified
        
        row.innerHTML = `
            <td>${missionId}</td>
            <td>${mission.name}</td>
            <td>${unitsText}</td>
            <td><span class="status-${status.toLowerCase()}">${status}</span></td>
            <td class="actions-cell">
                <button class="btn-action">View/Edit</button>
                <button class="btn-track" data-mission-id="${index}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </td>
        `;
        
        missionTableBody.appendChild(row);
    });
    
    // Attach action button event listeners
    attachActionButtonListeners();
    
    // Attach tracking button event listeners
    attachTrackingButtonListeners();
}

// Initialize Mission Calendar
function initializeCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    // Clear existing calendar days
    calendarDays.innerHTML = '';
    
    // Get displayed date - set to May 2025 to match the screenshot
    const displayDate = new Date(2025, 4, 1); // May 2025
    const currentMonth = displayDate.getMonth();
    const currentYear = displayDate.getFullYear();
    
    // Update month title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthElement = document.querySelector('.current-month');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create calendar grid
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Get missions from localStorage
    const missions = JSON.parse(localStorage.getItem('missions')) || [];
    
    // Create map of missions by date
    const missionsByDate = {};
    missions.forEach((mission, index) => {
        if (!mission.date) return;
        
        const missionDate = new Date(mission.date);
        
        // Skip if not in displayed month
        if (missionDate.getMonth() !== currentMonth || missionDate.getFullYear() !== currentYear) {
            return;
        }
        
        const dateKey = missionDate.getDate();
        
        if (!missionsByDate[dateKey]) {
            missionsByDate[dateKey] = [];
        }
        
        // Force mission type if not detected correctly
        let missionType = 'recon'; // Default type
        if (mission.name) {
            const name = mission.name.toLowerCase();
            if (name.includes('combat') || name.includes('patrol')) {
                missionType = 'combat';
            } else if (name.includes('supply') || name.includes('resource')) {
                missionType = 'supply';
            } else if (name.includes('training') || name.includes('admin')) {
                missionType = 'training';
            }
        }
        
        missionsByDate[dateKey].push({
            id: `#${1138 + index}`,
            name: mission.name,
            type: missionType,
            startTime: mission.startTime || '09:00',
            endTime: mission.endTime || '12:00',
            units: mission.units || []
        });
    });
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        
        // Highlight current day
        if (day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
            dayElement.classList.add('current-day');
        }
        
        // Add mission dots if there are missions on this day
        if (missionsByDate[day]) {
            const missions = missionsByDate[day];
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'mission-dots';
            
            // Add up to 3 dots to indicate mission types
            const missionTypes = [...new Set(missions.map(m => m.type))];
            missionTypes.slice(0, 3).forEach((type, index) => {
                const dot = document.createElement('span');
                dot.className = `mission-dot ${type}`;
                dot.setAttribute('data-mission-type', type);
                dot.setAttribute('data-date', day);
                
                // Add tooltip with mission count of this type
                const typeCount = missions.filter(m => m.type === type).length;
                dot.setAttribute('title', `${typeCount} ${type} mission${typeCount > 1 ? 's' : ''}`);
                
                // Add click event to show missions of this type for this day
                dot.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent day click event
                    const missionType = dot.getAttribute('data-mission-type');
                    const missionsOfType = missions.filter(m => m.type === missionType);
                    showMissionsForDate(day, missionsOfType);
                });
                
                dotsContainer.appendChild(dot);
            });
            
            // Store mission data for this date
            dayElement.setAttribute('data-missions', JSON.stringify(missions));
            
            // Add dots container to day
            dayElement.appendChild(dotsContainer);
            
            // Add click event to show all missions for this day
            dayElement.addEventListener('click', () => {
                showMissionsForDate(day, missionsByDate[day]);
            });
        }
        
        calendarDays.appendChild(dayElement);
    }
    
    // Add navigation event listeners
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            // In a real app, you would implement month navigation
            alert('Previous month navigation would be implemented here');
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            // In a real app, you would implement month navigation
            alert('Next month navigation would be implemented here');
        });
    }
}

// Initialize calendar slide panel functionality
function initializeCalendarPanel() {
    const panel = document.getElementById('mission-details-panel');
    const closeBtn = document.querySelector('.close-panel');
    const calendarContainer = document.querySelector('.calendar-container');
    
    if (!panel || !closeBtn) return;
    
    // Close panel when close button is clicked
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
        calendarContainer.classList.remove('panel-open');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (panel.classList.contains('open') && 
            !panel.contains(e.target) && 
            !e.target.classList.contains('day') &&
            !e.target.classList.contains('mission-dot')) {
            panel.classList.remove('open');
            calendarContainer.classList.remove('panel-open');
        }
    });
}

// Show missions for a specific date in the slide panel
function showMissionsForDate(day, missions) {
    const panel = document.getElementById('mission-details-panel');
    const dateTitle = document.getElementById('panel-date-title');
    const missionsList = document.getElementById('date-missions-list');
    const calendarContainer = document.querySelector('.calendar-container');
    
    if (!panel || !dateTitle || !missionsList) return;
    
    // Format the date
    const currentDate = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    dateTitle.textContent = `Missions on ${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`;
    
    // Clear existing missions
    missionsList.innerHTML = '';
    
    // Add missions to the list
    if (missions && missions.length > 0) {
        // Create missions table
        const table = document.createElement('table');
        table.className = 'missions-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Time</th>
                <th>Units</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Add mission rows
        missions.forEach(mission => {
            const row = document.createElement('tr');
            row.className = `mission-row ${mission.type}`;
            
            // Format units text
            const unitsText = mission.units
                .map(unit => unit.replace('unit', 'Unit'))
                .join(', ');
            
            row.innerHTML = `
                <td>${mission.name}</td>
                <td>${mission.startTime} - ${mission.endTime}</td>
                <td>${unitsText}</td>
                <td>
                    <button class="view-mission" data-id="${mission.id}">View</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        missionsList.appendChild(table);
        
        // Add event listeners to view buttons
        const viewButtons = missionsList.querySelectorAll('.view-mission');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const missionId = button.getAttribute('data-id');
                showMissionDetails(missionId, missions);
            });
        });
    } else {
        // Show no missions message
        const noMissions = document.createElement('div');
        noMissions.className = 'no-missions';
        noMissions.textContent = 'No missions scheduled for this date.';
        missionsList.appendChild(noMissions);
    }
    
    // Open the panel with smooth transition
    panel.classList.add('open');
    calendarContainer.classList.add('panel-open');
}

// Function to show detailed info for a specific mission
function showMissionDetails(missionId, missions) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    
    // Get the panel content
    const missionsList = document.getElementById('date-missions-list');
    if (!missionsList) return;
    
    // Save current content
    const originalContent = missionsList.innerHTML;
    
    // Create detailed view
    const details = document.createElement('div');
    details.className = 'mission-details';
    
    // Format units for display
    const unitsText = mission.units.map(unit => unit.replace('unit', 'Unit')).join(', ');
    
    // Create the details HTML
    details.innerHTML = `
        <h3 class="mission-detail-title">${mission.name}</h3>
        <div class="mission-id">${mission.id}</div>
        
        <div class="detail-section">
            <div class="detail-row"><span class="detail-label">Time:</span> ${mission.startTime} - ${mission.endTime}</div>
            <div class="detail-row"><span class="detail-label">Units:</span> ${unitsText}</div>
            <div class="detail-row"><span class="detail-label">Type:</span> ${mission.type.charAt(0).toUpperCase() + mission.type.slice(1)}</div>
            <div class="detail-row"><span class="detail-label">Status:</span> Active</div>
        </div>
        
        <button class="btn-back">Back to Missions List</button>
    `;
    
    // Clear and replace content
    missionsList.innerHTML = '';
    missionsList.appendChild(details);
    
    // Add back button event listener
    const backButton = missionsList.querySelector('.btn-back');
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Restore original content
            missionsList.innerHTML = originalContent;
            
            // Re-attach view button event listeners
            const viewButtons = missionsList.querySelectorAll('.view-mission');
            viewButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    showMissionDetails(id, missions);
                });
            });
        });
    }
}

// Check for mission conflicts
function checkMissionConflicts() {
    const missions = JSON.parse(localStorage.getItem('missions')) || [];
    const conflicts = [];
    
    // Find missions with the same units assigned
    for (let i = 0; i < missions.length; i++) {
        const mission1 = missions[i];
        if (!mission1.units || mission1.units.length === 0) continue;
        
        for (let j = i + 1; j < missions.length; j++) {
            const mission2 = missions[j];
            if (!mission2.units || mission2.units.length === 0) continue;
            
            // Check for overlapping units
            const overlappingUnits = mission1.units.filter(unit => mission2.units.includes(unit));
            
            if (overlappingUnits.length > 0) {
                conflicts.push({
                    mission1Index: i,
                    mission2Index: j,
                    mission1: mission1,
                    mission2: mission2,
                    overlappingUnits: overlappingUnits
                });
            }
        }
    }
    
    // Update the conflict counter badge
    const conflictCounter = document.getElementById('conflict-counter');
    if (conflictCounter) {
        conflictCounter.textContent = conflicts.length.toString();
        
        // Store conflicts in sessionStorage for use in the conflict resolution tab
        sessionStorage.setItem('missionConflicts', JSON.stringify(conflicts));
    }
    
    return conflicts;
}

// Initialize conflict resolution form event handlers
function initConflictResolutionForm() {
    // Reschedule button
    const rescheduleBtn = document.querySelector('.btn-reschedule');
    if (rescheduleBtn) {
        rescheduleBtn.addEventListener('click', () => {
            alert('Rescheduling functionality would open a date/time picker');
        });
    }
    
    // Swap unit button
    const swapUnitBtn = document.querySelector('.btn-swap-unit');
    if (swapUnitBtn) {
        swapUnitBtn.addEventListener('click', () => {
            alert('Swap unit functionality would open a unit selection dropdown');
        });
    }
    
    // Confirm changes button
    const confirmBtn = document.querySelector('.btn-confirm-changes');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            alert('Changes would be saved and conflict resolved');
            // After saving changes, refresh the conflict list
            checkMissionConflicts();
        });
    }
    
    // Cancel button
    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            // Switch back to active missions tab
            const activeTab = document.querySelector('[data-tab="active-missions"]');
            if (activeTab) {
                activeTab.click();
            }
        });
    }
    
    // New mission form submit
    const newMissionForm = document.querySelector('.new-mission-form');
    if (newMissionForm) {
        newMissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const missionType = document.getElementById('mission-type').value;
            const missionDate = document.getElementById('mission-date').value;
            const startTime = document.getElementById('mission-start-time').value;
            const endTime = document.getElementById('mission-end-time').value;
            const missionRoute = document.getElementById('mission-route').value;
            
            // Get selected units
            const selectedUnits = [];
            document.querySelectorAll('.unit-checkbox input:checked').forEach(checkbox => {
                selectedUnits.push(checkbox.value);
            });
            
            if (!missionType || !missionDate || !startTime || !endTime || selectedUnits.length === 0) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Create new mission object
            const newMission = {
                name: `${missionType.charAt(0).toUpperCase() + missionType.slice(1)} Mission`,
                date: missionDate,
                startTime: startTime,
                endTime: endTime,
                route: missionRoute,
                units: selectedUnits,
                status: 'PENDING',
                routePoints: [] // Would typically be generated based on the route
            };
            
            // Get existing missions
            const missions = JSON.parse(localStorage.getItem('missions')) || [];
            
            // Add new mission
            missions.push(newMission);
            
            // Save to localStorage
            localStorage.setItem('missions', JSON.stringify(missions));
            
            // Refresh the mission list and conflict checker
            loadMissions();
            checkMissionConflicts();
            
            // Clear the form
            newMissionForm.reset();
            
            alert('New mission created successfully');
        });
    }
}

// Attach event listeners to action buttons
function attachActionButtonListeners() {
    const actionButtons = document.querySelectorAll('.btn-action');
    
    // Create route preview element if it doesn't exist
    let routePreview = document.getElementById('route-preview');
    if (!routePreview) {
        routePreview = document.createElement('div');
        routePreview.id = 'route-preview';
        routePreview.className = 'route-preview action-preview';
        document.body.appendChild(routePreview);
    }
    
    // Track which preview is currently active
    let activeButton = null;
    let isPreviewVisible = false;
    
    actionButtons.forEach(button => {
        // Get the route data from the parent row
        const row = button.closest('tr');
        const routeData = row.getAttribute('data-route');
        const missionId = row.getAttribute('data-mission-id');
        
        // Add click handler for navigation
        button.addEventListener('click', () => {
            // In a real app, you would navigate to the edit page
            alert(`Editing mission ${missionId}`);
        });
        
        // Only add hover effect if the mission has route data
        if (routeData) {
            const routePoints = JSON.parse(routeData);
            
            // Add mouseenter event to show preview
            button.addEventListener('mouseenter', (e) => {
                // Set this button as the active one
                activeButton = button;
                
                // Show route preview
                showRoutePreview(routePoints, routePreview, e, true);
                isPreviewVisible = true;
                
                // Add event listener to the document to check mouse position
                document.addEventListener('mousemove', checkMousePosition);
            });
        }
    });
    
    // Function to check if mouse is over button or preview
    function checkMousePosition(e) {
        if (!isPreviewVisible || !activeButton) return;
        
        const buttonRect = activeButton.getBoundingClientRect();
        const previewRect = routePreview.getBoundingClientRect();
        
        const isOverButton = (
            e.clientX >= buttonRect.left && 
            e.clientX <= buttonRect.right && 
            e.clientY >= buttonRect.top && 
            e.clientY <= buttonRect.bottom
        );
        
        const isOverPreview = (
            e.clientX >= previewRect.left && 
            e.clientX <= previewRect.right && 
            e.clientY >= previewRect.top && 
            e.clientY <= previewRect.bottom
        );
        
        // Hide the preview if mouse is neither over button nor preview
        if (!isOverButton && !isOverPreview) {
            routePreview.style.display = 'none';
            isPreviewVisible = false;
            activeButton = null;
            document.removeEventListener('mousemove', checkMousePosition);
        }
    }
}

// Attach event listeners to tracking buttons
function attachTrackingButtonListeners() {
    const trackingButtons = document.querySelectorAll('.btn-track');
    
    trackingButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the mission ID from the data attribute
            const missionId = button.getAttribute('data-mission-id');
            
            // Navigate to the tracking page with the mission ID as a parameter
            window.location.href = `tracking.html?mission=${missionId}`;
        });
    });
}

// Add route preview popup on hover for rows
function addRoutePreviewToMissions() {
    const missionRows = document.querySelectorAll('.mission-table tbody tr:not(.empty-state)');
    
    // Create route preview element if it doesn't exist
    let routePreview = document.getElementById('row-preview');
    if (!routePreview) {
        routePreview = document.createElement('div');
        routePreview.id = 'row-preview';
        routePreview.className = 'route-preview';
        document.body.appendChild(routePreview);
    }
    
    missionRows.forEach(row => {
        // Only add hover effect if the mission has route data
        const routeData = row.getAttribute('data-route');
        if (!routeData) return;
        
        // Parse the route data
        const routePoints = JSON.parse(routeData);
        
        // Add hover event to show preview
        row.addEventListener('mouseenter', (e) => {
            showRoutePreview(routePoints, routePreview, e, false);
        });
        
        // Add mouseleave event to hide preview
        row.addEventListener('mouseleave', () => {
            routePreview.style.display = 'none';
        });
    });
}

// Show route preview
function showRoutePreview(points, previewElement, event, isActionButton) {
    // Clear previous content
    previewElement.innerHTML = '';
    
    // Create preview map
    const previewMap = document.createElement('div');
    previewMap.className = 'preview-map';
    
    // Calculate position for popup placement
    if (isActionButton) {
        // Position to the left of the button
        const buttonRect = event.currentTarget.getBoundingClientRect();
        
        // Calculate centering for vertical positioning
        const previewHeight = 200; // Match height in CSS
        const topPosition = buttonRect.top - (previewHeight / 2) + (buttonRect.height / 2);
        
        // Ensure it stays within the viewport
        const adjustedTop = Math.max(10, Math.min(topPosition, window.innerHeight - previewHeight - 10));
        
        previewElement.style.top = `${adjustedTop}px`;
        previewElement.style.left = `${buttonRect.left - 330}px`; // Wider, so position further left
        
        // Add mission ID to the preview
        const missionIdElement = document.createElement('div');
        missionIdElement.className = 'preview-title';
        const missionId = event.currentTarget.closest('tr').getAttribute('data-mission-id');
        missionIdElement.textContent = `Route for ${missionId}`;
        previewElement.appendChild(missionIdElement);
    } else {
        // Position for row hover
        const rect = event.currentTarget.getBoundingClientRect();
        previewElement.style.top = `${rect.top - 10}px`;
        previewElement.style.left = `${rect.right + 10}px`;
    }
    
    // Add grid lines
    const grid = document.createElement('div');
    grid.className = 'preview-grid';
    for (let i = 1; i <= 3; i++) {
        const hLine = document.createElement('div');
        hLine.className = 'preview-grid-line horizontal';
        hLine.style.top = `${i * 25}%`;
        grid.appendChild(hLine);
        
        const vLine = document.createElement('div');
        vLine.className = 'preview-grid-line vertical';
        vLine.style.left = `${i * 25}%`;
        grid.appendChild(vLine);
    }
    previewMap.appendChild(grid);
    
    // Add route points and lines
    const routePointsContainer = document.createElement('div');
    routePointsContainer.className = 'preview-route-points';
    
    // Add points with numbers
    points.forEach((point, index) => {
        const pointElement = document.createElement('div');
        pointElement.className = 'preview-point';
        pointElement.style.left = `${point.x}%`;
        pointElement.style.top = `${point.y}%`;
        pointElement.textContent = index + 1; // Show point number
        routePointsContainer.appendChild(pointElement);
        
        // Add line connecting to previous point
        if (index > 0) {
            const prevPoint = points[index - 1];
            
            // Create a straight line between points
            const lineElement = document.createElement('div');
            lineElement.className = 'preview-line';
            
            // Calculate line position and length
            const x1 = prevPoint.x;
            const y1 = prevPoint.y;
            const x2 = point.x;
            const y2 = point.y;
            
            // Calculate distance
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            
            // Calculate angle
            const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            
            lineElement.style.width = `${length}%`;
            lineElement.style.left = `${x1}%`;
            lineElement.style.top = `${y1}%`;
            lineElement.style.transform = `rotate(${angle}deg)`;
            
            routePointsContainer.appendChild(lineElement);
        }
    });
    
    previewMap.appendChild(routePointsContainer);
    previewElement.appendChild(previewMap);
    
    // Show the preview
    previewElement.style.display = 'block';
} 