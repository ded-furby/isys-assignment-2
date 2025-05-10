// Reports Page Logic (Frontend Only, Demo Purposes)
document.addEventListener('DOMContentLoaded', function() {
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
            } else if (page === 'settings') {
                window.location.href = 'settings.html';
            }
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

    // Report filters functionality
    const missionTypeFilter = document.getElementById('report-mission-type');
    const dateRangeFilter = document.getElementById('report-date-range');

    missionTypeFilter.addEventListener('change', updateReports);
    dateRangeFilter.addEventListener('change', updateReports);

    // Download buttons functionality
    document.getElementById('download-pdf').addEventListener('click', () => {
        alert('PDF download functionality would be implemented here');
    });

    document.getElementById('download-csv').addEventListener('click', () => {
        alert('CSV download functionality would be implemented here');
    });

    // Initialize chart
    const ctx = document.getElementById('mission-duration-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Mission Duration (hours)',
                data: [2.5, 3.2, 1.8, 4.0, 2.7, 3.5, 2.1],
                borderColor: '#4CAF50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Update report data based on filters
    function updateReports() {
        const missionType = missionTypeFilter.value;
        const dateRange = dateRangeFilter.value;

        // Update summary cards with demo data
        document.getElementById('total-missions').textContent = '24';
        document.getElementById('avg-duration').textContent = '2 hr 45 min';
        document.getElementById('delayed-missions').textContent = '3';

        // Update chart with demo data
        chart.data.datasets[0].data = [2.5, 3.2, 1.8, 4.0, 2.7, 3.5, 2.1];
        chart.update();
    }

    // Initial report update
    updateReports();
});

function getFilteredMissions() {
    let missions = JSON.parse(localStorage.getItem('missions')) || [];
    const type = document.getElementById('report-mission-type').value;
    const range = document.getElementById('report-date-range').value;

    // Filter by type
    if (type !== 'all') {
        missions = missions.filter(m => {
            const name = (m.name || '').toLowerCase();
            if (type === 'recon') return name.includes('recon');
            if (type === 'combat') return name.includes('combat') || name.includes('patrol');
            if (type === 'supply') return name.includes('supply') || name.includes('resource');
            if (type === 'training') return name.includes('training') || name.includes('admin');
            return false;
        });
    }

    // Filter by date range
    if (range !== 'all') {
        const days = parseInt(range, 10);
        const now = new Date();
        missions = missions.filter(m => {
            if (!m.date) return false;
            const missionDate = new Date(m.date);
            const diff = (now - missionDate) / (1000 * 60 * 60 * 24);
            return diff <= days;
        });
    }

    return missions;
}

function updateReport() {
    const missions = getFilteredMissions();

    // Total Missions
    document.getElementById('total-missions').textContent = missions.length;

    // Avg Duration
    let totalMinutes = 0;
    let delayedCount = 0;
    missions.forEach(m => {
        const start = m.startTime ? parseTime(m.startTime) : null;
        const end = m.endTime ? parseTime(m.endTime) : null;
        if (start && end) {
            let duration = (end - start + 1440) % 1440; // handle overnight
            totalMinutes += duration;
            // Demo: consider missions > 4hr as delayed
            if (duration > 240) delayedCount++;
        }
    });
    const avgMinutes = missions.length ? Math.round(totalMinutes / missions.length) : 0;
    const avgHr = Math.floor(avgMinutes / 60);
    const avgMin = avgMinutes % 60;
    document.getElementById('avg-duration').textContent = `${avgHr} hr ${avgMin} min`;

    // Delayed Missions
    document.getElementById('delayed-missions').textContent = delayedCount;

    // Chart
    drawBarChart(missions);
}

function parseTime(t) {
    // "HH:MM"
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

function drawBarChart(missions) {
    const canvas = document.getElementById('mission-duration-chart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Group by weekday
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayTotals = Array(7).fill(0);
    const dayCounts = Array(7).fill(0);

    missions.forEach(m => {
        if (!m.date || !m.startTime || !m.endTime) return;
        const d = new Date(m.date);
        const dayIdx = (d.getDay() + 6) % 7; // JS: 0=Sun, want 0=Mon
        let duration = (parseTime(m.endTime) - parseTime(m.startTime) + 1440) % 1440;
        dayTotals[dayIdx] += duration / 60; // hours
        dayCounts[dayIdx]++;
    });

    // Chart dimensions
    const w = canvas.width, h = canvas.height;
    const barW = 48, gap = 32;
    const maxVal = Math.max(5, ...dayTotals); // at least 5 for demo
    const chartH = h - 40, chartY = 30;

    // Y axis
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(60, chartY);
    ctx.lineTo(60, chartY + chartH);
    ctx.lineTo(w - 20, chartY + chartH);
    ctx.stroke();

    // Y labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
        const y = chartY + chartH - (i * chartH / 5);
        ctx.fillText((i).toFixed(1), 55, y + 5);
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(w - 20, y);
        ctx.stroke();
    }

    // Bars
    for (let i = 0; i < 5; i++) { // Mon-Fri
        const x = 80 + i * (barW + gap);
        const val = dayTotals[i];
        const barH = (val / maxVal) * (chartH - 10);
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, chartY + chartH - barH, barW, barH);

        // Bar value
        ctx.fillStyle = "#121212";
        ctx.font = "bold 15px Arial";
        ctx.textAlign = "center";
        if (val > 0) ctx.fillText(val.toFixed(1), x + barW / 2, chartY + chartH - barH - 8);

        // X labels
        ctx.fillStyle = "#fff";
        ctx.font = "15px Arial";
        ctx.fillText(days[i], x + barW / 2, chartY + chartH + 22);
    }
}

function downloadCSV() {
    const missions = getFilteredMissions();
    let csv = "Mission Name,Date,Start Time,End Time,Units,Status\n";
    missions.forEach(m => {
        csv += `"${m.name}","${m.date}","${m.startTime}","${m.endTime}","${(m.units||[]).join('; ')}","${m.status}"\n`;
    });
    const blob = new Blob([csv], {type: "text/csv"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "missions_report.csv";
    a.click();
}

function downloadPDF() {
    // For demo: generate a simple text-based PDF using js (no libs)
    // In real app, use jsPDF or similar
    const missions = getFilteredMissions();
    let text = "Chicken Jockey Coordination System - Mission Report\n\n";
    text += "Mission Name | Date | Start Time | End Time | Units | Status\n";
    text += "-------------------------------------------------------------\n";
    missions.forEach(m => {
        text += `${m.name} | ${m.date} | ${m.startTime} | ${m.endTime} | ${(m.units||[]).join('; ')} | ${m.status}\n`;
    });
    const blob = new Blob([text], {type: "application/pdf"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "missions_report.pdf";
    a.click();
}
