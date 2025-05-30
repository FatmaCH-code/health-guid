// Initialize EmailJS with your User ID
emailjs.init('A4HVxPE7kGwaCjhAL');
// Notification system
// Replace the existing showNotification function with this:
function showNotification(message, isSuccess) {
  // Remove any existing notifications first
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} notification-icon"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add show class to trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto-remove after 5 seconds
  const timer = setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 5000);
  
  // Handle close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    clearTimeout(timer);
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  });
}
// Global variable to store appointment data between form steps
let appointmentData = null;
const doctors = [
    {
      name: "Dr. Amira Abbassi",
      specialty: "cardiologist",
      city: "biskra",
      image: "https://i.pinimg.com/736x/f8/3f/a3/f83fa33fb6c902281d6756fa1a5e63e8.jpg",
      lat: 34.8456,
      lon: 5.7284,
      phone: "123-456-7890",
      address: "123 Health Street, Biskra",
      cv: "https://drive.google.com/file/d/1MkAToWxl5Yv1vzVN9yP0lsVNZPskkW5n/view?usp=drive_link" 
    },
    {
      name: "Dr. Abdelrahmane Mekihal",
      specialty: "cardiologist",
      city: "biskra",
      image: "https://i.pinimg.com/736x/f8/3f/a3/f83fa33fb6c902281d6756fa1a5e63e8.jpg",
      lat: 34.8500,
      lon: 5.7333,
      phone: "234-567-8901",
      address: "456 Heart Avenue, Biskra",
      cv: "https://drive.google.com/file/d/1J1LqcPTVqsRF0zWhotbgSPJtE7OUDxU5/view?usp=drive_link" 
    },
    {
      name: "Dr. Gherbi",
      specialty: "dentist",
      city: "biskra",
      image: "https://i.pinimg.com/736x/2a/24/d5/2a24d5b16ee2cab66316df8207c4d6b9.jpg",
      lat: 34.8500,
      lon: 5.7333,
      phone: "456-789-0123",
      address: "789 Dental Boulevard, Biskra",
      cv: "https://drive.google.com/file/d/15FJz67OcdP39CQIcWvCekO6-uAVyVFKn/view?usp=drive_link" 
    },
    {
      name: "Dr. Merabet Mohamed",
      specialty: "dentist",
      city: "biskra",
      image: "https://i.pinimg.com/736x/2a/24/d5/2a24d5b16ee2cab66316df8207c4d6b9.jpg",
      lat: 35.068447,
      lon: 5.845473,
      phone: "567-890-1234",
      address: "321 Smile Lane, Biskra",
      cv: "https://drive.google.com/file/d/1Ddl0pWpOX4CqUUa3-iD44srKzP2oCHkP/view?usp=drive_link" 
    },
    {
      name: "Dr. Nadia Amrani",
      specialty: "dermatologist",
      city: "biskra",
      image: "https://i.pinimg.com/736x/c5/a3/22/c5a322c1ecad5c733f38c5df53ee2bff.jpg",
      lat: 34.87,
      lon: 5.72,
      phone: "567-890-1234",
      address: "654 Skin Care Road, Biskra",
      cv: "https://drive.google.com/file/d/1PdkARYPbb0HB4gYABtgoza0rY7LTZA0f/view?usp=drive_link" 
    },
    {
      name: "Dr. Karim Ben Ammar",
      specialty: "orthopedic",
      city: "biskra",
      image: "https://i.pinimg.com/736x/b0/13/15/b01315c9f14b949a1e1a2f527139de33.jpg",
      lat: 34.85,
      lon: 5.76,
      phone: "567-890-1234",
      address: "987 Bone Health Avenue, Biskra",
      cv: "https://drive.google.com/file/d/1pxDHbWoTERNcOTabRdxPDgem4LvimHvE/view?usp=drive_link" 
    }
  ];
  
  


// Distance Calculation
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Doctor Search Form
document.getElementById('doctor-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const selectedSpecialty = document.getElementById('specialty-select').value;
  const container = document.getElementById('doctor-results');
  container.innerHTML = '';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      const filteredDoctors = doctors
        .filter(doc => doc.specialty === selectedSpecialty)
        .map(doc => {
          doc.distance = haversineDistance(userLat, userLon, doc.lat, doc.lon);
          return doc;
        })
        .sort((a, b) => a.distance - b.distance);

      if (filteredDoctors.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No doctors found for this specialty.</p>';
        return;
      }

      filteredDoctors.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.innerHTML = `
          <img src="${doc.image}" alt="${doc.name}">
          <div class="doctor-info">
            <h3>${doc.name}</h3>
            <p>Specialty: ${doc.specialty}</p>
            <p>Phone: ${doc.phone}</p>
            <p>Address: ${doc.address}</p>
            <p class="distance">${doc.distance.toFixed(2)} km away</p>
            <div class="doctor-actions">
              <button class="appointment-button" data-doctor="${doc.name}">Make Appointment</button>
              <a href="${doc.cv}" target="_blank" class="appointment-button" style="background-color: #2b7a78;">View CV</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }, error => {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Could not get your location. Showing all doctors.</p>';
      doctors
        .filter(doc => doc.specialty === selectedSpecialty)
        .forEach(doc => {
          const card = document.createElement('div');
          card.className = 'doctor-card';
          card.innerHTML = `
            <img src="${doc.image}" alt="${doc.name}">
            <div class="doctor-info">
              <h3>${doc.name}</h3>
              <p>Specialty: ${doc.specialty}</p>
              <p>Phone: ${doc.phone}</p>
              <p>Address: ${doc.address}</p>
              <div class="doctor-actions">
                <button class="appointment-button" data-doctor="${doc.name}">Make Appointment</button>
                <a href="${doc.cv}" target="_blank" class="appointment-button" style="background-color: #2b7a78;">View CV</a>
              </div>
            </div>
          `;
          container.appendChild(card);
        });
    });
  } else {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Geolocation not supported. Showing all doctors.</p>';
    doctors
      .filter(doc => doc.specialty === selectedSpecialty)
      .forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.innerHTML = `
          <img src="${doc.image}" alt="${doc.name}">
          <div class="doctor-info">
            <h3>${doc.name}</h3>
            <p>Specialty: ${doc.specialty}</p>
            <p>Phone: ${doc.phone}</p>
            <p>Address: ${doc.address}</p>
            <div class="doctor-actions">
              <button class="appointment-button" data-doctor="${doc.name}">Make Appointment</button>
              <a href="${doc.cv}" target="_blank" class="appointment-button" style="background-color: #2b7a78;">View CV</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
  }
});

// Load all doctors in Doctors section
function loadAllDoctors() {
  const container = document.getElementById('all-doctors');
  container.innerHTML = '';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      const doctorsWithDistance = doctors.map(doc => {
        return {
          ...doc,
          distance: haversineDistance(userLat, userLon, doc.lat, doc.lon)
        };
      });

      doctorsWithDistance.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.innerHTML = `
          <img src="${doc.image}" alt="${doc.name}">
          <div class="doctor-info">
            <h3>${doc.name}</h3>
            <p>Specialty: ${doc.specialty}</p>
            <p>Phone: ${doc.phone}</p>
            <p>Address: ${doc.address}</p>
            <p class="distance">${doc.distance.toFixed(2)} km away</p>
            <div class="doctor-actions">
              <button class="appointment-button" data-doctor="${doc.name}">Make Appointment</button>
              <a href="${doc.cv}" target="_blank" class="appointment-button" style="background-color: #2b7a78;">View CV</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }, error => {
      displayDoctorsWithoutDistance(container);
    });
  } else {
    displayDoctorsWithoutDistance(container);
  }
}

function displayDoctorsWithoutDistance(container) {
  doctors.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
      <img src="${doc.image}" alt="${doc.name}">
      <div class="doctor-info">
        <h3>${doc.name}</h3>
        <p>Specialty: ${doc.specialty}</p>
        <p>Phone: ${doc.phone}</p>
        <p>Address: ${doc.address}</p>
        <div class="doctor-actions">
          <button class="appointment-button" data-doctor="${doc.name}">Make Appointment</button>
          <a href="${doc.cv}" target="_blank" class="appointment-button" style="background-color: #2b7a78;">View CV</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Handle appointment button clicks
// Handle appointment button clicks
document.addEventListener('click', function(e) {
  // Handle appointment buttons (only for BUTTON elements)
  if (e.target.classList.contains('appointment-button') && e.target.tagName === 'BUTTON') {
    e.preventDefault();
    
    const doctorName = e.target.getAttribute('data-doctor');
    if (doctorName) {
      // Check if user is logged in
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!currentUser) {
        showNotification('Please login first to book an appointment', false);
        document.querySelector('.auth-container').style.display = 'flex';
        document.getElementById('login-card').classList.remove('hidden');
        return;
      }
      
      // If logged in, proceed with booking
      selectedDoctor = doctors.find(doc => doc.name === doctorName);
      document.getElementById('appointment-section').classList.add('active');
    }
  }
  
  // Let CV buttons (A elements with class 'appointment-button') work normally
  // No need for specific handling since they're regular links
});
// Slideshow functionality
const slidesEl = document.getElementById('slides');
const dots = document.querySelectorAll('.dot');
const totalSlides = dots.length;
let index = 0;

function goToSlide(i) {
  index = i % totalSlides;
  if (index < 0) index += totalSlides;
  slidesEl.style.transform = 'translateX(-' + (100 / totalSlides) * index + '%)';
  dots.forEach((d, j) => d.classList.toggle('active', j === index));
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => goToSlide(i));
});

// Navigation system
function setupNavigation() {
  const navLinks = document.querySelectorAll('.navbar nav a');
  const sections = document.querySelectorAll('.page-section');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      
      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Show target section
      sections.forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Your message has been sent! A doctor will contact you soon.');
  this.reset();
});

// Initialize Flatpickr calendar
flatpickr("#appointment-date", {
  altInput: true,
  altFormat: "F j, Y",
  dateFormat: "Y-m-d",
  minDate: "today"
});

// Handle consultation type & time slot selection
document.querySelectorAll('.consultation-type').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.consultation-type').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

document.querySelectorAll('.time-slot').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Handle Continue button click
document.querySelector('.continue-btn').addEventListener('click', function(e) {
  e.preventDefault();
 
  // Get selected values
  const selectedDate = document.getElementById('appointment-date').value;
  const selectedTime = document.querySelector('.time-slot.selected')?.textContent;
  const selectedType = document.querySelector('.consultation-type.selected')?.textContent.split('\n')[0];
 
  if (!selectedDate || !selectedTime || !selectedType) {
    alert('Please select date, time and consultation type');
    return;
  }
 
  // Hide appointment section and show continue form
  document.getElementById('appointment-section').classList.remove('active');
  document.getElementById('continue-form').classList.add('active');
});

// Medical Questions Data
const medicalQuestions = {
  cardiologist: [
    "Have you ever undergone heart surgery?",
    "Do you experience difficulty breathing while walking or exerting effort?",
    "Do you frequently feel chest pain?",
    "Have you ever had a heart attack?",
    "Do you take daily medications for heart conditions?",
    "Do you suffer from high blood pressure?",
    "Do you feel abnormal heart palpitations?",
    "Is there a family history of heart disease?",
    "Do you undergo regular medical check-ups for your heart?",
    "Do you experience swelling in your legs or hands?"
  ],
  dentist: [
    "Do you brush your teeth with toothpaste at least twice a day?",
    "Do you regularly use dental floss or interdental cleaning tools?",
    "Do you experience gum bleeding when brushing your teeth?",
    "Do you feel pain or sensitivity when consuming cold or hot foods?",
    "Do you suffer from frequent bad breath?",
    "Have you visited a dentist in the past 12 months?",
    "Do you have visible tooth decay or cavities?",
    "Have you lost any permanent teeth due to decay or infection?",
    "Do you regularly use mouthwash?",
    "Have you ever undergone root canal treatment or deep fillings?"
  ],
  dermatologist: [
    "Do you suffer from frequent skin itching?",
    "Have you noticed sudden or recurring skin rashes?",
    "Do you experience severe skin dryness?",
    "Do you have unusual dark or light patches on your skin?",
    "Have you ever had eczema or psoriasis?",
    "Do you chronically experience acne or pimples?",
    "Do you suffer from excessive hair loss?",
    "Have you ever felt a burning or tingling sensation on your skin without a clear reason?",
    "Have you had a fungal or bacterial skin infection?",
    "Do you use topical medications or creams to treat skin conditions?"
  ],
  orthopedic: [
    "Do you suffer from persistent joint or bone pain?",
    "Do you feel joint stiffness when waking up in the morning?",
    "Have you ever had a bone fracture?",
    "Do you experience back or neck pain?",
    "Have you been diagnosed with osteoporosis or calcium deficiency?",
    "Do you have difficulty moving or walking long distances?",
    "Is there a family history of bone or joint diseases?",
    "Do you regularly take calcium or vitamin D supplements?",
    "Have you ever been diagnosed with arthritis?",
    "Do you engage in regular physical activity or exercise?"
  ]
};

function loadMedicalQuestions(specialty) {
  const container = document.getElementById('questions-container');
  container.innerHTML = '';
  
  const questions = medicalQuestions[specialty] || [];
  
  questions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
      <div class="question-text">${question}</div>
      <div class="options">
        <div class="option">
          <input type="radio" id="q${index}-yes" name="q${index}" value="yes">
          <label for="q${index}-yes">Yes</label>
        </div>
        <div class="option">
          <input type="radio" id="q${index}-no" name="q${index}" value="no" checked>
          <label for="q${index}-no">No</label>
        </div>
      </div>
    `;
    container.appendChild(questionDiv);
  });
}

let selectedDoctor = null;

document.querySelector('.continue-btnn').addEventListener('click', function(e) {
  e.preventDefault();
  
  // Validate form fields
  if (!validatePatientForm()) return;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  // Store the appointment data
  appointmentData = {
    firstName: document.getElementById('first-name').value,
    lastName: document.getElementById('last-name').value,
    age: document.getElementById('age').value,
    phone: document.getElementById('phone').value,
    email: currentUser ? currentUser.email : document.getElementById('email').value,
    date: document.getElementById('appointment-date').value,
    time: document.querySelector('.time-slot.selected').textContent,
    type: document.querySelector('.consultation-type.selected').textContent.split('\n')[0],
    doctor: selectedDoctor.name,
    specialty: selectedDoctor.specialty,
    doctor_phone: selectedDoctor.phone,
    doctor_address: selectedDoctor.address
  };
  
  // Load questions based on doctor's specialty
  if (selectedDoctor) {
    loadMedicalQuestions(selectedDoctor.specialty);
    
    // Show medical questions section
    document.getElementById('continue-form').classList.remove('active');
    document.getElementById('medical-questions').classList.add('active');
  } else {
    alert('No doctor selected');
  }
});

function validatePatientForm() {
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const age = document.getElementById('age').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  
  if (!firstName || !lastName || !age || !phone || !email) {
    alert('Please fill all required fields');
    return false;
  }
  
  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address');
    return false;
  }
  
  return true;
}

// Handle form submission
document.getElementById('patient-info-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Prepare template parameters for admin notification
  const adminTemplateParams = {
    to_name: "Medical Team",
    from_name: `${appointmentData.firstName} ${appointmentData.lastName}`,
    from_email: appointmentData.email,
    patient_name: `${appointmentData.firstName} ${appointmentData.lastName}`,
    patient_age: appointmentData.age,
    patient_phone: appointmentData.phone,
    doctor_name: appointmentData.doctor,
    doctor_specialty: appointmentData.specialty,
    appointment_date: appointmentData.date,
    appointment_time: appointmentData.time,
    consultation_type: appointmentData.type,
    date_sent: new Date().toLocaleString()
  };

  // Send email via EmailJS
  emailjs.send('service_0wnny9s', 'template_tdvue49', adminTemplateParams)
    .then(function(response) {
      console.log('Admin notification sent!', response.status, response.text);
     // Save appointment to local storage
     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
     if (currentUser) {
       appointmentData.email = currentUser.email; // Ensure email matches logged in user
     }
     saveAppointmentToLocal(appointmentData);
      // Now send patient confirmation
      const patientTemplateParams = {
        to_name: `${appointmentData.firstName} ${appointmentData.lastName}`,
        to_email: appointmentData.email,
        doctor_name: appointmentData.doctor,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
        contact_email: "contact@biskrahealth.com"
      };
      
      return emailjs.send('service_0wnny9s', 'template_wxiespf', patientTemplateParams);
    })
    .then(function(response) {
      console.log('Patient confirmation sent!', response.status, response.text);
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        const existingDropdown = document.querySelector('.profile-dropdown-container');
        if (existingDropdown) {
          showProfileDropdown(currentUser);
        }
      }
      
      showNotification('Appointment confirmed! You will receive a confirmation email shortly.', true);
      alert('Appointment confirmed! You will receive a confirmation email shortly.');
      

      // Reset form and go back to home
      e.target.reset();
      document.querySelector('a[href="#home"]').click();
    })
    .catch(function(error) {
      console.log('Email failed to send:', error);
      alert('Appointment was saved but we couldn\'t send the confirmation email. Please note your appointment details.');
      e.target.reset();
      document.querySelector('a[href="#home"]').click();
    });
    
});
function saveAppointmentToLocal(appointmentData) {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      // Ensure email matches logged-in user
      appointmentData.email = currentUser.email;
      console.log('Saved appointment with email:', appointmentData.email);
    } else {
      console.warn('No current user found when saving appointment');
    }
    
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    console.log('Existing appointments before save:', appointments);
    
    appointments.push(appointmentData);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    console.log('Appointment saved successfully:', appointmentData);
  } catch (e) {
    console.error('Error saving appointment:', e);
    localStorage.setItem('appointments', JSON.stringify([appointmentData]));
  }
}

// Handle medical questions submission
document.querySelector('.submit-questions').addEventListener('click', function() {
  if (!appointmentData) {
    showNotification('No appointment data found. Please start over.', false);
    return;
  }

  // Show loading state
  const submitBtn = this;
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

  // Collect all medical question answers
  const questions = document.querySelectorAll('.question');
  const questionAnswers = {};
  
  questions.forEach((question, index) => {
    const questionText = question.querySelector('.question-text').textContent;
    const answer = question.querySelector('input[type="radio"]:checked')?.value || 'not answered';
    questionAnswers[`Q${index+1}`] = `${questionText} - Answer: ${answer}`;
  });

  // Format questions for email
  let formattedQuestions = "MEDICAL QUESTIONNAIRE ANSWERS:\n\n";
  for (const [key, value] of Object.entries(questionAnswers)) {
    formattedQuestions += `${key}: ${value}\n\n`;
  }

  // Prepare template parameters
  const templateParams = {
    to_name: "Medical Team",
    from_name: `${appointmentData.firstName} ${appointmentData.lastName}`,
    from_email: appointmentData.email,
    patient_name: `${appointmentData.firstName} ${appointmentData.lastName}`,
    patient_age: appointmentData.age,
    patient_phone: appointmentData.phone,
    doctor_name: appointmentData.doctor,
    doctor_specialty: appointmentData.specialty,
    appointment_date: appointmentData.date,
    appointment_time: appointmentData.time,
    consultation_type: appointmentData.type,
    medical_questions: formattedQuestions,
    date_sent: new Date().toLocaleString()
  };

  // Send email via EmailJS
  emailjs.send('service_0wnny9s', 'template_tdvue49', templateParams)
    .then(function(response) {
      console.log('Email sent successfully!', response.status, response.text);
      showNotification('Appointment confirmed! we will call you as soon as we can ', true);
      
      // Send patient confirmation (optional second email)
      const patientParams = {
        to_name: templateParams.patient_name,
        to_email: templateParams.from_email,
        doctor_name: templateParams.doctor_name,
        appointment_date: templateParams.appointment_date,
        appointment_time: templateParams.appointment_time,
        contact_email: "contact@biskrahealth.com"
      };
      
      return emailjs.send('service_0wnny9s', 'template_wxiespf', patientParams);
    })
    .then(function() {
      // Reset form and go to home
      document.getElementById('patient-info-form').reset();
      document.querySelector('a[href="#home"]').click();
    })
    .catch(function(error) {
      console.error('Email failed to send:', error);
      showNotification('Failed to send confirmation. Please note your appointment details.', false);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
});
// Doctor Details Modal
const doctorModal = document.getElementById('doctor-modal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close-modal');

// Doctor ratings system
let doctorRatings = JSON.parse(localStorage.getItem('doctorRatings')) || {
  "Dr. Amira Abbassi": {
    average: 4.5,
    count: 12,
    reviews: [
      { email: "patient1@example.com", rating: 5, comment: "Excellent and professional doctor", date: "2023-05-15" },
      { email: "patient2@example.com", rating: 4, comment: "Good but long waiting time", date: "2023-04-22" }
    ]
  }
};

function saveRatingsToStorage() {
  localStorage.setItem('doctorRatings', JSON.stringify(doctorRatings));
}

function getDoctorRatings(doctorName) {
  if (!doctorRatings[doctorName]) {
    doctorRatings[doctorName] = { 
      average: 0, 
      count: 0, 
      reviews: [] 
    };
    saveRatingsToStorage();
  }
  return doctorRatings[doctorName];
}

function addDoctorReview(doctorName, email, rating, comment) {
  const ratings = getDoctorRatings(doctorName);
  
  // Add new review
  const newReview = {
    email,
    rating: parseInt(rating),
    comment,
    date: new Date().toISOString().split('T')[0]
  };
  ratings.reviews.unshift(newReview);
  
  // Update average rating
  const sum = ratings.reviews.reduce((acc, curr) => acc + curr.rating, 0);
  ratings.average = sum / ratings.reviews.length;
  ratings.count = ratings.reviews.length;
  
  saveRatingsToStorage();
  return ratings;
}

document.addEventListener('click', function(e) {
  // Check if clicking directly on doctor image
  if (e.target.classList.contains('doctor-card') || 
      (e.target.tagName === 'IMG' && e.target.closest('.doctor-card'))) {
    const doctorCard = e.target.closest('.doctor-card');
    const doctorName = doctorCard.querySelector('h3').textContent;
    const doctor = doctors.find(d => d.name === doctorName);
    
    if (doctor) {
      openDoctorModal(doctor);
    }
  }
});

function openDoctorModal(doctor) {
  const ratings = getDoctorRatings(doctor.name);
  
  document.getElementById('doctor-details-content').innerHTML = `
    <div class="doctor-image">
      <img src="${doctor.image}" alt="${doctor.name}">
    </div>
    <div class="doctor-info-details">
      <h2>${doctor.name}</h2>
      <p class="doctor-specialty">Specialty: ${getSpecialtyName(doctor.specialty)}</p>
      <p class="doctor-experience">Years of experience: ${Math.floor(Math.random() * 15) + 5} years</p>
      <p class="doctor-phone">Phone: ${doctor.phone}</p>
      <p class="doctor-address">Address: ${doctor.address}</p>
      <div class="doctor-bio">
        <p>Specialist in ${getSpecialtyName(doctor.specialty)} with years of experience in diagnosing and treating complex cases. Board certified in his specialty from University of Algiers.</p>
      </div>
      
      <div class="ratings-section">
        <div class="rating-summary">
          <div class="average-rating">${ratings.average.toFixed(1)}</div>
          <div>
            <div class="rating-stars">${getStarRating(ratings.average)}</div>
            <span class="rating-count">${ratings.count} ratings</span>
          </div>
        </div>
        
        <div class="rating-form">
          <h3>Add your rating</h3>
          <form id="rating-form">
            <div class="stars-rating">
              <input type="radio" id="star5" name="rating" value="5" />
              <label for="star5">★</label>
              <input type="radio" id="star4" name="rating" value="4" />
              <label for="star4">★</label>
              <input type="radio" id="star3" name="rating" value="3" />
              <label for="star3">★</label>
              <input type="radio" id="star2" name="rating" value="2" />
              <label for="star2">★</label>
              <input type="radio" id="star1" name="rating" value="1" />
              <label for="star1">★</label>
            </div>
            <input type="email" id="reviewer-email" placeholder="Your email" required>
            <textarea class="comment-input" placeholder="Write your comment here..." required></textarea>
            <button type="submit" class="submit-rating">Submit Rating</button>
          </form>
        </div>
        
        <div class="reviews-list">
          <h3>Patient Reviews (${ratings.count})</h3>
          ${ratings.reviews.length > 0 ? 
            ratings.reviews.map(review => `
              <div class="review-item">
                <div class="review-header">
                  <span class="review-author">${review.email.split('@')[0]}***</span>
                  <span class="review-date">${review.date}</span>
                </div>
                <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <div class="review-text">${review.comment}</div>
              </div>
            `).join('') : 
            '<p>No reviews yet. Be the first to rate this doctor!</p>'}
        </div>
      </div>
    </div>
  `;
  
  // Handle rating form submission
  document.getElementById('rating-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const rating = form.querySelector('input[name="rating"]:checked')?.value;
    const email = form.querySelector('#reviewer-email').value.trim();
    const comment = form.querySelector('.comment-input').value.trim();
    
    if (!rating || !email || !comment) {
      alert('Please complete all fields');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Add new review
    const updatedRatings = addDoctorReview(doctor.name, email, rating, comment);
    
    // Refresh modal to show new review
    openDoctorModal(doctor);
    form.reset();
    
    alert('Thank you for your rating! Your comment has been saved successfully.');
  });
  
  doctorModal.style.display = 'block';
}

// Helper functions
function getSpecialtyName(specialty) {
  const specialties = {
    'cardiologist': 'Cardiology',
    'dentist': 'Dentistry',
    'dermatologist': 'Dermatology',
    'orthopedic': 'Orthopedics'
  };
  return specialties[specialty] || specialty;
}

function getStarRating(average) {
  const fullStars = Math.floor(average);
  const halfStar = average % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Close modal when clicking X or outside
closeModal.addEventListener('click', () => {
  doctorModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === doctorModal) {
    doctorModal.style.display = 'none';
  }
});

// Login functionalityFATMA


// Close auth container when clicking X
document.querySelectorAll('.close-auth').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelector('.auth-container').style.display = 'none';
    document.getElementById('home').classList.add('active');
    document.querySelector('a[href="#home"]').classList.add('active');
  });
});

// Toggle between login and register forms
document.getElementById('show-login').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('register-card').classList.add('hidden');
  document.getElementById('login-card').classList.remove('hidden');
});

document.getElementById('show-register').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('login-card').classList.add('hidden');
  document.getElementById('register-card').classList.remove('hidden');
});

// Register form submission
// Register form submission
document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  // Simple validation
  if (!name || !email || !password) {
    showNotification('Please fill all fields', false);
    return;
  }

  // Get existing users
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Check if email exists
  if (users.some(user => user.email === email)) {
    showNotification('Email already registered', false);
    return;
  }

  // Add new user (Note: In production, you should hash passwords!)
  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  showNotification('Registration successful! Please login.', true);
  
  // Switch to login form
  document.getElementById('register-card').classList.add('hidden');
  document.getElementById('login-card').classList.remove('hidden');
  this.reset();
});

// Login form submission
// Login form submission
// Update the login success handler
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  // In the login form submission handler, replace the success part with:
if (user) {
  // Successful login
  showNotification('Login successful!', true);
  document.querySelector('.auth-container').style.display = 'none';
  
  // Update login button to show profile icon
  const loginBtn = document.getElementById('login-btn');
  loginBtn.innerHTML = '<i class="fas fa-user-circle"></i>'; // Using fa-user-circle for better visibility
  loginBtn.classList.add('logged-in');
  
  // Store logged-in user in localStorage
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Change click behavior to show profile dropdown
  loginBtn.onclick = function(e) {
    e.preventDefault();
    showProfileDropdown(user);
  };
  
  // Close any open dropdowns when clicking elsewhere
  document.addEventListener('click', function closeDropdown(e) {
    const dropdown = document.querySelector('.profile-dropdown-container');
    if (dropdown && !dropdown.contains(e.target) && e.target !== loginBtn) {
      dropdown.remove();
      document.removeEventListener('click', closeDropdown);
    }
  });
}else {
    showNotification('Invalid email or password', false);
  }
});
//  (for debugging only)
function debugAppointments() {
  console.log('Current appointments in localStorage:',
    JSON.parse(localStorage.getItem('appointments') || '[]'));
}
// Function to show profile dropdown
function showProfileDropdown(user) {
  // Load fresh appointments data each time
  const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  
  // Debug logging
  console.group('Profile Dropdown Debug');
  console.log('Current user email:', user.email);
  console.log('All appointments in storage:', allAppointments);
  
  // Filter appointments by email (case-insensitive)
  const userAppointments = allAppointments.filter(a => {
    const emailMatch = a.email && user.email && 
                      a.email.toLowerCase() === user.email.toLowerCase();
    if (!emailMatch) {
      console.log('Non-matching appointment:', a);
    }
    return emailMatch;
  });
  
  console.log('Filtered appointments for user:', userAppointments);
  console.groupEnd();
  
  const doctorCounts = {};
  userAppointments.forEach(app => {
    doctorCounts[app.doctor] = (doctorCounts[app.doctor] || 0) + 1;
  });
  
  let discountInfo = '';
  Object.entries(doctorCounts).forEach(([doctor, count]) => {
    if (count >= 2) {
      const discount = Math.min(20, (count - 1) * 10);
      discountInfo += `<p>${doctor}: ${discount}% discount (${count} visits)</p>`;
    }
  });
  
  const dropdownHTML = `
    <div class="profile-dropdown">
      <div class="profile-header">
        <i class="fas fa-user-circle"></i>
        <h4>${user.email}</h4>
      </div>
      <div class="profile-info">
        <p>Appointments: ${userAppointments.length}</p>
        ${userAppointments.length > 0 ? 
          userAppointments.map(app => `
            <div class="appointment-item">
              <p><strong>${app.doctor}</strong></p>
              <p>${app.date} at ${app.time}</p>
              <p>Type: ${app.type}</p>
            </div>
          `).join('') : '<p>No appointments yet</p>'}
        ${discountInfo || '<p>No discounts yet</p>'}
      </div>
      <button class="logout-btn">Logout</button>
    </div>
  `;
  
  
  const existingDropdown = document.querySelector('.profile-dropdown-container');
  if (existingDropdown) existingDropdown.remove();
  
  const dropdown = document.createElement('div');
  dropdown.className = 'profile-dropdown-container';
  dropdown.innerHTML = dropdownHTML;
  document.body.appendChild(dropdown);
  
  const loginBtn = document.getElementById('login-btn');
  const rect = loginBtn.getBoundingClientRect();
  
  // Position dropdown with viewport boundary checks
  const dropdownWidth = 300;
  const viewportWidth = window.innerWidth;
  const spaceRight = viewportWidth - rect.right;
  
  if (spaceRight < dropdownWidth && rect.left > dropdownWidth) {
    dropdown.style.right = `${viewportWidth - rect.left}px`;
    dropdown.style.left = 'auto';
  } else {
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.right = 'auto';
  }
  
  dropdown.style.top = `${rect.bottom + window.scrollY}px`;
  
  // Enhanced logout confirmation
  dropdown.querySelector('.logout-btn').addEventListener('click', function() {
    // Create custom confirmation using your notification system
    const confirmNotification = document.createElement('div');
    confirmNotification.className = 'custom-confirm';
    confirmNotification.innerHTML = `
      <div class="confirm-content">
        <p>Are you sure you want to logout?</p>
        <div class="confirm-buttons">
          <button class="confirm-yes">Yes</button>
          <button class="confirm-no">No</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmNotification);
    
    // Handle yes/no buttons
    confirmNotification.querySelector('.confirm-yes').addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      const loginBtn = document.getElementById('login-btn');
      loginBtn.innerHTML = 'Login';
      loginBtn.classList.remove('logged-in');
      loginBtn.onclick = showLoginModal;
      dropdown.remove();
      confirmNotification.remove();
      showNotification('Logged out successfully', true);
    });
    
    confirmNotification.querySelector('.confirm-no').addEventListener('click', function() {
      confirmNotification.remove();
    });
  });

  
  document.addEventListener('click', function closeDropdown(e) {
    if (!dropdown.contains(e.target) && e.target !== loginBtn) {
      dropdown.remove();
      document.removeEventListener('click', closeDropdown);
    }
  });
}

// Debug function to check appointments
function debugAppointments() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  
  console.group('Appointments Debug');
  console.log('Current user:', currentUser);
  console.log('All appointments:', appointments);
  
  if (currentUser) {
    const userAppointments = appointments.filter(a => 
      a.email && currentUser.email && 
      a.email.toLowerCase() === currentUser.email.toLowerCase()
    );
    console.log('User appointments:', userAppointments);
  } else {
    console.log('No user logged in');
  }
  console.groupEnd();
}

// Call this after saving an appointment
function verifyAppointmentSaved(appointmentData) {
  const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const found = savedAppointments.some(app => 
    app.email === appointmentData.email && 
    app.date === appointmentData.date && 
    app.time === appointmentData.time
  );
  
  console.log('Appointment verification:', found ? 'Found' : 'Not found');
  return found;
}
// Function to load user appointments
function loadUserAppointments(email) {
  // In a real app, you would fetch this from your backend
  // Here we'll use localStorage
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  return appointments.filter(a => a.email === email);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize other components first
  loadAllDoctors();
  goToSlide(0);
  setInterval(() => goToSlide(index + 1), 5000);
  setupNavigation();
  updateActiveNavLink();

  // Check if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.innerHTML = '<i class="fas fa-user"></i>'; // Font Awesome profile icon
    loginBtn.classList.add('logged-in');
    loginBtn.onclick = function() {
      showProfileDropdown(currentUser);
    };
    
    // Load appointments to calculate potential discounts
    loadUserAppointments(currentUser.email);
  } else {
    // Set default login behavior if not logged in
    const loginBtn = document.getElementById('login-btn');
    loginBtn.onclick = showLoginModal;
  }
});

function showLoginModal() {
  document.querySelector('.auth-container').style.display = 'flex';
  document.getElementById('register-card').classList.add('hidden');
  document.getElementById('login-card').classList.remove('hidden');
}



















// Smooth scroll when clicking nav links
document.querySelectorAll('.navbar nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
// Gestion des boutons de fermeture
document.querySelectorAll('.close-form-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#appointment-section, #continue-form, #medical-questions')
      .forEach(section => section.classList.remove('active'));
  });
});

// Detect which section is in view and update navbar
// Update active nav link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('.navbar nav a');
  
  let currentSection = '';
  const scrollPosition = window.scrollY + 100; // Adding offset for navbar height
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Add scroll event listener
window.addEventListener('scroll', updateActiveNavLink);

// Also call it once when page loads
document.addEventListener('DOMContentLoaded', updateActiveNavLink);



// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
  const chatbotBtn = document.getElementById('chatbot-btn');
  const chatbotModal = document.getElementById('chatbot-modal');
  const closeChatbot = document.querySelector('.close-chatbot');
  const chatInput = document.getElementById('chatbot-input');
  const chatSend = document.getElementById('chatbot-send');
  const chatMessages = document.getElementById('chatbot-messages');
  
  // Toggle chatbot modal
  chatbotBtn.addEventListener('click', function() {
    chatbotModal.classList.toggle('active');
  });
  
  closeChatbot.addEventListener('click', function() {
    chatbotModal.classList.remove('active');
  });
  
  // Send message function
  function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Here you would typically send the message to your backend
    // For now, we'll just simulate a response
    setTimeout(() => {
      // This is where you would call your Python backend
      // For now, we'll use simple responses
      let response = "I'm a simple chatbot. In a real implementation, I would connect to the Prolog knowledge base.";
      
      if (message.toLowerCase().includes('doctor')) {
        response = "We have specialists in cardiology, dentistry, dermatology, and orthopedics. Would you like information about a specific specialty?";
      } else if (message.toLowerCase().includes('symptom')) {
        response = "I can help you find which doctor to see based on your symptoms. What symptoms are you experiencing?";
      } else if (message.toLowerCase() === 'help') {
        response = "I can help with:\n- Finding doctors by specialty\n- Identifying which doctor to see for symptoms\n- Clinic locations\n- Doctor availability\n- Treatment information\n- Emergency contacts";
      }
      
      const botMsg = document.createElement('div');
      botMsg.className = 'bot-message';
      botMsg.textContent = response;
      chatMessages.appendChild(botMsg);
      
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
  }
  
  // Send message on button click or Enter key
  chatSend.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });
});