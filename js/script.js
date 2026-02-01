document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      navLinks.classList.toggle("active");
    });
  }

// const form = document.getElementById("contact-form");

// form.addEventListener("submit", function(e) {
//   e.preventDefault(); // stop the default form submission

//   const name = document.getElementById("name").value;
//   const email = document.getElementById("email").value;
//   const message = document.getElementById("message").value;

//   const subject = encodeURIComponent("MindTap Website Inquiry");
//   const body = encodeURIComponent(
//     `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
//   );

//   window.location.href = `mailto:krupajrav@gmail.com?subject=${subject}&body=${body}`;
// });

  // Text-to-Speech functionality
  const speechBtn = document.getElementById("speechBtn");
  let isSpeaking = false;
  let speechUtterance = null;
  let autoStartEnabled = true; // Flag to prevent multiple auto-starts
  let voicesLoaded = false;

  // Load voices and ensure they're available
  function loadVoices() {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        // Voices might not be loaded yet, wait for the voiceschanged event
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
        // Fallback timeout
        setTimeout(() => {
          resolve(window.speechSynthesis.getVoices());
        }, 1000);
      }
    });
  }

  if (speechBtn && 'speechSynthesis' in window) {
    speechBtn.addEventListener("click", () => {
      if (isSpeaking) {
        // Stop speaking
        window.speechSynthesis.cancel();
        isSpeaking = false;
        speechBtn.classList.remove("speaking");
        speechBtn.innerHTML = "🔊";
        speechBtn.setAttribute("aria-label", "Read page content aloud");
      } else {
        // Start speaking
        const textToRead = getPageText();
        speakText(textToRead);
      }
    });

    // Auto-start speech on page load
    if (autoStartEnabled) {
      // Small delay to ensure page is fully loaded
      setTimeout(async () => {
        const textToRead = getPageText();
        if (textToRead) {
          speakText(textToRead);
        }
      }, 1000);
      autoStartEnabled = false; // Prevent re-triggering
    }
  } else if (speechBtn) {
    // Hide button if speech synthesis is not supported
    speechBtn.style.display = "none";
  }

  function getPageText() {
    // Get main content excluding navigation, footer, and buttons
    const mainContent = document.querySelector("main") || document.body;
    const contentClone = mainContent.cloneNode(true);
    
    // Remove unwanted elements
    const elementsToRemove = contentClone.querySelectorAll(
      "nav, header, footer, button, .skip-link, .speech-button, script, style"
    );
    elementsToRemove.forEach(el => el.remove());
    
    // Get text content and clean it up
    let text = contentClone.textContent || contentClone.innerText || "";
    
    // Clean up extra whitespace and line breaks
    text = text.replace(/\s+/g, " ").trim();
    
    // Add page title for context
    const pageTitle = document.title || "MindTap Website";
    text = pageTitle + ". " + text;
    
    return text;
  }

  async function speakText(text) {
    if (!text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Load voices first
    const voices = await loadVoices();
    
    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.lang = "en-US";
    speechUtterance.rate = 0.9; // Slightly slower for better comprehension
    speechUtterance.pitch = 1.2; // Slightly higher pitch for female voice
    speechUtterance.volume = 1.0;
    
    // Try to select a female voice with better detection
    let femaleVoice = null;
    
    // Priority 1: Look for explicitly named female voices
    femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("samantha") ||
      voice.name.toLowerCase().includes("karen") ||
      voice.name.toLowerCase().includes("tessa") ||
      voice.name.toLowerCase().includes("victoria") ||
      voice.name.toLowerCase().includes("zira") ||
      voice.name.toLowerCase().includes("siri") ||
      voice.name.includes("Google US English Female")
    );
    
    // Priority 2: Look for voices that are commonly female
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => 
        voice.lang.includes("en") && (
          voice.name.includes("Microsoft") && 
          (voice.name.includes("Zira") || voice.name.includes("Hazel") || voice.name.includes("Susan"))
        )
      );
    }
    
    // Priority 3: Any English voice that doesn't sound male
    if (!femaleVoice) {
      const maleVoices = ["Alex", "Daniel", "David", "Thomas", "Lee", "Aaron"];
      femaleVoice = voices.find(voice => 
        voice.lang.includes("en") && 
        !maleVoices.some(maleName => voice.name.includes(maleName))
      );
    }
    
    // Priority 4: Any English voice
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => voice.lang.includes("en"));
    }
    
    // Priority 5: First available voice
    if (!femaleVoice && voices.length > 0) {
      femaleVoice = voices[0];
    }
    
    if (femaleVoice) {
      speechUtterance.voice = femaleVoice;
      console.log("Using voice:", femaleVoice.name, femaleVoice.lang);
    }
    
    speechUtterance.onstart = () => {
      isSpeaking = true;
      speechBtn.classList.add("speaking");
      speechBtn.innerHTML = "🔇";
      speechBtn.setAttribute("aria-label", "Stop reading");
    };
    
    speechUtterance.onend = () => {
      isSpeaking = false;
      speechBtn.classList.remove("speaking");
      speechBtn.innerHTML = "🔊";
      speechBtn.setAttribute("aria-label", "Read page content aloud");
    };
    
    speechUtterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      isSpeaking = false;
      speechBtn.classList.remove("speaking");
      speechBtn.innerHTML = "🔊";
      speechBtn.setAttribute("aria-label", "Read page content aloud");
    };
    
    window.speechSynthesis.speak(speechUtterance);
  }

  document.documentElement.classList.remove("no-js");
});
