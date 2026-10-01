# 🌸 Sakhi (सखी) — Voice-First AI Maternal Scheme Companion
### Pure Client-Side Static Vite Web App with Automatic Indian Language Detection

> **PromptWars x HackArena Challenge:** *"The Invisible Woman"*  
> **Target Scheme:** Pradhan Mantri Matru Vandana Yojana (PMMVY)  
> **Target User:** A first-time rural or semi-urban woman with **NO English**, **NO tech background**, and **NO ONE to ask**.

---

## 💡 The Core Innovation: Zero-Friction Voice AI

In **Sakhi**, all digital friction has been eliminated:
- **NO Language Picker Screen:** The app opens **directly on the voice screen** with ONE giant pulsing mic button.
- **Automatic Language Detection on Every Turn:** The user simply taps the button and speaks in her mother tongue (Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, etc.).
- **Pure Client-Side Architecture (Vite SPA):** Zero Node server, zero SSR, zero serverless function 500 errors. All code runs purely inside the user's browser.
- **Multimodal Audio Brain:** Audio is recorded in `audio/webm` via `MediaRecorder` and sent directly from the browser to **Google Gemini Flash** via secure REST API calls using `import.meta.env.VITE_GEMINI_API_KEY`. Gemini transcribes her speech in her native script, detects the spoken language, and replies warmly in that exact dialect.
- **Resilient Silence Detection:** Uses an in-browser `AudioContext` and `AnalyserNode` with adaptive thresholding. Recording auto-stops after ~1.5 seconds of silence once speech concludes, or on a second tap (max 30 seconds).
- **Hybrid Voice Output:** Plays responses using the device's native Indian speech voices; if the user's phone lacks regional voice data (e.g. Malayalam, Kannada), it dynamically calls the **Gemini Cloud TTS API** and plays natural audio back.

---

## 🌟 The 6 Unique Differentiators

1. **Situation-Based Discovery:**
   She never needs to know the official name *"Pradhan Mantri Matru Vandana Yojana"*. She simply says *"I am pregnant and have no money"* or *"I am expecting a baby and worried about hospital expenses"*, and Sakhi links her situation directly to PMMVY.
2. **Dialect-Simple Spoken Words:**
   Short, village-level words. Maximum **2 short sentences per turn**, **ONE idea at a time**. Zero government jargon (*"गर्भ के पैसे"* instead of *"मातृत्व प्रसुति हितलाभ"*; *"குழந்தைக்கான அரசு உதவிப் பணம்"* instead of *"மகப்பேறு நிதியுதவி"*).
3. **Action Plan:**
   A spoken *"what to carry, where to go, who to ask for"* checklist delivered one step at a time.
4. **Teach-Back Check:**
   After each step, Sakhi asks her to repeat it in her own words. If she forgets something, Sakhi **never says "wrong"**; she praises her effort and repeats gently in simpler words.
5. **Anti-Fraud Middleman Warning:**
   Sakhi clearly warns her: *"Sister, this scheme is 100% free. Never pay a single rupee to any agent or middleman. The money comes straight to your bank account."*
6. **Take-Home Card:**
   At the end, a pictorial card pops up with 4 large graphical icons:
   - 🪪 **Aadhaar Card**
   - 🏦 **Bank Passbook**
   - 🤱 **Mother-Child (MCP) Card**
   - 🏥 **Anganwadi Centre / ASHA Didi**  
   Includes a **"Speak it again"** voice narrator button and a **"Share"** button (Web Share API + WhatsApp link fallback) so a family member can help.

---

## 🏗️ Technical Architecture & Files

```
├── index.html       # Direct Voice Screen (No language picker), giant mic stage, take-home card
├── style.css        # Responsive mobile-first CSS, pulsing aura rings, dynamic waveforms
├── app.js           # Audio engine: MediaRecorder, AudioContext silence detector, safe browser boot
├── gemini.js        # Pure client-side Gemini Multimodal Chat & Cloud TTS via fetch with auto-retry
├── scheme.js        # Official PMMVY knowledge base with // VERIFY comments
├── prompt.js        # Gemini system prompt with auto language detection, transcription & JSON schema
├── vite.config.js   # Vite configuration targeting dist/ output directory
├── vercel.json      # Vercel SPA configuration with Vite framework & /index.html rewrite
├── .env             # Local client environment file (VITE_GEMINI_API_KEY)
└── package.json     # Vite scripts ("dev": "vite", "build": "vite build")
```

---

## 🚀 Local Setup & Development

### Prerequisites
- Node.js (v18.0 or higher) and npm

### Steps
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your API Key:**
   Copy `.env.example` to `.env` or edit `.env`:
   ```ini
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GEMINI_MODEL=gemini-3.5-flash-lite
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   *(Opens `http://localhost:3000` or `http://localhost:5173` with instant Hot Module Replacement)*

4. **Build production bundle:**
   ```bash
   npm run build
   ```
   *(Outputs pure static bundle to `dist/` ready for any static web host)*

5. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## ☁️ Vercel Deployment

Sakhi is configured as a **100% static client-side Vite application**. It requires **zero Node server runtime or serverless functions**, completely eliminating `ReferenceError: window is not defined` errors.

1. Push this repository to GitHub or GitLab.
2. In [Vercel](https://vercel.com), select **"Add New Project"** and import your repository.
3. Vercel automatically detects the **Vite** framework from `vercel.json`:
   - **Framework Preset:** Vite
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - **`VITE_GEMINI_API_KEY`**: your Gemini API key (e.g. from Google AI Studio)
   - **`VITE_GEMINI_MODEL`**: `gemini-3.5-flash-lite` *(optional, automatically falls back to 2.5-flash, 2.0-flash, 1.5-flash)*
5. Click **Deploy**. Vercel will build the `dist/` bundle and serve it globally with zero server-side rendering.

---

## 🧪 Comprehensive Test Checklist

| # | Test Scenario | Input Method | What to Test | Expected Behavior |
|---|---|---|---|---|
| **1** | **Hindi Voice** | Mic tap | Speak in Hindi: *"मैं गर्भवती हूँ और पैसे की तंगी है"* | Detected language = Hindi (`hi-IN`), transcribes in Devanagari script, answers in village Hindi, asks first eligibility question (*"क्या यह आपका पहला बच्चा है?"*). |
| **2** | **Tamil Voice** | Mic tap | Speak in Tamil: *"நான் கர்ப்பமாக இருக்கிறேன், எனக்கு உதவி வேண்டும்"* | Detected language = Tamil (`ta-IN`), transcribes in Tamil script, replies in simple spoken Tamil (*"வணக்கம் அக்கா..."*). |
| **3** | **Telugu Voice** | Mic tap | Speak in Telugu: *"నేను గర్భవతిని, డబ్బులు లేవు"* | Detected language = Telugu (`te-IN`), transcribes in Telugu script, replies in village Telugu (*"నమస్కారం అక్కా..."*). |
| **4** | **Language Switch Mid-Conversation** | Mic tap | Start turn 1 in Hindi (*"मैं गर्भवती हूँ"*), then turn 2 in Tamil (*"ஆம், முதல் குழந்தை"*). | Gemini switches immediately from Hindi to Tamil, updating the header badge and answering in Tamil. |
| **5** | **Short One-Word Utterance** | Mic tap | User says only *"हाँ"* or *"Yes"*. | Confidence check recognizes short utterance and maintains the previous language (`lastLanguageCode`) without confusion. |
| **6** | **Mixed Speech (Hinglish / Tanglish)** | Mic tap | User says: *"Hello Sakhi, main pregnant hoon aur hospital ke liye money chahiye"*. | Gemini identifies dominant Indian language (Hindi), does not reply in English, and replies in simple spoken Hindi. |
| **7** | **1.5s Silence Auto-Stop** | Mic tap | Speak a sentence, then stop talking. | The `AudioContext` volume analyser detects voice end and stops the recording automatically after ~1.5s of silence without needing a manual click. |
| **8** | **Complete Silence** | Mic tap | Tap mic and stay completely silent. | Gemini or fallback engine detects inaudible audio and speaks a gentle prompt in the last known language: *"बहन, मुझे आपकी आवाज़ साफ़ नहीं आई। कृपया बड़ा बटन दबाकर दोबारा बोलें।"* |
| **9** | **Noisy Recording** | Mic tap | Speak in loud background noise or mumble. | Transcribes as unclear audio and politely asks her to speak again without any technical error codes. |
| **10** | **Microphone Blocked / Denied** | Mic tap | Block microphone in Chrome site settings. | Speaks a gentle request to enable microphone and displays the large emergency text input box with voice playback. |
| **11** | **Offline / Network Interruption** | Mic tap | Disconnect internet. | Speaks a caring offline message: *"इंटरनेट में थोड़ी रुकावट है बहन। कृपया कुछ देर में कोशिश करें।"* |
| **12** | **Take-Home Card & Sharing** | Full flow | Complete the conversation to step `done`. | Modal appears with 4 large graphical cards (Aadhaar, Bank, MCP, Anganwadi) dynamically localized into the detected language. "Share" opens WhatsApp with the checklist. |

---

## ⏱️ Updated 60-Second Demo Script for Judges

```markdown
[0:00 - 0:10] DIRECT VOICE ENTRY (NO LANGUAGE PICKER)
"Judges, look at the screen. No menus. No language picker. No typing. 
Radha opens Sakhi and sees only ONE giant pulsing button. 
Sakhi speaks a warm cycling welcome in her mother tongue."
- [Show screen: Giant glowing button pulsing softly. Audio plays warm greeting.]

[0:10 - 0:25] AUTOMATIC LANGUAGE DETECTION & SITUATION DISCOVERY
- [Action: Tap mic. Radha speaks in Tamil:] 
  "வணக்கம், நான் கர்ப்பமாக இருக்கிறேன், பணம் தேவைப்படுகிறது."
- [After Radha finishes, AudioContext silence detector auto-stops recording in 1.5s.]
- [Sakhi detects Tamil automatically, transcribes in Tamil script, and speaks:]
  "வணக்கம் அக்கா. கர்ப்ப காலத்தில் சத்தான உணவுக்கும் ஓய்வுக்கும் அரசு பணம் தருகிறது. இது உங்கள் முதல் குழந்தையா?"
- "Notice: Zero setup. Gemini detected Tamil straight from her voice, 
  and discovered PMMVY without Radha ever knowing the scheme name."

[0:25 - 0:40] MID-CONVERSATION SWITCH & ANTI-FRAUD
- [Action: Radha's husband takes the phone and replies in Hindi:]
  "हाँ बहन, पहला बच्चा है और हम मजदूरी करते हैं।"
- [Sakhi detects language switch mid-conversation and seamlessly replies in Hindi:]
  "आपको ₹5,000 की मदद मिलेगी बहन! आधार कार्ड, बैंक पासबुक और जच्चा-बच्चा कार्ड लेकर आँगनवाड़ी केंद्र जाएँ। किसी भी दलाल को एक रुपया मत देना, यह पूरी तरह मुफ़्त है।"
- "Notice the fraud prevention: middleman warning delivered directly."

[0:40 - 0:50] TEACH-BACK CHECK
- [Sakhi speaks:] "बहन, मुझे बताइए कि आपको अपने साथ कौन-कौन से कागज़ ले जाने हैं?"
- [Action: Tap mic. Purposely say partially:] "आधार कार्ड और बैंक कॉपी।"
- [Sakhi responds with love, NEVER says wrong:]
  "शाबाश बहन! बस अपना जच्चा-बच्चा कार्ड भी साथ रख लेना।"

[0:50 - 1:00] THE TAKE-HOME CARD & CLOSING
- [Action: Show the Take-Home Card modal pop up with 4 pictorial cards: 
  Aadhaar, Bank, MCP Card, Anganwadi Center.]
- [Action: Tap 'परिवार को भेजें' (Share) -> Opens WhatsApp message pre-filled.]
- "Zero typing. Zero English. Zero middlemen. Automatic language detection.
Sakhi makes the invisible woman visible. Thank you!"
```

---

*Made with ❤️ for the PromptWars x HackArena "The Invisible Woman" Challenge.*
