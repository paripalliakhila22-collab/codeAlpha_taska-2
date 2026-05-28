// Global state
const state = {
    userId: 'user_' + Date.now(),
    activities: [],
    goals: {
        steps: 10000,
        calories: 500,
    },
    userInfo: {
        name: '',
        height: 0,
        weight: 0,
    },
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadDataFromStorage();
    setupEventListeners();
    setTodayDate();
    loadDashboard();
}

// Tab Navigation
function setupEventListeners() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            switchTab(e.target.dataset.tab);
        });
    });

    // Dashboard
    document.getElementById('dateSelector').addEventListener('change', loadDashboard);

    // Log Activity
    document.getElementById('activityForm').addEventListener('submit', handleActivitySubmit);

    // History
    document.getElementById('filterBtn').addEventListener('click', filterHistory);

    // Settings
    document.getElementById('saveGoalsBtn').addEventListener('click', saveGoals);
    document.getElementById('saveUserInfoBtn').addEventListener('click', saveUserInfo);
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'history') {
        loadHistory();
    } else if (tabName === 'settings') {
        loadSettings();
    }
}

// Dashboard
function loadDashboard() {
    const selectedDate = document.getElementById('dateSelector').value || new Date().toISOString().split('T')[0];
    const todayActivities = getActivitiesByDate(selectedDate);

    const summary = calculateDailySummary(todayActivities);
    updateDashboardStats(summary);
    renderTodayActivities(todayActivities);
    updateCharts();
}

function getActivitiesByDate(dateStr) {
    const date = new Date(dateStr).toDateString();
    return state.activities.filter(a => new Date(a.date).toDateString() === date);
}

function calculateDailySummary(activities) {
    return {
        totalSteps: activities
            .filter(a => a.type === 'steps')
            .reduce((sum, a) => sum + (a.steps || 0), 0),
        totalCalories: activities.reduce((sum, a) => sum + (a.calories || 0), 0),
        totalDuration: activities.reduce((sum, a) => sum + (a.duration || 0), 0),
        workoutCount: activities.filter(a => a.type !== 'steps').length,
    };
}

function updateDashboardStats(summary) {
    document.getElementById('totalSteps').textContent = summary.totalSteps.toLocaleString();
    document.getElementById('totalCalories').textContent = summary.totalCalories;
    document.getElementById('totalDuration').textContent = summary.totalDuration;
    document.getElementById('workoutCount').textContent = summary.workoutCount;

    // Update progress bars
    const stepsPercent = (summary.totalSteps / state.goals.steps) * 100;
    const caloriesPercent = (summary.totalCalories / state.goals.calories) * 100;

    document.getElementById('stepsProgress').style.width = Math.min(stepsPercent, 100) + '%';
    document.getElementById('caloriesProgress').style.width = Math.min(caloriesPercent, 100) + '%';
}

function renderTodayActivities(activities) {
    const container = document.getElementById('todayActivities');

    if (activities.length === 0) {
        container.innerHTML = '<p class="no-data">No activities logged yet. Start by adding one!</p>';
        return;
    }

    container.innerHTML = activities
        .map(activity => `
            <div class="activity-item">
                <div class="activity-details">
                    <div class="activity-type">${getActivityEmoji(activity.type)} ${activity.type}</div>
                    <div class="activity-meta">${new Date(activity.date).toLocaleTimeString()}</div>
                    <div class="activity-stats">
                        <div class="activity-stat">
                            <span class="activity-stat-label">Duration</span>
                            <span class="activity-stat-value">${activity.duration} min</span>
                        </div>
                        <div class="activity-stat">
                            <span class="activity-stat-label">Calories</span>
                            <span class="activity-stat-value">${activity.calories} kcal</span>
                        </div>
                        ${activity.distance ? `
                        <div class="activity-stat">
                            <span class="activity-stat-label">Distance</span>
                            <span class="activity-stat-value">${activity.distance} km</span>
                        </div>
                        ` : ''}
                    </div>
                    ${activity.notes ? `<p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">📝 ${activity.notes}</p>` : ''}
                </div>
                <div class="activity-actions">
                    <button class="btn btn-danger btn-small" onclick="deleteActivity('${activity.id}')">Delete</button>
                </div>
            </div>
        `)
        .join('');
}

// Log Activity Form
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('activityDate').value = today;
    document.getElementById('dateSelector').value = today;
}

function handleActivitySubmit(e) {
    e.preventDefault();

    const activity = {
        id: 'activity_' + Date.now(),
        type: document.getElementById('activityType').value,
        date: new Date(document.getElementById('activityDate').value),
        duration: parseInt(document.getElementById('duration').value),
        calories: parseInt(document.getElementById('calories').value),
        steps: parseInt(document.getElementById('steps').value) || 0,
        distance: parseFloat(document.getElementById('distance').value) || 0,
        notes: document.getElementById('notes').value,
    };

    state.activities.push(activity);
    saveDataToStorage();

    showToast('Activity logged successfully!', 'success');
    document.getElementById('activityForm').reset();
    setTodayDate();
    loadDashboard();
}

// History
function loadHistory() {
    renderHistory(state.activities);
}

function filterHistory() {
    const startDate = new Date(document.getElementById('filterStartDate').value);
    const endDate = new Date(document.getElementById('filterEndDate').value);

    const filtered = state.activities.filter(a => {
        const actDate = new Date(a.date);
        return actDate >= startDate && actDate <= endDate;
    });

    renderHistory(filtered);
}

function renderHistory(activities) {
    const container = document.getElementById('historyList');

    if (activities.length === 0) {
        container.innerHTML = '<p class="no-data">No activities found.</p>';
        return;
    }

    const sorted = activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sorted
        .map(activity => `
            <div class="history-item">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <div style="font-weight: 600; margin-bottom: 0.5rem;">
                            ${getActivityEmoji(activity.type)} ${activity.type}
                        </div>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                            ${new Date(activity.date).toLocaleString()}
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem;">
                            <div>
                                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Duration</span>
                                <div style="font-weight: 600;">${activity.duration} min</div>
                            </div>
                            <div>
                                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Calories</span>
                                <div style="font-weight: 600;">${activity.calories} kcal</div>
                            </div>
                            ${activity.distance ? `
                            <div>
                                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary);">Distance</span>
                                <div style="font-weight: 600;">${activity.distance} km</div>
                            </div>
                            ` : ''}
                        </div>
                        ${activity.notes ? `<p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">📝 ${activity.notes}</p>` : ''}
                    </div>
                    <button class="btn btn-danger btn-small" onclick="deleteActivity('${activity.id}')">Delete</button>
                </div>
            </div>
        `)
        .join('');
}

function deleteActivity(id) {
    state.activities = state.activities.filter(a => a.id !== id);
    saveDataToStorage();
    showToast('Activity deleted', 'success');
    loadDashboard();
    loadHistory();
}

// Charts
function updateCharts() {
    updateWeeklyCaloriesChart();
    updateActivityDistributionChart();
}

function updateWeeklyCaloriesChart() {
    const last7Days = getLast7DaysData();
    const labels = last7Days.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }));
    const data = last7Days.map(d => d.calories);

    const ctx = document.getElementById('caloriesChart').getContext('2d');

    if (window.caloriesChart) {
        window.caloriesChart.destroy();
    }

    window.caloriesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Calories Burned',
                    data,
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: 'rgb(99, 102, 241)',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { usePointStyle: true },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

function updateActivityDistributionChart() {
    const activityTypes = {};
    state.activities.forEach(a => {
        activityTypes[a.type] = (activityTypes[a.type] || 0) + 1;
    });

    const ctx = document.getElementById('activityChart').getContext('2d');

    if (window.activityChart) {
        window.activityChart.destroy();
    }

    window.activityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(activityTypes).map(t => getActivityEmoji(t) + ' ' + t),
            datasets: [
                {
                    data: Object.values(activityTypes),
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(10, 184, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                    ],
                    borderColor: 'white',
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        },
    });
}

function getLast7DaysData() {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayActivities = getActivitiesByDate(dateStr);
        const calories = dayActivities.reduce((sum, a) => sum + a.calories, 0);
        last7Days.push({ date: dateStr, calories });
    }
    return last7Days;
}

// Settings
function loadSettings() {
    document.getElementById('goalSteps').value = state.goals.steps;
    document.getElementById('goalCalories').value = state.goals.calories;
    document.getElementById('userName').value = state.userInfo.name;
    document.getElementById('userHeight').value = state.userInfo.height;
    document.getElementById('userWeight').value = state.userInfo.weight;
}

function saveGoals() {
    state.goals.steps = parseInt(document.getElementById('goalSteps').value);
    state.goals.calories = parseInt(document.getElementById('goalCalories').value);
    saveDataToStorage();
    showToast('Goals saved successfully!', 'success');
    loadDashboard();
}

function saveUserInfo() {
    state.userInfo.name = document.getElementById('userName').value;
    state.userInfo.height = parseInt(document.getElementById('userHeight').value);
    state.userInfo.weight = parseFloat(document.getElementById('userWeight').value);
    saveDataToStorage();
    showToast('User information saved!', 'success');
}

function clearAllData() {
    if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
        state.activities = [];
        saveDataToStorage();
        showToast('All data cleared', 'success');
        loadDashboard();
    }
}

function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Data exported successfully!', 'success');
}

// Local Storage
function saveDataToStorage() {
    localStorage.setItem('fitnessTrackerData', JSON.stringify(state));
}

function loadDataFromStorage() {
    const data = localStorage.getItem('fitnessTrackerData');
    if (data) {
        const parsed = JSON.parse(data);
        Object.assign(state, parsed);
        // Convert date strings back to Date objects
        state.activities = state.activities.map(a => ({
            ...a,
            date: new Date(a.date),
        }));
    }
}

// Utility Functions
function getActivityEmoji(type) {
    const emojis = {
        running: '🏃',
        walking: '🚶',
        cycling: '🚴',
        gym: '🏋️',
        yoga: '🧘',
        swimming: '🏊',
        sports: '⚽',
        steps: '👟',
        other: '📝',
    };
    return emojis[type] || '💪';
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
