// Patient Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const patientDashboard = document.getElementById('patientDashboard');
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const upcomingAppointments = document.getElementById('upcomingAppointments');
    const recentPrescriptions = document.getElementById('recentPrescriptions');
    const recentTestResults = document.getElementById('recentTestResults');
    const navItems = document.querySelectorAll('.main-nav li');
    
    // Sample data - In a real app, this would come from an API
    const sampleAppointments = [
        {
            id: 1,
            doctorName: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            date: '2023-06-15',
            time: '10:00 AM',
            status: 'Confirmed',
            location: 'Main Hospital, Room 302'
        },
        {
            id: 2,
            doctorName: 'Dr. Michael Chen',
            specialty: 'Dermatology',
            date: '2023-06-20',
            time: '02:30 PM',
            status: 'Pending',
            location: 'Downtown Clinic, Room 105'
        }
    ];

    const samplePrescriptions = [
        {
            id: 1,
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            prescribedBy: 'Dr. Sarah Johnson',
            date: '2023-06-01',
            refills: 3
        },
        {
            id: 2,
            medication: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily at bedtime',
            prescribedBy: 'Dr. Sarah Johnson',
            date: '2023-06-01',
            refills: 2
        }
    ];

    const sampleTestResults = [
        {
            id: 1,
            testName: 'Complete Blood Count (CBC)',
            date: '2023-05-25',
            status: 'Completed',
            result: 'Normal',
            orderedBy: 'Dr. Sarah Johnson'
        },
        {
            id: 2,
            testName: 'Lipid Panel',
            date: '2023-05-25',
            status: 'Completed',
            result: 'High Cholesterol',
            orderedBy: 'Dr. Sarah Johnson'
        }
    ];

    // Initialize the dashboard
    function initDashboard() {
        // Set patient name from localStorage or default
        const patientName = localStorage.getItem('patientName') || 'Patient';
        document.getElementById('patientName').textContent = patientName;
        document.getElementById('userName').textContent = patientName;
        
        // Render data
        renderAppointments();
        renderPrescriptions();
        renderTestResults();
        
        // Setup event listeners
        setupEventListeners();
    }

    // Render appointments
    function renderAppointments() {
        if (!upcomingAppointments) return;
        
        if (sampleAppointments.length === 0) {
            upcomingAppointments.innerHTML = '<p>No upcoming appointments. Book one now!</p>';
            return;
        }
        
        const html = `
            <div class="appointments-grid">
                ${sampleAppointments.map(appointment => `
                    <div class="appointment-card">
                        <div class="appointment-time">
                            <span class="time">${appointment.time}</span>
                            <span class="status ${appointment.status.toLowerCase()}">${appointment.status}</span>
                        </div>
                        <div class="appointment-details">
                            <h4>${appointment.doctorName}</h4>
                            <p class="specialty">${appointment.specialty}</p>
                            <p class="location"><i class="fas fa-map-marker-alt"></i> ${appointment.location}</p>
                            <button class="btn btn-outline" onclick="viewAppointmentDetails(${appointment.id})">
                                View Details
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        upcomingAppointments.innerHTML = html;
    }

    // Render prescriptions
    function renderPrescriptions() {
        if (!recentPrescriptions) return;
        
        if (samplePrescriptions.length === 0) {
            recentPrescriptions.innerHTML = '<p>No recent prescriptions found.</p>';
            return;
        }
        
        const html = `
            <div class="prescriptions-grid">
                ${samplePrescriptions.map(prescription => `
                    <div class="prescription-card">
                        <div class="medication-info">
                            <h4>${prescription.medication} <span class="dosage">${prescription.dosage}</span></h4>
                            <p><i class="fas fa-clock"></i> ${prescription.frequency}</p>
                            <p><i class="fas fa-user-md"></i> ${prescription.prescribedBy}</p>
                        </div>
                        <div class="prescription-meta">
                            <span class="refill">Refills: ${prescription.refills}</span>
                            <span class="date">${prescription.date}</span>
                        </div>
                        <button class="btn btn-outline" onclick="requestRefill(${prescription.id})">
                            Request Refill
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        recentPrescriptions.innerHTML = html;
    }

    // Render test results
    function renderTestResults() {
        if (!recentTestResults) return;
        
        if (sampleTestResults.length === 0) {
            recentTestResults.innerHTML = '<p>No recent test results available.</p>';
            return;
        }
        
        const html = `
            <div class="test-results-grid">
                ${sampleTestResults.map(test => `
                    <div class="test-result-card">
                        <div class="test-header">
                            <h4>${test.testName}</h4>
                            <span class="status ${test.status.toLowerCase()}">${test.status}</span>
                        </div>
                        <div class="test-details">
                            <p><i class="fas fa-calendar-alt"></i> ${test.date}</p>
                            <p><i class="fas fa-user-md"></i> ${test.orderedBy}</p>
                            <p class="result">Result: <span class="${test.result === 'Normal' ? 'normal' : 'abnormal'}">${test.result}</span></p>
                        </div>
                        <button class="btn btn-outline" onclick="viewTestDetails(${test.id})">
                            View Details
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        recentTestResults.innerHTML = html;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Toggle profile dropdown
        if (profileTrigger) {
            profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-menu')) {
                profileDropdown.classList.remove('show');
            }
        });

        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                navItems.forEach(navItem => navItem.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                
                // In a real app, you would load the appropriate content here
                const section = item.getAttribute('data-section');
                console.log(`Navigating to ${section} section`);
            });
        });

        // Quick actions
        const bookAppointmentBtn = document.getElementById('bookAppointment');
        if (bookAppointmentBtn) {
            bookAppointmentBtn.addEventListener('click', () => {
                alert('Redirecting to appointment booking...');
                // In a real app, you would navigate to the appointment booking page
            });
        }

        // View all buttons
        const viewAllButtons = [
            { id: 'viewAllAppointments', action: () => console.log('View all appointments') },
            { id: 'viewAllPrescriptions', action: () => console.log('View all prescriptions') },
            { id: 'viewAllTestResults', action: () => console.log('View all test results') }
        ];

        viewAllButtons.forEach(button => {
            const btn = document.getElementById(button.id);
            if (btn) {
                btn.addEventListener('click', button.action);
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear user session
            localStorage.removeItem('patientName');
            // Redirect to login page
            window.location.href = 'index.html';
        });
    }

    // Initialize the dashboard if we're on the patient dashboard page
    if (patientDashboard) {
        initDashboard();
    }
});

// These functions would be called from the HTML
function viewAppointmentDetails(appointmentId) {
    console.log(`Viewing details for appointment ${appointmentId}`);
    // In a real app, this would show a modal with appointment details
    alert(`Viewing details for appointment ${appointmentId}`);
}

function requestRefill(prescriptionId) {
    console.log(`Requesting refill for prescription ${prescriptionId}`);
    // In a real app, this would open a refill request form
    alert(`Requesting refill for prescription ${prescriptionId}`);
}

function viewTestDetails(testId) {
    console.log(`Viewing details for test ${testId}`);
    // In a real app, this would show a modal with test details
    alert(`Viewing details for test ${testId}`);
}

// Make functions available globally
window.viewAppointmentDetails = viewAppointmentDetails;
window.requestRefill = requestRefill;
window.viewTestDetails = viewTestDetails;
