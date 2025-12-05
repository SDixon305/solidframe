import './style.css'

// Terminal Typing Animation
const terminalContent = [
  { type: 'system', text: '> INCOMING CALL DETECTED: (555) 867-5309' },
  { type: 'system', text: '> CONNECTING AI AGENT...' },
  { type: 'ai', text: 'SolidFrame AI: "Thanks for calling Mike\'s HVAC. This is the automated assistant. How can I help you today?"' },
  { type: 'user', text: 'Customer: "Yeah, my AC just died and it\'s 90 degrees in here. I need someone out fast."' },
  { type: 'ai', text: 'SolidFrame AI: "I can help with that. Are you a current customer or is this your first time calling us?"' },
  { type: 'user', text: 'Customer: "First time."' },
  { type: 'ai', text: 'SolidFrame AI: "Got it. I have a technician available in your area between 2pm and 4pm today. Does that work for you?"' },
  { type: 'user', text: 'Customer: "Yes, that works perfectly."' },
  { type: 'system', text: '> CHECKING SCHEDULE...' },
  { type: 'system', text: '> APPOINTMENT CONFIRMED: 2:00 PM - 4:00 PM' },
  { type: 'ai', text: 'SolidFrame AI: "Great. I\'ve booked that slot. We\'ll see you then."' },
  { type: 'system', text: '> CALL ENDED. TICKET #4921 CREATED.' },
  { type: 'system', text: '> NOTIFICATION SENT TO DISPATCH.' }
];

const terminalContainer = document.getElementById('terminal-content');

async function typeWriter(text, element, speed = 30) {
  for (let i = 0; i < text.length; i++) {
    element.textContent += text.charAt(i);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}

async function runTerminal() {
  terminalContainer.innerHTML = '';

  for (const line of terminalContent) {
    const lineElement = document.createElement('div');
    lineElement.classList.add('terminal-line', line.type);
    terminalContainer.appendChild(lineElement);

    // Scroll to bottom
    terminalContainer.scrollTop = terminalContainer.scrollHeight;

    await typeWriter(line.text, lineElement);
    await new Promise(resolve => setTimeout(resolve, 600)); // Pause between lines
  }
}

// Start animation on load
document.addEventListener('DOMContentLoaded', () => {
  runTerminal();
  // Loop it
  setInterval(runTerminal, 25000);
});
