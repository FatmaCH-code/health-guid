import tkinter as tk
from tkinter import scrolledtext
from difflib import get_close_matches
from pyswip import Prolog
import re

# Initialize Prolog
prolog = Prolog()
prolog.consult("health_knowledge.pl")

def extract_knowledge():
    doctors = set()
    specialties = set()
    symptoms = set()
    treatments = set()
    
    # Query Prolog to get all knowledge
    for result in prolog.query("doctor(D, S)"):
        doctors.add(result["D"])
        specialties.add(result["S"])
    
    for result in prolog.query("symptom(S, _)"):
        symptoms.add(result["S"])
    
    for result in prolog.query("treatment(_, T)"):
        treatments.add(result["T"])
    
    return list(doctors), list(specialties), list(symptoms), list(treatments)

doctor_list, specialty_list, symptom_list, treatment_list = extract_knowledge()

def correct_term(term, options):
    matches = get_close_matches(term.lower(), options, n=1, cutoff=0.6)
    return matches[0] if matches else term

# Helper functions for formatting responses
def format_doctor_info(results):
    if not results:
        return "No doctors found."
    return "\n".join([f"Dr. {res['D'].split('_')[1:]} ({res['S']})" for res in results])

def format_availability(results):
    if not results:
        return "No availability information found."
    return "\n".join([f"Available on: {', '.join(res['Days'])} from {res['Time']}" for res in results])

def format_treatments(results):
    if not results:
        return "No treatments found."
    return "Possible treatments:\n" + "\n".join([f"- {res['T']}" for res in results])

def format_emergency_contacts(results):
    if not results:
        return "No emergency contacts found."
    return "Emergency Contacts:\n" + "\n".join([f"{res['Service']}: {res['Number']}" for res in results])

# Natural Language Parser
def parse_health_query(sentence):
    original = sentence
    sentence = sentence.lower()
    sentence = sentence.replace('"', '').replace("'", "").strip().replace('?', '')
    
    tokens = re.findall(r'\b\w+\b', sentence)
    corrected_tokens = [correct_term(word, doctor_list + specialty_list + symptom_list) for word in tokens]
    sentence = ' '.join(corrected_tokens)
    
    patterns = [
        (r'who are the (cardiologist|dentist|dermatologist|orthopedic) doctors',
         lambda m: f"doctor(D, {correct_term(m[0], specialty_list)})",
         lambda r, m: f"{m[0].capitalize()} doctors:\n" + format_doctor_info(r)),
        
        (r'what doctors treat (chest pain|shortness of breath|toothache|bleeding gums|skin rash|acne|joint pain|back pain)',
         lambda m: f"symptom({correct_term(m[0].replace(' ', '_'), symptom_list)}, S), doctor(D, S)",
         lambda r, m: f"For {m[0]}, consult these doctors:\n" + format_doctor_info(r)),
        
        (r'where is (dr \w+) clinic',
         lambda m: f"doctor({correct_term(m[0].replace(' ', '_'), doctor_list)}, _), clinic_location({correct_term(m[0].replace(' ', '_'), doctor_list)}, L)",
         lambda r, m: f"Dr. {m[0].split('_')[1:]}'s clinic is located at: {r[0]['L']}"),
        
        (r'when is (dr \w+) available',
         lambda m: f"availability({correct_term(m[0].replace(' ', '_'), doctor_list)}, Days, Time)",
         lambda r, m: f"Dr. {m[0].split('_')[1:]}'s availability:\n" + format_availability(r)),
        
        (r'what are the treatments for (cardiologist|dentist|dermatologist|orthopedic)',
         lambda m: f"treatment({correct_term(m[0], specialty_list)}, T)",
         lambda r, m: format_treatments(r)),
        
        (r'what are the emergency numbers',
         lambda m: "emergency_contact(Service, Number)",
         lambda r, m: format_emergency_contacts(r)),
        
        (r'what are the symptoms treated by (cardiologist|dentist|dermatologist|orthopedic)',
         lambda m: f"symptom(S, {correct_term(m[0], specialty_list)})",
         lambda r, m: f"Symptoms treated by {m[0].capitalize()}:\n" + "\n".join([f"- {res['S'].replace('_', ' ')}" for res in r])),
        
        (r'list all doctors',
         lambda m: "doctor(D, S)",
         lambda r, m: "All doctors:\n" + format_doctor_info(r)),
        
        (r'help',
         lambda m: "help",
         lambda r, m: "I can help with:\n"
                      "- Finding doctors by specialty\n"
                      "- Identifying which doctor to see for symptoms\n"
                      "- Clinic locations\n"
                      "- Doctor availability\n"
                      "- Treatment information\n"
                      "- Emergency contacts")
    ]
    
    for pattern, query_builder, responder in patterns:
        match = re.match(pattern, sentence)
        if match:
            m = match.groups()
            query = query_builder(m)
            try:
                if query == "help":
                    return responder(None, None)
                results = list(prolog.query(query))
                return responder(results, m)
            except Exception as e:
                return f"Error processing your request: {e}"
    
    return f"Sorry, I don't understand '{original}'. Type 'help' for assistance."

# GUI for the chatbot
class HealthChatbotGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Biskra Health Guide Chatbot")
        
        # Chat area
        self.chat_area = scrolledtext.ScrolledText(
            root, wrap=tk.WORD, width=60, height=20, 
            font=("Arial", 12), bg="#f0f2f5")
        self.chat_area.pack(padx=10, pady=10)
        
        # Input area
        input_frame = tk.Frame(root)
        input_frame.pack(padx=10, pady=(0, 10), fill=tk.X)
        
        self.entry = tk.Entry(
            input_frame, font=("Arial", 14), width=50,
            bg="white", fg="#1d1b2f")
        self.entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        self.entry.bind("<Return>", lambda e: self.send_message())
        
        self.send_btn = tk.Button(
            input_frame, text="Send", command=self.send_message,
            font=("Arial", 12), bg="#2b7a78", fg="white")
        self.send_btn.pack(side=tk.LEFT, padx=(10, 0))
        
        # Welcome message
        self.chat_area.insert(tk.END, 
            "Health Bot: Welcome to Biskra Health Guide!\n"
            "How can I assist you with healthcare in Biskra today?\n"
            "Type 'help' to see what I can do.\n\n")
    
    def send_message(self):
        user_input = self.entry.get()
        if not user_input.strip():
            return
            
        self.chat_area.insert(tk.END, f"You: {user_input}\n")
        response = parse_health_query(user_input)
        self.chat_area.insert(tk.END, f"Health Bot: {response}\n\n")
        self.entry.delete(0, tk.END)
        self.chat_area.see(tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = HealthChatbotGUI(root)
    root.mainloop()