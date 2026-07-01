// IIM Lucknow Visitor Management System - Core Javascript Logic

// State Management
let visitors = [];

// Seed Mock Data if localStorage is empty
const seedMockData = () => {
  const storedData = localStorage.getItem('iiml_visitors');
  if (storedData) {
    visitors = JSON.parse(storedData);
    return;
  }

  // Pre-seed some realistic mock data
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const mockVisitors = [
    {
      id: 'PASS-20260701-001',
      name: 'Dr. Ramesh K. Mehta',
      phone: '9845012345',
      email: 'ramesh.mehta@gmail.com',
      purpose: 'Guest Lecture',
      hostName: 'Prof. Anjali Sinha',
      hostDept: 'Academic - PGP',
      idType: 'PAN Card',
      idNumber: 'ABCDE1234F',
      vehicle: 'DL 3C AY 4521',
      checkinTime: `${todayStr}T09:15:00`,
      checkoutTime: `${todayStr}T11:45:00`,
      status: 'checkout'
    },
    {
      id: 'PASS-20260701-002',
      name: 'Aditi Deshmukh',
      phone: '8877665544',
      email: 'aditi.d@tcs.com',
      purpose: 'Interview',
      hostName: 'Mr. Rajesh Kumar',
      hostDept: 'Human Resources',
      idType: 'Aadhaar Card',
      idNumber: '8844-3322-1100',
      vehicle: '',
      checkinTime: `${todayStr}T10:30:00`,
      checkoutTime: null,
      status: 'active'
    },
    {
      id: 'PASS-20260701-003',
      name: 'Vikram Singh',
      phone: '9001122334',
      email: 'vikram.singh@siemens.com',
      purpose: 'Vendor / Maintenance',
      hostName: 'Dr. Vivek Pathak',
      hostDept: 'IT Support & Computer Centre',
      idType: 'Driving License',
      idNumber: 'UP32 2021004561',
      vehicle: 'UP 32 KM 7890',
      checkinTime: `${todayStr}T13:10:00`,
      checkoutTime: null,
      status: 'active'
    }
  ];

  localStorage.setItem('iiml_visitors', JSON.stringify(mockVisitors));
  visitors = mockVisitors;
};

// DOM Elements
const elements = {
  // Live Clock
  currentDate: document.getElementById('current-date'),
  currentTime: document.getElementById('current-time'),
  
  // Dashboard Counters
  countActive: document.getElementById('count-active'),
  countToday: document.getElementById('count-today'),
  countCheckout: document.getElementById('count-checkout'),
  
  // Form
  checkinForm: document.getElementById('checkin-form'),
  visitorName: document.getElementById('visitor-name'),
  visitorPhone: document.getElementById('visitor-phone'),
  visitorEmail: document.getElementById('visitor-email'),
  visitorPurpose: document.getElementById('visitor-purpose'),
  hostName: document.getElementById('host-name'),
  hostDept: document.getElementById('host-dept'),
  visitorIdType: document.getElementById('visitor-id-type'),
  visitorIdNumber: document.getElementById('visitor-id-number'),
  visitorVehicle: document.getElementById('visitor-vehicle'),
  
  // Filters & Search
  logSearch: document.getElementById('log-search'),
  filterStatus: document.getElementById('log-filter-status'),
  tableBody: document.getElementById('logs-table-body'),
  
  // Modal (Pass details)
  passModal: document.getElementById('pass-modal'),
  modalOverlay: document.getElementById('modal-overlay'),
  btnCloseModal: document.getElementById('btn-modal-close'),
  btnPrintPass: document.getElementById('btn-print-pass'),
  btnClosePass: document.getElementById('btn-close-pass'),
  
  passVisitorName: document.getElementById('pass-visitor-name'),
  passVisitorPhone: document.getElementById('pass-visitor-phone'),
  passHostName: document.getElementById('pass-host-name'),
  passPurpose: document.getElementById('pass-purpose'),
  passCheckinTime: document.getElementById('pass-checkin-time'),
  passCheckoutRow: document.getElementById('pass-checkout-row'),
  passCheckoutTime: document.getElementById('pass-checkout-time'),
  passIdDetails: document.getElementById('pass-id-details'),
  passVehicleRow: document.getElementById('pass-vehicle-row'),
  passVehicle: document.getElementById('pass-vehicle'),
  passStatusBadge: document.getElementById('pass-status-badge'),
  passIdDisplay: document.getElementById('pass-id-display'),
  
  // Toast notifications
  toastContainer: document.getElementById('toast-container'),
  
  // Sidebar navigation options
  navDashboard: document.getElementById('nav-dashboard'),
  navNewVisitor: document.getElementById('nav-new-visitor'),
  navHistory: document.getElementById('nav-history'),

  // Mobile drawer
  sidebar: document.getElementById('sidebar'),
  sidebarBackdrop: document.getElementById('sidebar-backdrop'),
  sidebarClose: document.getElementById('sidebar-close'),
  menuToggle: document.getElementById('menu-toggle')
};

// Update Date & Clock
const updateClock = () => {
  const now = new Date();
  
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  elements.currentDate.textContent = now.toLocaleDateString('en-US', dateOptions);
  
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  elements.currentTime.textContent = now.toLocaleTimeString('en-US', timeOptions);
};

// Format Date string for view
const formatPassDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const options = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  };
  return date.toLocaleDateString('en-IN', options).replace(/,/g, '');
};

// Calculate and Update Stats Cards
const updateStats = () => {
  const activeCount = visitors.filter(v => v.status === 'active').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = visitors.filter(v => v.checkinTime.startsWith(todayStr)).length;
  
  const checkoutCount = visitors.filter(v => 
    v.status === 'checkout' && 
    v.checkoutTime && 
    v.checkoutTime.startsWith(todayStr)
  ).length;

  elements.countActive.textContent = activeCount;
  elements.countToday.textContent = todayCount;
  elements.countCheckout.textContent = checkoutCount;
};

// Render Table Logs
const renderLogsTable = () => {
  const searchQuery = elements.logSearch.value.trim().toLowerCase();
  const filterVal = elements.filterStatus.value;
  
  elements.tableBody.innerHTML = '';
  
  const filteredVisitors = visitors.filter(v => {
    // Search Filter
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery) ||
      v.phone.includes(searchQuery) ||
      v.hostName.toLowerCase().includes(searchQuery) ||
      v.id.toLowerCase().includes(searchQuery);
      
    // Status Filter
    let matchesStatus = true;
    if (filterVal === 'active') {
      matchesStatus = (v.status === 'active');
    } else if (filterVal === 'checkout') {
      matchesStatus = (v.status === 'checkout');
    }
    
    return matchesSearch && matchesStatus;
  });

  if (filteredVisitors.length === 0) {
    elements.tableBody.innerHTML = `
      <tr class="empty-state">
        <td colspan="7">No matching visitor records found.</td>
      </tr>
    `;
    return;
  }

  // Sort: Active first, then latest check-ins first
  filteredVisitors.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'active' ? -1 : 1;
    }
    return new Date(b.checkinTime) - new Date(a.checkinTime);
  });

  filteredVisitors.forEach(v => {
    const tr = document.createElement('tr');
    
    const statusText = v.status === 'active' ? 'On campus' : 'Departed';
    const statusClass = v.status === 'active' ? 'active' : 'checkout';
    
    tr.innerHTML = `
      <td class="pass-id-cell" data-label="Pass">${v.id}</td>
      <td data-label="Visitor">
        <div class="visitor-name-cell">${v.name}</div>
        <div class="visitor-contact-cell">${v.email || 'No Email'}</div>
      </td>
      <td class="visitor-contact-cell" data-label="Mobile">+91 ${v.phone}</td>
      <td data-label="Host">
        <div class="host-cell">${v.hostName}</div>
        <span class="dept-tag">${v.hostDept}</span>
      </td>
      <td class="time-cell" data-label="Arrived">${formatPassDate(v.checkinTime)}</td>
      <td data-label="State">
        <span class="badge ${statusClass}">${statusText}</span>
      </td>
      <td class="actions-cell" data-label="Do">
        ${v.status === 'active' ? `
          <button class="btn-table-action btn-table-checkout" onclick="checkoutVisitor('${v.id}')">
            Check out
          </button>
        ` : ''}
        <button class="btn-table-action btn-table-pass" onclick="viewPassDetails('${v.id}')">
          Pass
        </button>
      </td>
    `;
    
    elements.tableBody.appendChild(tr);
  });
};

// Display Toast Alert
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;
  elements.toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 50);
  
  // Remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Check-In Submissions
const handleCheckInSubmit = (e) => {
  e.preventDefault();
  
  const name = elements.visitorName.value.trim();
  const phone = elements.visitorPhone.value.trim();
  const email = elements.visitorEmail.value.trim();
  const purpose = elements.visitorPurpose.value;
  const hostName = elements.hostName.value.trim();
  const hostDept = elements.hostDept.value;
  const idType = elements.visitorIdType.value;
  const idNumber = elements.visitorIdNumber.value.trim();
  const vehicle = elements.visitorVehicle.value.trim().toUpperCase();
  
  // Validation
  if (!name || !phone || !purpose || !hostName || !hostDept || !idType || !idNumber) {
    showToast('Please fill in all mandatory fields.', 'info');
    return;
  }
  
  // Generate Unique ID
  const today = new Date();
  const dateStr = today.getFullYear() + 
    String(today.getMonth() + 1).padStart(2, '0') + 
    String(today.getDate()).padStart(2, '0');
  
  const dailyCount = visitors.filter(v => v.id.includes(`PASS-${dateStr}`)).length;
  const nextSeq = String(dailyCount + 1).padStart(3, '0');
  const passId = `PASS-${dateStr}-${nextSeq}`;
  
  // Construct Visitor Object
  const newVisitor = {
    id: passId,
    name,
    phone,
    email,
    purpose,
    hostName,
    hostDept,
    idType,
    idNumber,
    vehicle,
    checkinTime: today.toISOString(),
    checkoutTime: null,
    status: 'active'
  };
  
  // Update state & store
  visitors.unshift(newVisitor);
  localStorage.setItem('iiml_visitors', JSON.stringify(visitors));
  
  // Reset Form
  elements.checkinForm.reset();
  
  // Render updates
  updateStats();
  renderLogsTable();
  
  showToast(`Check-In successful for ${name}. Pass ID generated!`, 'success');
  
  // Auto open the pass in modal
  viewPassDetails(passId);
};

// Check-Out Visitor
window.checkoutVisitor = (passId) => {
  const index = visitors.findIndex(v => v.id === passId);
  if (index === -1) return;
  
  visitors[index].status = 'checkout';
  visitors[index].checkoutTime = new Date().toISOString();
  
  localStorage.setItem('iiml_visitors', JSON.stringify(visitors));
  
  updateStats();
  renderLogsTable();
  
  showToast(`${visitors[index].name} has checked out successfully.`, 'success');
};

// Modal Operations: View Pass
window.viewPassDetails = (passId) => {
  const visitor = visitors.find(v => v.id === passId);
  if (!visitor) return;
  
  // Populate fields
  elements.passVisitorName.textContent = visitor.name;
  elements.passVisitorPhone.textContent = `+91 ${visitor.phone}`;
  elements.passHostName.textContent = `${visitor.hostName} (${visitor.hostDept})`;
  elements.passPurpose.textContent = visitor.purpose;
  elements.passCheckinTime.textContent = formatPassDate(visitor.checkinTime);
  elements.passIdDisplay.textContent = visitor.id;
  
  // Check Government ID privacy mask
  let maskId = visitor.idNumber;
  if (maskId.length > 4) {
    maskId = 'X'.repeat(maskId.length - 4) + maskId.slice(-4);
  }
  elements.passIdDetails.textContent = `${visitor.idType} (${maskId})`;
  
  // Check-out time handling
  if (visitor.status === 'checkout') {
    elements.passCheckoutTime.textContent = formatPassDate(visitor.checkoutTime);
    elements.passCheckoutRow.style.display = 'flex';
    elements.passStatusBadge.textContent = 'Departed';
    elements.passStatusBadge.className = 'pass-badge out';
  } else {
    elements.passCheckoutRow.style.display = 'none';
    elements.passStatusBadge.textContent = 'On campus';
    elements.passStatusBadge.className = 'pass-badge';
  }
  
  // Vehicle details
  if (visitor.vehicle) {
    elements.passVehicle.textContent = visitor.vehicle;
    elements.passVehicleRow.style.display = 'flex';
  } else {
    elements.passVehicleRow.style.display = 'none';
  }
  
  // Show Modal
  elements.passModal.classList.add('show');
};

// Close Modal
const closeModal = () => {
  elements.passModal.classList.remove('show');
};

// Scroll to registration helper
const navigateToSection = (targetId) => {
  if (targetId === 'form-panel-container') {
    const el = document.getElementById(targetId);
    el.scrollIntoView({ behavior: 'smooth' });
    // Visual flash effect on the form container
    el.style.borderColor = 'var(--primary-gold)';
    setTimeout(() => {
      el.style.borderColor = 'var(--border-color)';
    }, 1000);
  } else if (targetId === 'logs-table') {
    const el = document.querySelector('.log-panel');
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

// Mobile drawer controls
const openDrawer = () => {
  elements.sidebar.classList.add('open');
  elements.sidebarBackdrop.classList.add('show');
  elements.menuToggle.classList.add('active');
  elements.menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
};

const closeDrawer = () => {
  elements.sidebar.classList.remove('open');
  elements.sidebarBackdrop.classList.remove('show');
  elements.menuToggle.classList.remove('active');
  elements.menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

// Event Listeners Setup
const setupEventListeners = () => {
  // Form submit
  elements.checkinForm.addEventListener('submit', handleCheckInSubmit);

  // Mobile drawer toggles
  elements.menuToggle.addEventListener('click', () => {
    elements.sidebar.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  elements.sidebarBackdrop.addEventListener('click', closeDrawer);
  elements.sidebarClose.addEventListener('click', closeDrawer);

  // Escape closes drawer or modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.sidebar.classList.contains('open')) closeDrawer();
      if (elements.passModal.classList.contains('show')) closeModal();
    }
  });

  // Reset drawer state when resizing up to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && elements.sidebar.classList.contains('open')) {
      closeDrawer();
    }
  });
  // Search & Filters inputs
  elements.logSearch.addEventListener('input', renderLogsTable);
  elements.filterStatus.addEventListener('change', renderLogsTable);
  
  // Modal Close triggers
  elements.btnCloseModal.addEventListener('click', closeModal);
  elements.modalOverlay.addEventListener('click', closeModal);
  elements.btnClosePass.addEventListener('click', closeModal);
  
  // Print Trigger
  elements.btnPrintPass.addEventListener('click', () => {
    window.print();
  });
  
  // Sidebar navigation actions
  elements.navDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    elements.navDashboard.classList.add('active');
    elements.navNewVisitor.classList.remove('active');
    elements.navHistory.classList.remove('active');
    elements.filterStatus.value = 'active';
    renderLogsTable();
    closeDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  elements.navNewVisitor.addEventListener('click', (e) => {
    e.preventDefault();
    elements.navDashboard.classList.remove('active');
    elements.navNewVisitor.classList.add('active');
    elements.navHistory.classList.remove('active');
    closeDrawer();
    navigateToSection('form-panel-container');
  });

  elements.navHistory.addEventListener('click', (e) => {
    e.preventDefault();
    elements.navDashboard.classList.remove('active');
    elements.navNewVisitor.classList.remove('active');
    elements.navHistory.classList.add('active');
    elements.filterStatus.value = 'all'; // Show all in history
    renderLogsTable();
    closeDrawer();
    navigateToSection('logs-table');
  });
};

// Initialization
const init = () => {
  seedMockData();
  setupEventListeners();
  updateClock();
  setInterval(updateClock, 1000); // Keep clock ticking
  updateStats();
  renderLogsTable();
};

// Start application
document.addEventListener('DOMContentLoaded', init);
