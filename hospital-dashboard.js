// Hospital Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hospitalDashboard = document.getElementById('hospitalDashboard');
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const recentAdmissions = document.getElementById('recentAdmissions');
    const staffOnDuty = document.getElementById('staffOnDuty');
    const todaysAppointments = document.getElementById('todaysAppointments');
    const navItems = document.querySelectorAll('.main-nav li');
    
    // Sample data - In a real app, this would come from an API
    const hospitalData = {
        stats: {
            totalPatients: 1245,
            totalStaff: 186,
            todayAppointments: 47,
            totalBeds: 300,
            availableBeds: 124,
            occupiedBeds: 154,
            reservedBeds: 18,
            maintenanceBeds: 4
        },
        recentAdmissions: [
            {
                id: 'ADM-2023-001',
                patientId: 'PT-1001',
                patientName: 'John Smith',
                admissionDate: '2023-06-14',
                ward: 'Cardiology - 3A',
                doctor: 'Dr. Sarah Johnson',
                status: 'Admitted'
            },
            {
                id: 'ADM-2023-002',
                patientId: 'PT-1002',
                patientName: 'Maria Garcia',
                admissionDate: '2023-06-15',
                ward: 'Orthopedics - 2B',
                doctor: 'Dr. Michael Chen',
                status: 'Admitted'
            },
            {
                id: 'ADM-2023-003',
                patientId: 'PT-1003',
                patientName: 'Robert Johnson',
                admissionDate: '2023-06-15',
                ward: 'General Surgery - 4C',
                doctor: 'Dr. Emily Davis',
                status: 'Discharged'
            }
        ],
        staff: [
            {
                id: 'DOC-001',
                name: 'Dr. Sarah Johnson',
                role: 'Cardiologist',
                department: 'Cardiology',
                shift: 'Day (8AM - 4PM)',
                status: 'On Duty'
            },
            {
                id: 'DOC-002',
                name: 'Dr. Michael Chen',
                role: 'Orthopedic Surgeon',
                department: 'Orthopedics',
                shift: 'Day (8AM - 4PM)',
                status: 'On Duty'
            },
            {
                id: 'NUR-001',
                name: 'Nurse Jane Williams',
                role: 'Head Nurse',
                department: 'Cardiology',
                shift: 'Day (7AM - 7PM)',
                status: 'On Break'
            },
            {
                id: 'TECH-001',
                name: 'Alex Johnson',
                role: 'Lab Technician',
                department: 'Laboratory',
                shift: 'Morning (6AM - 2PM)',
                status: 'On Duty'
            }
        ],
        appointments: [
            {
                id: 'APT-2023-001',
                time: '09:00 AM',
                patient: 'David Wilson',
                doctor: 'Dr. Sarah Johnson',
                department: 'Cardiology',
                status: 'Confirmed'
            },
            {
                id: 'APT-2023-002',
                time: '09:30 AM',
                patient: 'Lisa Wong',
                doctor: 'Dr. Michael Chen',
                department: 'Orthopedics',
                status: 'Confirmed'
            },
            {
                id: 'APT-2023-003',
                time: '10:00 AM',
                patient: 'James Brown',
                doctor: 'Dr. Emily Davis',
                department: 'General Surgery',
                status: 'Pending'
            },
            {
                id: 'APT-2023-004',
                time: '10:30 AM',
                patient: 'Emma Davis',
                doctor: 'Dr. Sarah Johnson',
                department: 'Cardiology',
                status: 'Confirmed'
            }
        ]
    };

    // Initialize the dashboard
    function initDashboard() {
        // Update stats
        updateStats();
        
        // Render data
        renderAdmissions();
        renderStaff();
        renderAppointments();
        
        // Setup event listeners
        setupEventListeners();
    }

    // Update statistics
    function updateStats() {
        const stats = hospitalData.stats;
        
        document.getElementById('totalPatients').textContent = stats.totalPatients.toLocaleString();
        document.getElementById('totalStaff').textContent = stats.totalStaff;
        document.getElementById('todayAppointments').textContent = stats.todayAppointments;
        document.getElementById('totalBeds').textContent = stats.totalBeds;
        document.getElementById('availableBeds').textContent = stats.availableBeds;
        
        // Update bed status counts
        document.getElementById('availableBedsCount').textContent = stats.availableBeds;
        document.getElementById('occupiedBedsCount').textContent = stats.occupiedBeds;
        document.getElementById('reservedBedsCount').textContent = stats.reservedBeds;
        document.getElementById('maintenanceBedsCount').textContent = stats.maintenanceBeds;
    }

    // Render recent admissions
    function renderAdmissions() {
        if (!recentAdmissions) return;
        
        const admissions = hospitalData.recentAdmissions;
        
        if (admissions.length === 0) {
            recentAdmissions.innerHTML = '<tr><td colspan="7" style="text-align: center;">No recent admissions found.</td></tr>';
            return;
        }
        
        const html = admissions.map(admission => `
            <tr>
                <td>${admission.patientId}</td>
                <td>${admission.patientName}</td>
                <td>${formatDate(admission.admissionDate)}</td>
                <td>${admission.ward}</td>
                <td>${admission.doctor}</td>
                <td><span class="status status-${admission.status.toLowerCase()}">${admission.status}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewAdmission('${admission.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
        
        recentAdmissions.innerHTML = html;
    }

    // Render staff on duty
    function renderStaff() {
        if (!staffOnDuty) return;
        
        const staff = hospitalData.staff;
        
        if (staff.length === 0) {
            staffOnDuty.innerHTML = '<tr><td colspan="6" style="text-align: center;">No staff data available.</td></tr>';
            return;
        }
        
        const html = staff.map(member => `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td>${member.department}</td>
                <td>${member.shift}</td>
                <td>
                    <span class="status status-${member.status.toLowerCase().replace(' ', '-')}">
                        ${member.status}
                    </span>
                </td>
            </tr>
        `).join('');
        
        staffOnDuty.innerHTML = html;
    }

    // Render today's appointments
    function renderAppointments() {
        if (!todaysAppointments) return;
        
        const appointments = hospitalData.appointments;
        
        if (appointments.length === 0) {
            todaysAppointments.innerHTML = '<tr><td colspan="6" style="text-align: center;">No appointments scheduled for today.</td></tr>';
            return;
        }
        
        const html = appointments.map(apt => `
            <tr>
                <td>${apt.time}</td>
                <td>${apt.patient}</td>
                <td>${apt.doctor}</td>
                <td>${apt.department}</td>
                <td>
                    <span class="status status-${apt.status.toLowerCase()}">
                        ${apt.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewAppointment('${apt.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
        
        todaysAppointments.innerHTML = html;
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

        // Action buttons
        const actionButtons = [
            { id: 'newAdmission', action: () => alert('Opening new admission form...') },
            { id: 'manageBeds', action: () => alert('Opening bed management...') },
            { id: 'manageStaff', action: () => alert('Opening staff management...') },
            { id: 'scheduleAppointment', action: () => alert('Opening appointment scheduler...') },
            { id: 'viewAllAdmissions', action: () => alert('Viewing all admissions...') }
        ];

        actionButtons.forEach(button => {
            const btn = document.getElementById(button.id);
            if (btn) {
                btn.addEventListener('click', button.action);
            }
        });

        // Logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Clear user session
                // In a real app, you would make an API call to log out
                window.location.href = 'index.html';
            });
        }
    }

    // Helper function to format dates
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Initialize the dashboard if we're on the hospital dashboard page
    if (hospitalDashboard) {
        initDashboard();
    }
});

// These functions would be called from the HTML
function viewAdmission(admissionId) {
    console.log(`Viewing admission ${admissionId}`);
    // In a real app, this would show a modal with admission details
    alert(`Viewing admission details for ${admissionId}`);
}

function viewAppointment(appointmentId) {
    console.log(`Viewing appointment ${appointmentId}`);
    // In a real app, this would show a modal with appointment details
    alert(`Viewing appointment details for ${appointmentId}`);
}

// Make functions available globally
window.viewAdmission = viewAdmission;
window.viewAppointment = viewAppointment;
