% Doctors and their specialties
doctor(dr_amira_abbassi, cardiologist).
doctor(dr_abdelrahmane_mekihal, cardiologist).
doctor(dr_gherbi, dentist).
doctor(dr_merabet_mohamed, dentist).
doctor(dr_nadia_amrani, dermatologist).
doctor(dr_karim_ben_ammar, orthopedic).

% Symptoms and related specialties
symptom(chest_pain, cardiologist).
symptom(shortness_of_breath, cardiologist).
symptom(toothache, dentist).
symptom(bleeding_gums, dentist).
symptom(skin_rash, dermatologist).
symptom(acne, dermatologist).
symptom(joint_pain, orthopedic).
symptom(back_pain, orthopedic).

% Clinic locations
clinic_location(dr_amira_abbassi, '123 Health Street, Biskra').
clinic_location(dr_abdelrahmane_mekihal, '456 Heart Avenue, Biskra').
clinic_location(dr_gherbi, '789 Dental Boulevard, Biskra').
clinic_location(dr_merabet_mohamed, '321 Smile Lane, Biskra').
clinic_location(dr_nadia_amrani, '654 Skin Care Road, Biskra').
clinic_location(dr_karim_ben_ammar, '987 Bone Health Avenue, Biskra').

% Doctor availability
availability(dr_amira_abbassi, [monday, wednesday, friday], '08:00-16:00').
availability(dr_abdelrahmane_mekihal, [tuesday, thursday, saturday], '09:00-17:00').
availability(dr_gherbi, [monday, tuesday, wednesday, thursday], '08:30-15:30').
availability(dr_merabet_mohamed, [sunday, wednesday, friday], '10:00-18:00').
availability(dr_nadia_amrani, [monday, tuesday, thursday, friday], '08:00-14:00').
availability(dr_karim_ben_ammar, [sunday, tuesday, thursday, saturday], '09:00-16:00').

% Common treatments
treatment(cardiologist, 'Heart medication and lifestyle changes').
treatment(cardiologist, 'Angioplasty or bypass surgery for severe cases').
treatment(dentist, 'Teeth cleaning and fillings').
treatment(dentist, 'Root canal treatment for infected teeth').
treatment(dermatologist, 'Topical creams and medications').
treatment(dermatologist, 'Laser therapy for skin conditions').
treatment(orthopedic, 'Physical therapy and pain management').
treatment(orthopedic, 'Joint replacement surgery for severe cases').

% Emergency contacts
emergency_contact('Ambulance', '1548').
emergency_contact('Police', '17').
emergency_contact('Fire Department', '14').
emergency_contact('Poison Control', '2133').