/**
 * app.js - Pure Client-Side Sakhi Voice AI Engine (Static Vite App)
 * 
 * Target: Browser (Mobile Chrome on Android)
 * Safe Module: Zero top-level window/document/navigator references so nothing runs at import time.
 * Calls Gemini directly via gemini.js using import.meta.env.VITE_GEMINI_API_KEY.
 */

import { callClientGeminiChat, callClientGeminiTTS } from './gemini.js';

// Comprehensive dictionary for Take-Home Card & System Localization
const LOCALIZED_CARD_DATA = {
  'hi-IN': {
    nativeName: 'हिंदी',
    title: 'आपके जरूरी कागज़',
    aadhaar: 'आधार कार्ड',
    bank: 'बैंक पासबुक',
    mcp: 'जच्चा-बच्चा कार्ड',
    anganwadi: 'आँगनवाड़ी केंद्र',
    antiFraud: 'सरकारी मदद 100% मुफ़्त है • किसी को पैसे न दें',
    speakAgain: 'फिर से सुनें',
    share: 'परिवार को भेजें',
    shareText: 'प्रधानमंत्री मातृत्व वंदना योजना (PMMVY) के ₹5,000 के लिए ये कागज़ लेकर आँगनवाड़ी केंद्र जाएँ: आधार कार्ड, बैंक पासबुक, जच्चा-बच्चा कार्ड। यह बिल्कुल मुफ़्त है!',
    summary: 'बहन, ये चार बातें याद रखें: आपका आधार कार्ड, बैंक पासबुक, जच्चा-बच्चा कार्ड, और अपने पास का आँगनवाड़ी केंद्र। यह सरकारी सहायता पूरी तरह मुफ़्त है।'
  },
  'ta-IN': {
    nativeName: 'தமிழ்',
    title: 'தேவையான ஆவணங்கள்',
    aadhaar: 'ஆதார் அட்டை',
    bank: 'வங்கி கணக்கு புத்தகம்',
    mcp: 'தாய் சேய் அட்டை',
    anganwadi: 'அங்கன்வாடி மையம்',
    antiFraud: 'அரசு உதவி 100% இலவசம் • யாரிடமும் பணம் கொடுக்க வேண்டாம்',
    speakAgain: 'மீண்டும் கேட்க',
    share: 'குடும்பத்திற்கு பகிரவும்',
    shareText: 'பிரதான் மந்திரி மாத்ரு வந்தனா யோஜனா (PMMVY) உதவிக்கு: ஆதார் அட்டை, வங்கி புத்தகம், தாய் சேய் அட்டை எடுத்துக்கொண்டு அங்கன்வாடி செல்லுங்கள். இது முற்றிலும் இலவசம்!',
    summary: 'அக்கா, இந்த நான்கு விஷயங்களை நினைவில் கொள்ளுங்கள்: ஆதார் அட்டை, வங்கி புத்தகம், தாய் சேய் அட்டை மற்றும் உங்கள் அங்கன்வாடி மையம். இது முற்றிலும் இலவசம்.'
  },
  'te-IN': {
    nativeName: 'తెలుగు',
    title: 'కావలసిన కాగితాలు',
    aadhaar: 'ఆధార్ కార్డు',
    bank: 'బ్యాంక్ పాస్ పుస్తకం',
    mcp: 'తల్లి-పిల్లల కార్డు',
    anganwadi: 'అంగన్‌వాడీ కేంద్రం',
    antiFraud: 'ప్రభుత్వ సాయం 100% ఉచితం • ఎవరికీ డబ్బులు ఇవ్వకండి',
    speakAgain: 'మళ్ళీ వినండి',
    share: 'కుటుంబానికి పంపండి',
    shareText: 'పీఎం మాతృ వందన యోజన (PMMVY) కోసం: ఆధార్ కార్డు, బ్యాంక్ పాస్ పుస్తకం, తల్లి-పిల్లల కార్డు తీసుకుని అంగన్‌వాడీకి వెళ్లండి. ఇది పూర్తిగా ఉచితం!',
    summary: 'అక్కా, ఈ నాలుగు విషయాలు గుర్తుంచుకోండి: మీ ఆధార్ కార్డు, బ్యాంక్ పాస్ బుక్, తల్లి-పిల్లల కార్డు మరియు అంగన్‌వాడీ కేంద్రం. ఇది పూర్తిగా ఉచితం.'
  },
  'kn-IN': {
    nativeName: 'ಕನ್ನಡ',
    title: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು',
    aadhaar: 'ಆಧಾರ್ ಕಾರ್ಡ್',
    bank: 'ಬ್ಯಾಂಕ್ ಪಾಸ್ ಬುಕ್',
    mcp: 'ತಾಯಿ-ಮಗು ಕಾರ್ಡ್',
    anganwadi: 'ಅಂಗನವಾಡಿ ಕೇಂದ್ರ',
    antiFraud: 'ಸರ್ಕಾರಿ ಸಹಾಯ 100% ಉಚಿತ • ಯಾರಿಗೂ ಹಣ ನೀಡಬೇಡಿ',
    speakAgain: 'ಮತ್ತೆ ಕೇಳಿ',
    share: 'ಕುಟುಂಬಕ್ಕೆ ಕಳುಹಿಸಿ',
    shareText: 'ಪಿಎಂ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ (PMMVY) ಪಡೆಯಲು: ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್ ಬುಕ್, ತಾಯಿ-ಮಗು ಕಾರ್ಡ್. ಅಂಗನವಾಡಿಗೆ ಭೇಟಿ ನೀಡಿ. ಇದು ಸಂಪೂರ್ಣ ಉಚಿತ!',
    summary: 'ಅಕ್ಕ, ಈ ನಾಲ್ಕು ವಿಷಯಗಳನ್ನು ನೆನಪಿಡಿ: ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್ ಬುಕ್, ತಾಯಿ-ಮಗು ಕಾರ್ಡ್ ಮತ್ತು ಅಂಗನವಾಡಿ ಕೇಂದ್ರ. ಇದು ಸಂಪೂರ್ಣ ಉಚಿತ.'
  },
  'ml-IN': {
    nativeName: 'മലയാളം',
    title: 'ആവശ്യമായ രേഖകൾ',
    aadhaar: 'ആധാർ കാർഡ്',
    bank: 'ബാങ്ക് പാസ്ബുക്ക്',
    mcp: 'അമ്മയും കുഞ്ഞും കാർഡ്',
    anganwadi: 'അങ്കണവാടി കേന്ദ്രം',
    antiFraud: 'സർക്കാർ സഹായം 100% സൗജന്യമാണ് • ആർക്കും പണം നൽകരുത്',
    speakAgain: 'വീണ്ടും കേൾക്കാം',
    share: 'കുടുംബത്തിന് അയക്കൂ',
    shareText: 'മാതൃ വന്ദന യോജന (PMMVY) ആനുകൂല്യങ്ങൾക്ക്: ആധാർ കാർഡ്, ബാങ്ക് പാസ്ബുക്ക്, അമ്മയും കുഞ്ഞും കാർഡ്. അടുത്തുള്ള അങ്കണവാടിയിൽ പോകുക. ഇത് സൗജന്യമാണ്!',
    summary: 'ചേച്ചീ, ഈ നാല് കാര്യങ്ങൾ ഓർക്കുക: ആധാർ കാർഡ്, ബാങ്ക് പാസ്ബുക്ക്, അമ്മയും കുഞ്ഞും കാർഡ്, അങ്കണവാടി കേന്ദ്രം. ഇത് തികച്ചും സൗജന്യമാണ്.'
  },
  'mr-IN': {
    nativeName: 'मराठी',
    title: 'आवश्यक कागदपत्रे',
    aadhaar: 'आधार कार्ड',
    bank: 'बँक पासबुक',
    mcp: 'माता-बाल कार्ड',
    anganwadi: 'अंगणवाडी केंद्र',
    antiFraud: 'सरकारी मदत 100% मोफत आहे • कोणालाही पैसे देऊ नका',
    speakAgain: 'पुन्हा ऐका',
    share: 'कुटुंबाला पाठवा',
    shareText: 'प्रधानमंत्री मातृ वंदना योजनेसाठी (PMMVY): आधार कार्ड, बँक पासबुक, माता-बाल कार्ड घेऊन अंगणवाडीत जा. हे पूर्णपणे मोफत आहे!',
    summary: 'ताई, या चार गोष्टी लक्षात ठेवा: तुमचे आधार कार्ड, बँक पासबुक, माता-बाल कार्ड आणि अंगणवाडी केंद्र. ही सरकारी मदत पूर्णपणे मोफत आहे.'
  },
  'bn-IN': {
    nativeName: 'বাংলা',
    title: 'প্রয়োজনীয় কাগজপত্র',
    aadhaar: 'আধার কার্ড',
    bank: 'ব্যাংক পাসবই',
    mcp: 'মা ও শিশুর কার্ড',
    anganwadi: 'অঙ্গনওয়াড়ি কেন্দ্র',
    antiFraud: 'সরকারি সহায়তা ১০০% বিনামূল্যে • কাউকে টাকা দেবেন না',
    speakAgain: 'আবার শুনুন',
    share: 'পরিবারকে পাঠান',
    shareText: 'প্রধানমন্ত্রী মাতৃ বন্দনা যোজনা (PMMVY): আধার কার্ড, ব্যাংক পাসবই, মা ও শিশুর কার্ড নিয়ে অঙ্গনওয়াড়িতে যান। এটি সম্পূর্ণ বিনামূল্যে!',
    summary: 'বোন, এই চারটি কথা মনে রাখবেন: আধার কার্ড, ব্যাংক বই, মা ও শিশুর কার্ড এবং অঙ্গনওয়াড়ি কেন্দ্র। এটি বিনামূল্যে।'
  }
};

// Spoken Error Messages in various Indian languages
const ERROR_PROMPTS = {
  'hi-IN': {
    unclear: 'बहन, मुझे आपकी आवाज़ साफ़ नहीं आई। कृपया बड़ा बटन दबाकर दोबारा बोलें।',
    micDenied: 'कृपया माइक चालू करने की अनुमति दें, ताकि मैं आपकी बात सुन सकूँ।',
    network: 'इंटरनेट में थोड़ी रुकावट है बहन। कृपया कुछ देर में कोशिश करें।',
    api: 'माफ़ करना बहन, सर्वर से संपर्क नहीं हो पाया। कृपया दोबारा कोशिश करें।',
    generic: 'माफ़ करना बहन, सुनने में थोड़ी रुकावट आई। आँगनवाड़ी केंद्र से संपर्क कर सकती हैं।'
  },
  'ta-IN': {
    unclear: 'அக்கா, உங்கள் குரல் தெளிவாகக் கேட்கவில்லை. தயவுசெய்து பெரிய பொத்தானை அழுத்தி மீண்டும் பேசுங்கள்.',
    micDenied: 'உங்கள் குரலைக் கேட்க மைக் அனுமதியை இயக்கவும்.',
    network: 'இணைய இணைப்பில் சிக்கல் உள்ளது அக்கா. சிறிது நேரம் கழித்து முயற்சிக்கவும்.',
    api: 'மன்னிக்கவும் அக்கா, சர்வர் தொடர்பு கிடைக்கவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
    generic: 'மன்னிக்கவும் அக்கா, கேட்க முடியவில்லை. அருகிலுள்ள அங்கன்வாடி மையத்தை அணுகவும்.'
  },
  'te-IN': {
    unclear: 'అక్కా, మీ మాట స్పష్టంగా వినపడలేదు. దయచేసి పెద్ద బటన్ నొక్కి మళ్ళీ చెప్పండి.',
    micDenied: 'మీ మాట వినడానికి దయచేసి మైక్ అనుమతి ఇవ్వండి.',
    network: 'ఇంటర్నెట్ సరిగ్గా లేదు అక్కా. కాసేపటి తర్వాత ప్రయత్నించండి.',
    api: 'క్షమించండి అక్కా, సర్వర్ తో సమస్య వచ్చింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    generic: 'క్షమించండి అక్కా, అర్థం కాలేదు. దగ్గరిలోని అంగన్‌వాడీని కలవండి.'
  },
  'kn-IN': {
    unclear: 'ಅಕ್ಕ, ನಿಮ್ಮ ಧ್ವನಿ ಸರಿಯಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಹೇಳಿ.',
    micDenied: 'ನಿಮ್ಮ ಮಾತು ಕೇಳಲು ಮೈಕ್ ಅನುಮತಿ ನೀಡಿ.',
    network: 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕದಲ್ಲಿ ಸಮಸ್ಯೆಯಾಗಿದೆ ಅಕ್ಕ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.',
    api: 'ಕ್ಷಮಿಸಿ ಅಕ್ಕ, ಸರ್ವರ್ ಸಂಪರ್ಕ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    generic: 'ಕ್ಷಮಿಸಿ ಅಕ್ಕ, ತಿಳಿಯಲಿಲ್ಲ. ಅಂಗನವಾಡಿ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.'
  },
  'ml-IN': {
    unclear: 'ചേച്ചീ, ശബ്ദം വ്യക്തമായി കേട്ടില്ല. വലിയ ബട്ടൺ അമർത്തി വീണ്ടും പറയൂ.',
    micDenied: 'നിങ്ങളുടെ സംസാരം കേൾക്കാൻ മൈക്രോഫോൺ അനുമതി നൽകുക.',
    network: 'ഇന്റർനെറ്റ് തടസ്സമുണ്ട് ചേച്ചീ. അല്പം കഴിഞ്ഞ് ശ്രമിക്കൂ.',
    api: 'ക്ഷമിക്കണം ചേച്ചീ, സെർവർ തകരാർ കാരണം സാധിച്ചില്ല. വീണ്ടും ശ്രമിക്കൂ.',
    generic: 'ക്ഷമിക്കണം ചേച്ചീ, കേൾക്കാൻ സാധിച്ചില്ല. അടുത്തുള്ള അങ്കണവാടിയിൽ ചോദിക്കൂ.'
  },
  'mr-IN': {
    unclear: 'ताई, मला तुमचा आवाज नीट ऐकू आला नाही. कृपया पुन्हा सांगा.',
    micDenied: 'तुमचा आवाज ऐकण्यासाठी कृपया माइक चालू करण्याची परवानगी द्या.',
    network: 'इंटरनेटमध्ये थोडी अडचण आहे ताई. थोड्या वेळाने प्रयत्न करा.',
    api: 'माफ करा ताई, सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.',
    generic: 'माफ करा ताई, ऐकण्यात अडचण आली. अंगणवाडी केंद्राशी संपर्क साधा.'
  },
  'default': {
    unclear: 'बहन, मुझे आपकी आवाज़ साफ़ नहीं आई। कृपया बड़ा बटन दबाकर दोबारा बोलें।',
    micDenied: 'कृपया माइक की अनुमति दें। Please allow microphone permission.',
    network: 'इंटरनेट में रुकावट है। Network error.',
    api: 'माफ़ करना बहन, सर्वर से संपर्क नहीं हो पाया। Please try again.',
    generic: 'माफ़ करना बहन, थोड़ी रुकावट आई। आँगनवाड़ी केंद्र से संपर्क करें।'
  }
};

export class SakhiVoiceApp {
  constructor() {
    this.history = [];
    this.lastDetectedLanguageCode = 'hi-IN';
    this.lastDetectedLanguageName = 'सखी';
    this.lastSakhiReply = '';
    this.currentStep = 'discover';

    // State flags
    this.isRecording = false;
    this.isSpeaking = false;
    this.isThinking = false;

    // Audio recording & silence detection
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.silenceCheckInterval = null;
    this.silenceStartTime = null;
    this.firstSpeechTime = null;
    this.hasSpoken = false;
    this.recordStartTime = null;
    this.maxDurationTimer = null;
    this.activeMimeType = 'audio/webm';

    // Speech Synthesis & Cloud Audio Player
    this.synth = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
    this.currentAudioPlayer = null;

    this.initDOMElements();
    this.bindEvents();
    this.startFirstLoadGreeting();
  }

  initDOMElements() {
    if (typeof document === 'undefined') return;

    this.headerLangTag = document.getElementById('header-lang-tag');
    this.btnResetChat = document.getElementById('btn-reset-chat');
    this.stepDots = document.querySelectorAll('.step-dot');
    this.statusBeacon = document.getElementById('status-beacon');
    this.btnMic = document.getElementById('btn-mic');
    this.btnRepeat = document.getElementById('btn-repeat');

    // Dialogue area
    this.userTranscript = document.getElementById('user-transcript');
    this.userTranscriptText = document.getElementById('user-transcript-text');
    this.sakhiReplyText = document.getElementById('sakhi-reply-text');

    // Developer Debug Line
    this.debugText = document.getElementById('debug-text');

    // Fallback text input
    this.fallbackContainer = document.getElementById('fallback-input-container');
    this.fallbackInput = document.getElementById('fallback-text-input');
    this.btnFallbackSend = document.getElementById('btn-fallback-send');

    // Take-Home Card Modal
    this.takeHomeModal = document.getElementById('take-home-modal');
    this.takeHomeTitle = document.getElementById('take-home-title');
    this.labelAadhaar = document.getElementById('label-aadhaar');
    this.labelBank = document.getElementById('label-bank');
    this.labelMcp = document.getElementById('label-mcp');
    this.labelAnganwadi = document.getElementById('label-anganwadi');
    this.antiFraudText = document.getElementById('anti-fraud-text');
    this.btnCardSpeak = document.getElementById('btn-card-speak');
    this.btnCardSpeakText = document.getElementById('btn-card-speak-text');
    this.btnCardShare = document.getElementById('btn-card-share');
    this.btnCardShareText = document.getElementById('btn-card-share-text');
    this.btnCloseCard = document.getElementById('btn-close-card');
  }

  updateDebug(text) {
    if (this.debugText) {
      this.debugText.textContent = text;
    }
    console.log(`[Sakhi Debug] ${text}`);
  }

  startFirstLoadGreeting() {
    const cyclingText = "नमस्ते • வணக்கம் • నమస్కారం • ನಮಸ್ಕಾರ • നമസ്കാരം • नमस्कार";
    if (this.sakhiReplyText) {
      this.sakhiReplyText.textContent = cyclingText;
    }
    this.lastSakhiReply = cyclingText;

    setTimeout(() => {
      this.speakText("नमस्ते! வணக்கம்! నమస్కారం! నేను సఖిని. बड़ा बटन दबाकर अपनी बात बताइए।");
    }, 600);
  }

  // Audio Recording with Silence Detection
  async startRecording() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      this.speakKindError('micDenied');
      return;
    }

    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    } catch (err) {
      console.warn('[Sakhi] Mic permission denied:', err);
      this.updateDebug(`Mic access denied: ${err.name}`);
      this.speakKindError('micDenied');
      if (this.fallbackContainer) this.fallbackContainer.style.display = 'flex';
      return;
    }

    // Determine supported MIME type
    let chosenMime = 'audio/webm';
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        chosenMime = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        chosenMime = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        chosenMime = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        chosenMime = 'audio/ogg';
      }
    }
    this.activeMimeType = chosenMime;

    this.audioChunks = [];
    try {
      this.mediaRecorder = new MediaRecorder(this.audioStream, { mimeType: chosenMime });
    } catch {
      this.mediaRecorder = new MediaRecorder(this.audioStream);
      this.activeMimeType = this.mediaRecorder.mimeType || 'audio/webm';
    }

    this.recordStartTime = Date.now();
    this.hasSpoken = false;
    this.firstSpeechTime = null;
    this.silenceStartTime = null;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.cleanupRecordingResources();

      const durationMs = Date.now() - (this.recordStartTime || Date.now());
      const audioBlob = new Blob(this.audioChunks, { type: this.activeMimeType });

      console.log(`[Sakhi Debug] Recording ended: ${durationMs}ms, size: ${audioBlob.size} bytes, MIME: ${this.activeMimeType}`);

      // Reject recordings under 0.5s or empty
      if (durationMs < 500 || this.audioChunks.length === 0 || audioBlob.size === 0) {
        this.updateDebug(`[Rejected: Too short (${durationMs}ms) • Tap & speak]`);
        this.setUIState('idle');
        return;
      }

      this.updateDebug(`[Captured ${(audioBlob.size / 1024).toFixed(1)}KB | ${this.activeMimeType} | ${(durationMs / 1000).toFixed(1)}s]`);
      this.processRecordedAudio(audioBlob, this.activeMimeType, durationMs);
    };

    // Setup AudioContext for silence detection
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.25;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const VOLUME_THRESHOLD = 6;

      this.silenceCheckInterval = setInterval(() => {
        if (!this.analyser || !this.isRecording) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const elapsedSinceStart = Date.now() - this.recordStartTime;

        this.updateDebug(`[Recording ${(elapsedSinceStart / 1000).toFixed(1)}s | Vol: ${Math.round(avg)} | Speech: ${this.hasSpoken ? 'Yes' : 'Waiting'}]`);

        if (avg > VOLUME_THRESHOLD) {
          if (!this.hasSpoken) {
            this.hasSpoken = true;
            this.firstSpeechTime = Date.now();
          }
          this.silenceStartTime = null;
        } else if (this.hasSpoken) {
          // Never auto-stop in first 2 seconds
          if (elapsedSinceStart < 2000) return;

          // Wait at least 1.5s after first speech
          if (Date.now() - this.firstSpeechTime < 1500) return;

          if (!this.silenceStartTime) {
            this.silenceStartTime = Date.now();
          } else if (Date.now() - this.silenceStartTime >= 1500) {
            console.log('[Sakhi] 1.5s post-speech silence detected. Auto-stopping.');
            this.stopRecording();
          }
        }
      }, 50);

    } catch (e) {
      console.warn('[Sakhi] AudioContext silence analyser unavailable:', e);
    }

    this.maxDurationTimer = setTimeout(() => {
      this.stopRecording();
    }, 30000);

    this.mediaRecorder.start(200);
    this.isRecording = true;
    this.setUIState('listening');
    this.updateDebug(`[Listening... MIME: ${this.activeMimeType}]`);
  }

  stopRecording() {
    if (!this.isRecording) return;
    this.isRecording = false;

    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
    if (this.silenceCheckInterval) {
      clearInterval(this.silenceCheckInterval);
      this.silenceCheckInterval = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        if (typeof this.mediaRecorder.requestData === 'function') {
          this.mediaRecorder.requestData();
        }
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('[Sakhi] mediaRecorder.stop error:', e);
      }
    }
  }

  cleanupRecordingResources() {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    if (this.audioContext) {
      try { this.audioContext.close(); } catch { /* ignore */ }
      this.audioContext = null;
    }
    this.analyser = null;
  }

  processRecordedAudio(blob, mimeType, durationMs) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      this.sendToGemini({
        audio: base64Data,
        mimeType: mimeType,
        lastLanguageCode: this.lastDetectedLanguageCode,
        history: this.history,
        durationMs: durationMs
      });
    };
    reader.readAsDataURL(blob);
  }

  async sendToGemini(payload) {
    this.isThinking = true;
    this.setUIState('thinking');
    this.updateDebug(`[Sending to Gemini AI... ${(payload.audio ? Math.round(payload.audio.length / 1024) + 'KB' : 'Text')}]`);

    try {
      // Direct client call to Gemini!
      const data = await callClientGeminiChat(payload);
      this.isThinking = false;

      console.log('[Sakhi Debug] Client Gemini Response:', data);

      if (data.error_type === 'api_error') {
        this.updateDebug('[API Error: Gemini service unavailable]');
        this.speakKindError('api');
        return;
      }

      const detectedLang = data.detected_language || 'Hindi';
      const langCode = data.language_code || this.lastDetectedLanguageCode || 'hi-IN';
      const transcript = (data.transcript || '').trim();
      const reply = (data.reply || '').trim();
      const step = data.step || 'discover';

      this.lastDetectedLanguageCode = langCode;
      this.lastDetectedLanguageName = detectedLang;

      const cardInfo = LOCALIZED_CARD_DATA[langCode] || LOCALIZED_CARD_DATA['hi-IN'];
      if (this.headerLangTag) {
        this.headerLangTag.textContent = cardInfo.nativeName || detectedLang;
      }

      if (data.error_type === 'empty_audio' || (!transcript && !reply)) {
        this.updateDebug(`[Silence/Unclear audio detected • Lang: ${langCode}]`);
        this.speakKindError('unclear');
        return;
      }

      if (transcript && this.userTranscript) {
        this.userTranscript.style.display = 'flex';
        this.userTranscriptText.textContent = transcript;
      }

      this.lastSakhiReply = reply;
      if (this.sakhiReplyText) {
        this.sakhiReplyText.textContent = reply;
      }
      this.updateStepDots(step);

      this.updateDebug(`[OK: ${detectedLang} (${langCode}) | Step: ${step}]`);

      this.history.push({
        user: transcript || 'User Voice Input',
        model: reply
      });
      if (this.history.length > 10) {
        this.history = this.history.slice(-10);
      }

      this.speakText(reply, langCode, () => {
        if (step === 'done') {
          setTimeout(() => {
            this.openTakeHomeModal(langCode);
          }, 800);
        }
      });

    } catch (err) {
      console.error('[Sakhi Client Error]:', err);
      this.isThinking = false;
      this.updateDebug(`[Network Error: ${err.message}]`);
      this.speakKindError('network');
    }
  }

  // Voice Output
  async speakText(text, languageCode = null, onComplete = null) {
    const langCode = languageCode || this.lastDetectedLanguageCode || 'hi-IN';
    this.stopSpeaking();

    let matchingVoice = null;
    if (this.synth) {
      try {
        const voices = this.synth.getVoices();
        const langPrefix = langCode.split('-')[0].toLowerCase();
        matchingVoice = voices.find(v => {
          const vLang = (v.lang || '').replace('_', '-').toLowerCase();
          return vLang.startsWith(langPrefix) || vLang.includes(langCode.toLowerCase());
        });
      } catch { /* ignore */ }
    }

    if (matchingVoice && this.synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = matchingVoice;
      utterance.lang = langCode;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;

      let finished = false;
      let safetyTimeout = null;

      const finish = () => {
        if (finished) return;
        finished = true;
        if (safetyTimeout) clearTimeout(safetyTimeout);
        this.isSpeaking = false;
        this.setUIState('idle');
        if (onComplete) onComplete();
      };

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.setUIState('speaking');
      };
      utterance.onend = finish;
      utterance.onerror = finish;

      const timeoutDuration = Math.max(3000, (text || '').length * 120);
      safetyTimeout = setTimeout(finish, timeoutDuration);

      try {
        this.synth.speak(utterance);
        return;
      } catch (e) {
        console.warn('[Sakhi] Native speech synthesis failed, trying Gemini TTS:', e);
      }
    }

    // Fallback: Gemini Cloud TTS
    try {
      this.setUIState('thinking');
      const ttsData = await callClientGeminiTTS({ text, language_code: langCode });

      if (!ttsData.fallback && ttsData.audio) {
        const audioSrc = `data:${ttsData.mimeType || 'audio/wav'};base64,${ttsData.audio}`;
        this.currentAudioPlayer = new Audio(audioSrc);

        this.currentAudioPlayer.onplay = () => {
          this.isSpeaking = true;
          this.setUIState('speaking');
        };
        this.currentAudioPlayer.onended = () => {
          this.isSpeaking = false;
          this.setUIState('idle');
          if (onComplete) onComplete();
        };
        this.currentAudioPlayer.onerror = () => {
          this.isSpeaking = false;
          this.setUIState('idle');
          if (onComplete) onComplete();
        };

        await this.currentAudioPlayer.play();
        return;
      }
    } catch (e) {
      console.warn('[Sakhi] Gemini Cloud TTS failed:', e);
    }

    // Final fallback to default device synthesis
    if (this.synth) {
      const fallbackUtterance = new SpeechSynthesisUtterance(text);
      fallbackUtterance.lang = langCode;
      fallbackUtterance.onstart = () => {
        this.isSpeaking = true;
        this.setUIState('speaking');
      };
      fallbackUtterance.onend = () => {
        this.isSpeaking = false;
        this.setUIState('idle');
        if (onComplete) onComplete();
      };
      fallbackUtterance.onerror = () => {
        this.isSpeaking = false;
        this.setUIState('idle');
        if (onComplete) onComplete();
      };
      try {
        this.synth.speak(fallbackUtterance);
      } catch {
        this.setUIState('idle');
        if (onComplete) onComplete();
      }
    } else {
      this.setUIState('idle');
      if (onComplete) onComplete();
    }
  }

  stopSpeaking() {
    if (this.synth) {
      try { this.synth.cancel(); } catch { /* ignore */ }
    }
    if (this.currentAudioPlayer) {
      try {
        this.currentAudioPlayer.pause();
        this.currentAudioPlayer.currentTime = 0;
      } catch { /* ignore */ }
      this.currentAudioPlayer = null;
    }
    this.isSpeaking = false;
    this.setUIState('idle');
  }

  speakKindError(errorType) {
    this.setUIState('error');
    const langCode = this.lastDetectedLanguageCode || 'default';
    const dict = ERROR_PROMPTS[langCode] || ERROR_PROMPTS['default'];
    const msg = dict[errorType] || dict.generic;

    if (this.sakhiReplyText) {
      this.sakhiReplyText.textContent = msg;
    }
    this.updateDebug(`[Error spoken: ${errorType} • ${langCode}]`);
    this.speakText(msg, langCode, () => {
      this.setUIState('idle');
    });
  }

  setUIState(state) {
    if (!this.statusBeacon || !this.btnMic) return;
    this.statusBeacon.classList.remove('idle', 'listening', 'thinking', 'speaking', 'error');
    this.statusBeacon.classList.add(state);

    if (state === 'listening') {
      this.btnMic.setAttribute('aria-label', 'सुन रही हूँ...');
    } else if (state === 'speaking') {
      this.btnMic.setAttribute('aria-label', 'सखी बोल रही है...');
    } else if (state === 'thinking') {
      this.btnMic.setAttribute('aria-label', 'सोच रही हूँ...');
    } else {
      this.btnMic.setAttribute('aria-label', 'बोलने के लिए बड़ा बटन दबाएँ');
    }
  }

  updateStepDots(step) {
    this.currentStep = step;
    const stepOrder = ['discover', 'check', 'plan', 'teachback', 'done'];
    const activeIndex = stepOrder.indexOf(step);

    if (this.stepDots) {
      this.stepDots.forEach((dot, idx) => {
        dot.classList.remove('active', 'completed');
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else if (idx < activeIndex) {
          dot.classList.add('completed');
        }
      });
    }
  }

  updateTakeHomeLocalization(langCode) {
    const code = langCode || this.lastDetectedLanguageCode || 'hi-IN';
    const c = LOCALIZED_CARD_DATA[code] || LOCALIZED_CARD_DATA['hi-IN'];

    if (this.takeHomeTitle) this.takeHomeTitle.textContent = c.title;
    if (this.labelAadhaar) this.labelAadhaar.textContent = c.aadhaar;
    if (this.labelBank) this.labelBank.textContent = c.bank;
    if (this.labelMcp) this.labelMcp.textContent = c.mcp;
    if (this.labelAnganwadi) this.labelAnganwadi.textContent = c.anganwadi;
    if (this.antiFraudText) this.antiFraudText.textContent = c.antiFraud;
    if (this.btnCardSpeakText) this.btnCardSpeakText.textContent = c.speakAgain;
    if (this.btnCardShareText) this.btnCardShareText.textContent = c.share;
  }

  openTakeHomeModal(langCode) {
    this.updateTakeHomeLocalization(langCode);
    if (this.takeHomeModal) this.takeHomeModal.classList.add('active');
  }

  closeTakeHomeModal() {
    if (this.takeHomeModal) this.takeHomeModal.classList.remove('active');
  }

  speakTakeHomeCard() {
    const code = this.lastDetectedLanguageCode || 'hi-IN';
    const c = LOCALIZED_CARD_DATA[code] || LOCALIZED_CARD_DATA['hi-IN'];
    this.speakText(c.summary, code);
  }

  async shareTakeHomeCard() {
    const code = this.lastDetectedLanguageCode || 'hi-IN';
    const c = LOCALIZED_CARD_DATA[code] || LOCALIZED_CARD_DATA['hi-IN'];
    const shareData = {
      title: 'Sakhi - PMMVY',
      text: c.shareText,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('[Sakhi] Web Share API failed, using WhatsApp fallback:', err);
        }
      }
    }

    const encodedText = encodeURIComponent(`${c.shareText}\n${typeof window !== 'undefined' ? window.location.href : ''}`);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    if (typeof window !== 'undefined') window.open(whatsappUrl, '_blank');
  }

  resetConversation() {
    this.stopSpeaking();
    if (this.isRecording) {
      this.stopRecording();
    }
    this.history = [];
    if (this.userTranscript) this.userTranscript.style.display = 'none';
    if (this.userTranscriptText) this.userTranscriptText.textContent = '';
    if (this.headerLangTag) this.headerLangTag.textContent = 'सखी';
    this.updateStepDots('discover');
    this.closeTakeHomeModal();
    this.updateDebug('[Reset: Ready for new conversation]');
    this.startFirstLoadGreeting();
  }

  bindEvents() {
    if (this.btnMic) {
      this.btnMic.addEventListener('click', () => {
        if (this.isRecording) {
          console.log('[Sakhi] Manual second-tap stop triggered.');
          this.stopRecording();
        } else {
          this.startRecording();
        }
      });
    }

    if (this.btnRepeat) {
      this.btnRepeat.addEventListener('click', () => {
        if (this.lastSakhiReply) {
          this.speakText(this.lastSakhiReply, this.lastDetectedLanguageCode);
        } else {
          this.startFirstLoadGreeting();
        }
      });
    }

    if (this.btnResetChat) {
      this.btnResetChat.addEventListener('click', () => {
        this.resetConversation();
      });
    }

    if (this.btnFallbackSend) {
      this.btnFallbackSend.addEventListener('click', () => {
        const text = this.fallbackInput ? this.fallbackInput.value.trim() : '';
        if (text) {
          if (this.userTranscript) this.userTranscript.style.display = 'flex';
          if (this.userTranscriptText) this.userTranscriptText.textContent = text;
          if (this.fallbackInput) this.fallbackInput.value = '';
          this.sendToGemini({
            userText: text,
            lastLanguageCode: this.lastDetectedLanguageCode,
            history: this.history
          });
        }
      });
    }

    if (this.fallbackInput) {
      this.fallbackInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const text = this.fallbackInput.value.trim();
          if (text) {
            if (this.userTranscript) this.userTranscript.style.display = 'flex';
            if (this.userTranscriptText) this.userTranscriptText.textContent = text;
            this.fallbackInput.value = '';
            this.sendToGemini({
              userText: text,
              lastLanguageCode: this.lastDetectedLanguageCode,
              history: this.history
            });
          }
        }
      });
    }

    if (this.btnCardSpeak) {
      this.btnCardSpeak.addEventListener('click', () => {
        this.speakTakeHomeCard();
      });
    }

    if (this.btnCardShare) {
      this.btnCardShare.addEventListener('click', () => {
        this.shareTakeHomeCard();
      });
    }

    if (this.btnCloseCard) {
      this.btnCloseCard.addEventListener('click', () => {
        this.closeTakeHomeModal();
      });
    }

    if (this.takeHomeModal) {
      this.takeHomeModal.addEventListener('click', (e) => {
        if (e.target === this.takeHomeModal) {
          this.closeTakeHomeModal();
        }
      });
    }
  }
}

// Requirement 3: Safe initialization - zero top-level window/document execution at import time
export function initSakhi() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }
  if (!window.sakhiApp) {
    window.sakhiApp = new SakhiVoiceApp();
  }
  return window.sakhiApp;
}

// Auto-boot in browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSakhi);
  } else {
    initSakhi();
  }
}
