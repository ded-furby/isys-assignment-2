document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.textContent.toLowerCase();
            if (page === 'missions') {
                window.location.href = 'dashboard.html';
            } else if (page === 'tracking') {
                window.location.href = 'tracking.html';
            } else if (page === 'comms') {
                window.location.href = 'messaging.html';
            } else if (page === 'reports') {
                window.location.href = 'reports.html';
            } else if (page === 'settings') {
                window.location.href = 'settings.html';
            }
        });
    });

    // Filter functionality
    const filterDropdown = document.getElementById('unit-filter-dropdown');
    filterDropdown.addEventListener('change', function() {
        const filterValue = this.value;
        const rows = document.querySelectorAll('#units-table-body tr');
        
        rows.forEach(row => {
            const statusCell = row.querySelector('td:nth-child(3)');
            const status = statusCell.textContent.toLowerCase();
            
            if (filterValue === 'all' || status.includes(filterValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Sort functionality
    const sortDropdown = document.getElementById('unit-sort-dropdown');
    sortDropdown.addEventListener('change', function() {
        const sortValue = this.value;
        const tbody = document.getElementById('units-table-body');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            let aValue, bValue;
            
            switch(sortValue) {
                case 'id':
                    aValue = a.cells[0].textContent;
                    bValue = b.cells[0].textContent;
                    break;
                case 'name':
                    aValue = a.cells[1].textContent;
                    bValue = b.cells[1].textContent;
                    break;
                case 'status':
                    aValue = a.cells[2].textContent;
                    bValue = b.cells[2].textContent;
                    break;
            }

            return aValue.localeCompare(bValue);
        });

        // Reorder the rows in the table
        rows.forEach(row => tbody.appendChild(row));
    });

    // Add New Unit button functionality
    const addNewUnitBtn = document.querySelector('.btn-create');
    addNewUnitBtn.addEventListener('click', () => {
        // This would typically open a modal or navigate to a new unit creation page
        alert('Add New Unit functionality would be implemented here');
    });

    // View Details button functionality
    const viewDetailsButtons = document.querySelectorAll('.action-btn');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const row = button.closest('tr');
            const unitId = row.cells[0].textContent;
            const unitName = row.cells[1].textContent;
            
            // This would typically open a modal with unit details
            alert(`Viewing details for ${unitName} (${unitId})`);
        });
    });
}); 