document.addEventListener('DOMContentLoaded', function() {
    // Settings navigation functionality
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsPanels = document.querySelectorAll('.settings-panel');

    settingsNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items and panels
            settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
            settingsPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked item and corresponding panel
            item.classList.add('active');
            const panelId = item.getAttribute('data-tab');
            document.getElementById(panelId).classList.add('active');
        });
    });
     document.querySelector('.sidebar-nav').addEventListener('click', function(e) {
        if (e.target.classList.contains('units-nav')) {
            window.location.href = 'units.html';
        } else if (e.target.classList.contains('tracking-nav')) {
            window.location.href = 'tracking.html';
        } else if (e.target.classList.contains('comms-nav')) {
            window.location.href = 'messaging.html';
        } else if (e.target.classList.contains('reports-nav')) {
            window.location.href = 'reports.html';
        } else if (e.target.classList.contains('settings-nav')) {
            window.location.href = 'settings.html';
        } else if (e.target.classList.contains('nav-item') && !e.target.classList.contains('active')) {
            // Default: Missions
            window.location.href = 'dashboard.html';
        }
    });
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.textContent.toLowerCase();
            if (page === 'missions') {
                window.location.href = 'dashboard.html';
            } else if (page === 'units') {
                window.location.href = 'units.html';
            } else if (page === 'tracking') {
                window.location.href = 'tracking.html';
            } else if (page === 'comms') {
                window.location.href = 'messaging.html';
            } else if (page === 'reports') {
                window.location.href = 'reports.html';
            }
        });
    });

    // Save Changes functionality
    const saveButton = document.querySelector('.btn-save');
    saveButton.addEventListener('click', () => {
        // Collect all settings values
        const settings = {
            general: {
                systemName: document.querySelector('#general input[type="text"]').value,
                timeZone: document.querySelector('#general select').value,
                dateFormat: document.querySelectorAll('#general select')[1].value
            },
            notifications: {
                emailNotifications: document.getElementById('email-notifications').checked,
                missionUpdates: document.getElementById('mission-updates').checked,
                unitStatus: document.getElementById('unit-status').checked
            },
            security: {
                twoFactorAuth: document.getElementById('2fa').checked,
                sessionTimeout: document.querySelector('#security input[type="number"]').value,
                passwordChange: document.querySelector('#security select').value
            },
            appearance: {
                theme: document.querySelectorAll('#appearance select')[0].value,
                fontSize: document.querySelectorAll('#appearance select')[1].value,
                colorScheme: document.querySelectorAll('#appearance select')[2].value
            }
        };

        // Save settings (in a real application, this would be sent to a server)
        console.log('Saving settings:', settings);
        
        // Show success message
        alert('Settings saved successfully!');
    });

    // Toggle switch styling
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    });

    // Input validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
}); 