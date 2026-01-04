// Doctor Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const doctorDashboard = document.getElementById('doctorDashboard');
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const appointmentsList = document.getElementById('appointmentsList');
    const currentDateElement = document.getElementById('currentDate');
    const prevDayBtn = document.getElementById('prevDay');
    const nextDayBtn = document.getElementById('nextDay');
    const navItems = document.querySelectorAll('.main-nav li');
    
    // Sample data - In a real app, this would come from an API
    const sampleAppointments = [
        {
            id: 1,
            patientName: 'John Doe',
            age: 32,
            gender: 'Male',
            time: '09:00 AM',
            reason: 'Annual Checkup',
            symptoms: 'None',
            medicalHistory: 'Hypertension',
            profileImage: ''
        },
        {
            id: 2,
            patientName: 'Jane Smith',
            age: 45,
            gender: 'Female',
            time: '10:30 AM',
            reason: 'Follow-up',
            symptoms: 'Headache, Fever',
            medicalHistory: 'Migraine, Allergies',
            profileImage: ''
        },
        {
            id: 3,
            patientName: 'Robert Johnson',
            age: 28,
            gender: 'Male',
            time: '11:15 AM',
            reason: 'Consultation',
            symptoms: 'Cough, Sore throat',
            medicalHistory: 'Asthma',
            profileImage: ''
        }
    ];

    // Current date tracking
    let currentDate = new Date();
    
    // Initialize the dashboard
    function initDashboard() {
        updateDateDisplay();
        renderAppointments();
        setupEventListeners();
    }

    // Update the displayed date
    function updateDateDisplay() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = currentDate.toLocaleDateString('en-US', options);
    }

    // Render appointments for the current day
    function renderAppointments() {
        if (!appointmentsList) return;
        
        appointmentsList.innerHTML = '';
        
        if (sampleAppointments.length === 0) {
            appointmentsList.innerHTML = '<div class="no-appointments">No appointments scheduled for today.</div>';
            return;
        }
        
        sampleAppointments.forEach(appointment => {
            const appointmentElement = document.createElement('div');
            appointmentElement.className = 'appointment-card';
            appointmentElement.innerHTML = `
                <div class="appointment-header">
                    <div class="patient-info">
                        <div class="patient-avatar">
                            ${appointment.profileImage ? 
                                `<img src="${appointment.profileImage}" alt="${appointment.patientName}">` : 
                                appointment.patientName.charAt(0).toUpperCase()}
                        </div>
                        <div class="patient-details">
                            <h3>${appointment.patientName}</h3>
                            <p>${appointment.age} years • ${appointment.gender}</p>
                        </div>
                    </div>
                    <div class="appointment-time">${appointment.time}</div>
                </div>
                <div class="appointment-details">
                    <div class="detail-row">
                        <span class="detail-label">Reason:</span>
                        <span class="detail-value">${appointment.reason}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Symptoms:</span>
                        <span class="detail-value">${appointment.symptoms}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Medical History:</span>
                        <span class="detail-value">${appointment.medicalHistory}</span>
                    </div>
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-outline" onclick="markAsDone(${appointment.id})">
                        <i class="fas fa-check"></i> Done
                    </button>
                    <button class="btn btn-primary" onclick="startConsultation(${appointment.id})">
                        <i class="fas fa-stethoscope"></i> Start Consultation
                    </button>
                </div>
            `;
            appointmentsList.appendChild(appointmentElement);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Profile dropdown toggle
        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
                    profileDropdown.classList.remove('show');
                }
            });
        }

        // Navigation between days
        if (prevDayBtn) {
            prevDayBtn.addEventListener('click', () => {
                currentDate.setDate(currentDate.getDate() - 1);
                updateDateDisplay();
                // In a real app, you would fetch appointments for the new date
                // fetchAppointmentsForDate(currentDate);
            });
        }

        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', () => {
                currentDate.setDate(currentDate.getDate() + 1);
                updateDateDisplay();
                // In a real app, you would fetch appointments for the new date
                // fetchAppointmentsForDate(currentDate);
            });
        }

        // Navigation items
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                navItems.forEach(navItem => navItem.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                const section = item.getAttribute('data-section');
                // In a real app, you would load the appropriate section content
                console.log(`Loading section: ${section}`);
            });
        });

        // Logout functionality
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                // In a real app, you would handle the logout logic here
                alert('Logging out...');
                // For now, just reload the page to show the login screen
                window.location.reload();
            });
        }
    }

    // Global functions that can be called from HTML
    window.markAsDone = function(appointmentId) {
        // In a real app, you would update the appointment status via an API
        alert(`Marking appointment ${appointmentId} as done`);
        // For now, just remove the appointment from the UI
        const appointmentElement = document.querySelector(`[data-appointment-id="${appointmentId}"]`);
        if (appointmentElement) {
            appointmentElement.remove();
        }
    };

    window.startConsultation = function(appointmentId) {
        // In a real app, you would navigate to the consultation page or open a consultation modal
        alert(`Starting consultation for appointment ${appointmentId}`);
    };

    // Initialize the dashboard
    if (doctorDashboard) {
        initDashboard();
    }
});

// Function to show the doctor dashboard (called after successful login)
function showDoctorDashboard(doctorData) {
    const mainContent = document.getElementById('mainContent');
    const doctorDashboard = document.getElementById('doctorDashboard');
    
    if (mainContent) mainContent.style.display = 'none';
    if (doctorDashboard) {
        doctorDashboard.style.display = 'flex';
        
        // Update doctor's profile info
        const userName = document.getElementById('userName');
        const profileImage = document.getElementById('profileImage');
        
        if (userName && doctorData.name) {
            userName.textContent = `Dr. ${doctorData.name}`;
        }
        
        if (profileImage && doctorData.profileImage) {
            profileImage.src = doctorData.profileImage;
            profileImage.style.display = 'block';
        } else if (profileImage) {
            // Show initials if no image
            profileImage.src = '';
            profileImage.style.display = 'flex';
            profileImage.style.alignItems = 'center';
            profileImage.style.justifyContent = 'center';
            profileImage.style.backgroundColor = '#e9ecef';
            profileImage.style.color = '#6c757d';
            profileImage.style.fontWeight = '600';
            profileImage.textContent = doctorData.name ? doctorData.name.charAt(0).toUpperCase() : 'D';
        }
    }
}
