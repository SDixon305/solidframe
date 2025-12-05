import './style.css'

// Main JS file
console.log('SolidFrame HVAC Rugged Landing Loaded');

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });

      // Close mobile menu if open
      const nav = document.querySelector('.desktop-nav');
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
      }
    }
  });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.desktop-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
  });
}

// Demo Player Interaction
// Demo Player Interaction
const playBtn = document.querySelector('.play-btn');
const visualizer = document.querySelector('.demo-visualizer');
const transcriptContainer = document.getElementById('transcript-container');
let audio = new Audio(import.meta.env.BASE_URL + 'audio/demo_call.wav');

// Transcript Data
const transcriptData = [
  { time: 1.24, role: 'ai', text: "Trinity Cooling and Air. How may I help you?" },
  { time: 5.10, role: 'user', text: "Hey. My AC just went out in my house, and I need somebody out as soon as possible." },
  { time: 12.68, role: 'ai', text: "I'm really sorry you're dealing with that. Especially in this Miami heat. Let me grab a couple quick details so we can help. Are you an existing customer of ours?" },
  { time: 22.75, role: 'user', text: "Yeah. My name is Daniel White." },
  { time: 27.40, role: 'ai', text: "Got it. Thank you, Mr. White. I'm seeing your address at 1840 Southwest 27th Avenue. Is that correct?" },
  { time: 34.43, role: 'user', text: "Yeah. That's right." },
  { time: 36.96, role: 'ai', text: "And the best number to reach you and send dispatch confirmation is 305-555-7124." },
  { time: 45.15, role: 'user', text: "Correct." },
  { time: 47.85, role: 'ai', text: "Okay. Great. So you said your AC is completely out." },
  { time: 53.17, role: 'user', text: "Yeah. The fan is still blowing, but the air coming out isn't cool. And the machine outside is, like, making a really high pitched sound, and the house is getting really hot. And I've got 2 kids under 2 here, so I wanted somebody out as soon as possible." },
  { time: 68.67, role: 'ai', text: "Got it. Based on what you're describing, this definitely sounds urgent. And we want to get someone out to you as quickly as possible. Especially with little ones in the house and this heat wave we're dealing with. Can you give me 1 moment to contact our on call technician?" },
  { time: 84.91, role: 'user', text: "Yeah. Sure. No problem." },
  { time: 88.93, role: 'ai', text: "Okay. I've been able to confirm availability with our on call technician, Trevor. He's not far from you now. We can be out to your home within about 45 minutes to an hour. Does that work for you?" },
  { time: 101.21, role: 'user', text: "Yeah. That'd be fantastic. Thank you." },
  { time: 106.89, role: 'ai', text: "My pleasure. Great. So Trevor has already been dispatched and should be on the way to you. We'll send a dispatch confirmation text to your number, and I've passed your information along to Trevor so he can contact you while he's on his way if needed." },
  { time: 121.58, role: 'user', text: "Okay. Thanks so much for the help." },
  { time: 126.46, role: 'ai', text: "My pleasure. And thank you for calling Trinity Cooling and Air. We'll get this taken care of for you as quickly as possible tonight." },
  { time: 130.00, role: 'user', text: "Okay. Thanks. Bye." }
];

// Format time helper
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

if (playBtn) {
  // Preload metadata to get duration
  audio.preload = 'metadata';

  // Update button text when duration is available
  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration && audio.duration !== Infinity) {
      playBtn.textContent = `▶ LISTEN (${formatTime(audio.duration)})`;
    }
  });

  // Handle playback end
  audio.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
    visualizer.classList.remove('playing');
    const durationText = audio.duration ? `(${formatTime(audio.duration)})` : '';
    playBtn.textContent = `▶ LISTEN ${durationText}`;
  });

  // Handle errors
  audio.addEventListener('error', () => {
    console.warn('Audio file not found. Please add /public/audio/demo_call.wav');
    playBtn.textContent = '⚠️ AUDIO MISSING';
  });

  // Transcript Sync Logic
  let lastRenderedIndex = -1;
  let currentTypingTask = null; // Object { timeoutId, finish }

  audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;

    // Find all lines that should be visible at current time
    for (let i = lastRenderedIndex + 1; i < transcriptData.length; i++) {
      if (currentTime >= transcriptData[i].time) {
        // Determine if this line is "current" or "past" (skipped via seek)
        let nextTime = (i < transcriptData.length - 1) ? transcriptData[i + 1].time : (audio.duration || 9999);
        const isPast = currentTime >= nextTime;

        // Calculate duration for pacing if we are animating
        let duration = nextTime - transcriptData[i].time;
        if (i === transcriptData.length - 1) {
          duration = (audio.duration || currentTime + 5) - transcriptData[i].time;
        }
        if (duration < 1) duration = 1;

        appendTranscriptLine(transcriptData[i], duration, isPast);
        lastRenderedIndex = i;
      } else {
        break;
      }
    }
  });

  function appendTranscriptLine(line, duration, immediate) {
    if (!transcriptContainer) return;

    // If there's an active typing task, finish it immediately before starting a new one
    if (currentTypingTask) {
      clearTimeout(currentTypingTask.timeoutId);
      currentTypingTask.finish();
      currentTypingTask = null;
    }

    const div = document.createElement('div');
    div.className = `msg ${line.role}`;
    div.innerHTML = `<strong>${line.role === 'ai' ? 'AI' : 'Caller'}:</strong> <span class="text-content"></span>`;
    transcriptContainer.appendChild(div);

    const textSpan = div.querySelector('.text-content');

    if (immediate) {
      textSpan.textContent = line.text;
      transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
      return;
    }

    // Typewriter effect
    const words = line.text.split(' ');
    let wordIndex = 0;
    const totalMs = duration * 1000;
    const delay = Math.max((totalMs * 0.9) / words.length, 30);

    const finish = () => {
      textSpan.textContent = line.text;
      transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
    };

    const typeWord = () => {
      if (wordIndex < words.length) {
        textSpan.textContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        wordIndex++;
        transcriptContainer.scrollTop = transcriptContainer.scrollHeight;

        const timeoutId = setTimeout(typeWord, delay);
        currentTypingTask = { timeoutId, finish };
      } else {
        currentTypingTask = null;
      }
    };

    typeWord();
  }

  function resetTranscript() {
    if (transcriptContainer) {
      transcriptContainer.innerHTML = '';
      lastRenderedIndex = -1;
      if (currentTypingTask) {
        clearTimeout(currentTypingTask.timeoutId);
        currentTypingTask = null;
      }
    }
  }

  playBtn.addEventListener('click', () => {
    if (playBtn.classList.contains('playing')) {
      audio.pause();
      playBtn.classList.remove('playing');
      visualizer.classList.remove('playing');
      const durationText = audio.duration ? `(${formatTime(audio.duration)})` : '';
      playBtn.textContent = `▶ LISTEN ${durationText}`;
    } else {
      // If starting from beginning (or near it), reset transcript
      if (audio.currentTime < 0.5 || audio.ended) {
        resetTranscript();
      }

      audio.play().catch(e => console.log('Playback failed:', e));
      playBtn.classList.add('playing');
      visualizer.classList.add('playing');
      playBtn.textContent = '❚❚ PAUSE';
    }
  });
}
