// Function to add a dashboard option to the UI
function addDashboardOption(text, isfirst = false) {
    try {
        // Create the HTML structure for a dashboard option
        let dashboardOptionUi = `
        <div class="dashboardOption ${isfirst == true ? 'activeDashboard' : ''}">
            <div class="circleDiv"> </div>
            <span>${text}</span>
            <img src="Asset/Icons/Group 2804.svg" alt="" onclick="removeDashboard(this)"> 
        </div>
    `;

        // Get the container element for dashboard options
        let dashboardOptionContainer = document.querySelector('#DashboardOptionContainer');
        
        // Append the new dashboard option if the container is found
        if (dashboardOptionContainer != undefined) {
            dashboardOptionContainer.innerHTML += dashboardOptionUi;
        }
    } catch (e) {
        // Log any errors encountered during the function execution
        console.error(e);
        logError('addDashboardOption', e.message);
    }
}

// Function to handle the addition of new dashboard options
function addDashboard() {
    try {
        // Retrieve the current count of dashboards from localStorage
        let count = localStorage.getItem('DashboadCounts');

        // Check if the maximum number of dashboards (4) is already reached
        if (count == 4) {
            alert("Max 4 Dashboard can be created");
            return;
        }

        // If no dashboards exist, create the first one
        if (count == null ||count == 0 ) {
            addDashboardOption('Dashboard 1', true); // Set first dashboard as active
            localStorage.setItem('DashboadCounts', 1); // Initialize count to 1 in localStorage
        } else {
            // Increment the dashboard count and add a new dashboard
            count++;
            addDashboardOption(`Dashboard ${count}`, false); // Add as inactive
            localStorage.setItem('DashboadCounts', count); // Update count in localStorage
        }
    } catch (e) {
        console.error(e);
        logError('addDashboard', e.message);
    }
}

// Function to log errors to a backend server running on localhost
async function logError(functionName, errorMessage) {
    try {
        const response = await fetch('http://localhost:3000/write-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ functionName, errorMessage }),
        });

        // Log the response message or error
        const result = await response.json();
        console.log(result.message || result.error);
    } catch (e) {
        console.error("Error in logError function:", e);
    }
}

// Function to load the initial UI based on saved dashboards in localStorage
function loadbasicUi() {
    try {
        let count = localStorage.getItem('DashboadCounts');
        
        // If dashboards exist, load each one as a UI element
        if (count != null) {
            for (let i = 1; i <= count; i++) {
                // Set the first dashboard as active, others as inactive
                addDashboardOption(`Dashboard ${i}`, i == 1);
            }
        }
    } catch (e) {
        console.error(e);
        logError('loadbasicUi', e.message);
    }
}

// Load the initial dashboard UI on page load
try {
    loadbasicUi();
} catch (e) {
    logError('initialLoad', e.message);
}

// Function to remove a dashboard option
function removeDashboard(e) {
    try {
        // Retrieve the current count of dashboards from localStorage
        let count = localStorage.getItem('DashboadCounts');
        
        // If dashboards exist, decrement the count and update the UI
        if (count != null) {
            count--;
            localStorage.setItem('DashboadCounts', count);

            // Clear existing dashboard options in the UI and reload based on updated count
            let dashboardOptionContainer = document.querySelector('#DashboardOptionContainer');
            dashboardOptionContainer.innerHTML = '';
            loadbasicUi();
        }
    } catch (e) {
        console.error(e);
        logError('removeDashboard', e.message);
    }
}

// Set up draggable functionality for a UI container after a short delay
let boundaryArea = document.querySelector('.workingBodyContainer');

setTimeout(() => {
    try {
        $("#" + 'MainBodySettingContainer').dxDraggable({
            // Set the boundary to restrict draggable area
            boundary: boundaryArea,

            // Enable auto scroll and keep element in original position post drag
            autoScroll: true,
            dragDirection: "both",
        });
    } catch (e) {
        console.error(e);
        logError('draggableSetup', e.message);
    }
}, 1000);

// Global variable to store the chart instance
let chart;

// Function to load a chart of a specific type in the UI
function loadChart(type) {
    try {
        const ctx = document.getElementById('chartCanvas').getContext('2d');

        // Destroy any existing chart instance to avoid overlap
        if (chart) {
            chart.destroy();
        }

        // Hide the add visual button and show the hide button
        document.querySelector('.addVisualContainer').style.display = 'none';
        document.querySelector('.hideBtn').style.display = 'block';

        // Configure the chart settings based on the chosen type
        const config = getConfig(type);

        // Create and render a new chart instance
        chart = new Chart(ctx, config);
    } catch (e) {
        console.error(e);
        logError('loadChart', e.message);
    }
}

// Function to get chart configurations based on the chart type
function getConfig(type) {
    try {
        // Common data structure for the chart
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [65, 59, 80, 81, 56],
                    backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                    borderColor: ['rgba(75, 192, 192, 1)'],
                    borderWidth: 1
                }
            ]
        };

        // General chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
        };

        // Additional configurations based on specific chart types
        if (type === 'bubble') {
            data.datasets[0] = {
                label: 'Bubble Dataset',
                data: [
                    { x: 20, y: 30, r: 15 },
                    { x: 25, y: 10, r: 10 },
                    { x: 15, y: 40, r: 20 }
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            };
        } else if (type === 'polarArea') {
            data.datasets[0].data = [11, 16, 7, 3, 14];
            data.datasets[0].backgroundColor = [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
            ];
        } else if (type === 'mixed') {
            data.datasets = [
                {
                    type: 'bar',
                    label: 'Bar Dataset',
                    data: [10, 20, 30, 40, 50],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    type: 'line',
                    label: 'Line Dataset',
                    data: [50, 40, 30, 20, 10],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ];
        } else if (type === 'radar') {
            data.labels = ['Eating', 'Drinking', 'Sleeping', 'Working', 'Exercising'];
            data.datasets = [
                {
                    label: 'Person A',
                    data: [65, 59, 90, 81, 56],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                },
                {
                    label: 'Person B',
                    data: [28, 48, 40, 19, 96],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                }
            ];
        }

        return {
            type: type === 'mixed' ? 'bar' : type, // Use bar as base type for mixed charts
            data: data,
            options: options
        };
    } catch (e) {
        console.error(e);
        logError('getConfig', e.message);
        return {}; // Return empty config in case of error
    }
}

// Function to clear the currently displayed chart
function clearChart() {
    try {
        if (chart) {
            chart.destroy();
            document.querySelector('.addVisualContainer').style.display = 'flex';
            document.querySelector('.hideBtn').style.display = 'none';
        }
    } catch (e) {
        console.error(e);
        logError('clearChart', e.message);
    }
}