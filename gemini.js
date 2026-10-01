/**
 * gemini.js - Pure Client-Side Gemini Multimodal & TTS Integration
 * 
 * Runs entirely in the browser (Static Vite App).
 * - Reads API key from import.meta.env.VITE_GEMINI_API_KEY
 * - Sends audio/webm inlineData directly to Google Generative Language API
 * - Transcribes speech, auto-detects Indian language, and generates reply
 * - Performs safe JSON parsing (strip fences + regex fallback) with 1-retry
 * - Provides cloud TTS fallback when device lacks regional Indian voices
 */

import { getSystemPrompt } from './prompt.js';

// Differentiated spoken error responses
const ERROR_RESPONSES = {
  'hi-IN': {
    empty_audio: 'बहन, मुझे आपकी आवाज़ साफ़ नहीं आई। कृपया बड़ा बटन दबाकर दोबारा बोलें।',
    api_error: 'माफ़ करना बहन, सर्वर से संपर्क नहीं हो पाया। कृपया दोबारा कोशिश करें।',
    network_error: 'इंटरनेट में थोड़ी रुकावट है बहन। कृपया कुछ देर में कोशिश करें।'
  },
  'ta-IN': {
    empty_audio: 'அக்கா, உங்கள் குரல் தெளிவாகக் கேட்கவில்லை. தயவுசெய்து பெரிய பொத்தானை அழுத்தி மீண்டும் பேசுங்கள்.',
    api_error: 'மன்னிக்கவும் அக்கா, சர்வர் தொடர்பு கிடைக்கவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
    network_error: 'இணைய இணைப்பில் சிக்கல் உள்ளது அக்கா. சிறிது நேரம் கழித்து முயற்சிக்கவும்.'
  },
  'te-IN': {
    empty_audio: 'అక్కా, మీ మాట స్పష్టంగా వినపడలేదు. దయచేసి పెద్ద బటన్ నొక్కి మళ్ళీ చెప్పండి.',
    api_error: 'క్షమించండి అక్కా, సర్వర్ తో సమస్య వచ్చింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    network_error: 'ఇంటర్నెట్ సరిగ్గా లేదు అక్కా. కాసేపటి తర్వాత ప్రయత్నించండి.'
  },
  'kn-IN': {
    empty_audio: 'ಅಕ್ಕ, ನಿಮ್ಮ ಧ್ವನಿ ಸರಿಯಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಹೇಳಿ.',
    api_error: 'ಕ್ಷಮಿಸಿ ಅಕ್ಕ, ಸರ್ವರ್ ಸಂಪರ್ಕ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    network_error: 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕದಲ್ಲಿ ಸಮಸ್ಯೆಯಾಗಿದೆ ಅಕ್ಕ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.'
  },
  'ml-IN': {
    empty_audio: 'ചേച്ചീ, ശബ്ദം വ്യക്തമായി കേട്ടില്ല. വലിയ ബട്ടൺ അമർത്തി വീണ്ടും പറയൂ.',
    api_error: 'ക്ഷമിക്കണം ചേച്ചീ, സെർവർ തകരാർ കാരണം സാധിച്ചില്ല. വീണ്ടും ശ്രമിക്കൂ.',
    network_error: 'ഇന്റർനെറ്റ് തടസ്സമുണ്ട് ചേച്ചീ. അല്പം കഴിഞ്ഞ് ശ്രമിക്കൂ.'
  },
  'mr-IN': {
    empty_audio: 'ताई, मला तुमचा आवाज नीट ऐकू आला नाही. कृपया पुन्हा सांगा.',
    api_error: 'माफ करा ताई, सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.',
    network_error: 'इंटरनेटमध्ये थोडी अडचण आहे ताई. थोड्या वेळाने प्रयत्न करा.'
  },
  'default': {
    empty_audio: 'बहन, मुझे आपकी आवाज़ साफ़ नहीं आई। कृपया बड़ा बटन दबाकर दोबारा बोलें।',
    api_error: 'माफ़ करना बहन, सर्वर से संपर्क नहीं हो पाया। कृपया दोबारा कोशिश करें।',
    network_error: 'इंटरनेट में थोड़ी रुकावट है बहन। कृपया कुछ देर में कोशिश करें।'
  }
};

// Safe JSON parser: strips code blocks and extracts outer JSON
function safeParseJson(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  let clean = rawText.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Normalize browser MIME types to Gemini-supported container types
function getGeminiMimeType(inputMime) {
  if (!inputMime) return 'audio/webm';
  const lower = String(inputMime).toLowerCase();
  if (lower.includes('mp4') || lower.includes('m4a')) return 'audio/mp4';
  if (lower.includes('ogg')) return 'audio/ogg';
  if (lower.includes('wav')) return 'audio/wav';
  if (lower.includes('mp3') || lower.includes('mpeg')) return 'audio/mp3';
  return 'audio/webm';
}

// Helper to call Gemini with 1 retry
async function fetchGeminiWithRetry(endpoint, payload, maxAttempts = 2) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`[Sakhi Client] Retrying Gemini call (Attempt ${attempt}/${maxAttempts})...`);
        await new Promise(r => setTimeout(r, 400));
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Sakhi Client] Gemini attempt ${attempt} returned HTTP ${res.status}:`, errText);
        lastError = new Error(`HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        lastError = new Error('Empty candidate parts from Gemini');
        continue;
      }

      const parsed = safeParseJson(rawText);
      if (parsed) {
        return { success: true, parsed, rawText };
      } else {
        lastError = new Error('JSON parse failure');
      }
    } catch (netErr) {
      lastError = netErr;
    }
  }

  return { success: false, error: lastError };
}

/**
 * Main Client-Side Gemini Chat Function
 */
export async function callClientGeminiChat({ audio, mimeType = 'audio/webm', lastLanguageCode = 'hi-IN', history = [], userText = '' }) {
  // Read Gemini key from Vite client environment variable
  const apiKey = (import.meta.env?.VITE_GEMINI_API_KEY || import.meta.env?.GEMINI_API_KEY || '').trim();
  const primaryModel = import.meta.env?.VITE_GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const langKey = ERROR_RESPONSES[lastLanguageCode] ? lastLanguageCode : 'default';

  // Fallback simulation if no API key is set
  if (!apiKey) {
    console.warn('[Sakhi Client] VITE_GEMINI_API_KEY not configured. Using offline simulation.');
    return {
      detected_language: lastLanguageCode.startsWith('ta') ? 'Tamil' : 'Hindi',
      language_code: lastLanguageCode || 'hi-IN',
      transcript: userText || 'नमस्ते',
      reply: lastLanguageCode.startsWith('ta')
        ? 'வணக்கம் அக்கா. கர்ப்ப காலத்தில் சத்தான உணவுக்கும் ஓய்வுக்கும் அரசு பணம் தருகிறது. இது உங்கள் முதல் குழந்தையா?'
        : 'नमस्ते बहन। गर्भावस्था में अच्छे खान-पान और आराम के लिए सरकार पैसे देती है। क्या यह आपका पहला बच्चा है?',
      step: 'check',
      checklist: [],
      confidence: 'high'
    };
  }

  try {
    const systemPrompt = getSystemPrompt(lastLanguageCode);
    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];

    const contents = [];

    // History turns
    for (const item of safeHistory) {
      if (item.user) {
        contents.push({ role: 'user', parts: [{ text: String(item.user) }] });
      }
      if (item.model) {
        contents.push({
          role: 'model',
          parts: [{ text: typeof item.model === 'string' ? item.model : JSON.stringify(item.model) }]
        });
      }
    }

    // Current turn
    const userParts = [];
    if (audio) {
      const cleanBase64 = String(audio).replace(/^data:audio\/[a-z0-9.+_-]+;base64,/i, '').trim();
      const geminiMime = getGeminiMimeType(mimeType);

      userParts.push({
        inlineData: {
          mimeType: geminiMime,
          data: cleanBase64
        }
      });
      userParts.push({
        text: 'Listen to this audio. Detect the language, transcribe it, and reply in JSON adhering strictly to the system instructions.'
      });
    } else {
      userParts.push({ text: String(userText || 'नमस्ते') });
    }

    contents.push({ role: 'user', parts: userParts });

    const geminiPayload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json'
      }
    };

    // Candidate models with failover
    const candidateModels = [
      primaryModel,
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash'
    ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

    let callResult = null;
    let usedModel = null;

    for (const model of candidateModels) {
      usedModel = model;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      callResult = await fetchGeminiWithRetry(endpoint, geminiPayload, 2);

      if (callResult.success) {
        break;
      }
    }

    if (!callResult || !callResult.success) {
      console.error('[Sakhi Client Error] Gemini call failed:', callResult?.error);
      const errDict = ERROR_RESPONSES[langKey] || ERROR_RESPONSES['default'];
      return {
        error_type: 'api_error',
        detected_language: lastLanguageCode.startsWith('ta') ? 'Tamil' : 'Hindi',
        language_code: lastLanguageCode,
        transcript: '',
        reply: errDict.api_error,
        step: 'discover',
        checklist: [],
        confidence: 'low'
      };
    }

    const { parsed, rawText } = callResult;
    console.log('[Sakhi Client Success] Raw Gemini Response:\n', rawText);

    const transcript = (parsed.transcript || '').trim();
    const detected_language = parsed.detected_language || 'Hindi';
    const language_code = parsed.language_code || lastLanguageCode || 'hi-IN';
    const allowedSteps = ['discover', 'check', 'plan', 'teachback', 'done'];
    const step = allowedSteps.includes(parsed.step) ? parsed.step : 'check';
    const checklist = Array.isArray(parsed.checklist) ? parsed.checklist : [];
    const confidence = parsed.confidence === 'low' ? 'low' : 'high';

    const isTranscriptEmpty = !transcript ||
      transcript.includes('[अस्पष्ट') ||
      transcript.includes('[অস্পষ্ট') ||
      transcript.includes('[Unclear') ||
      confidence === 'low';

    let reply = (typeof parsed.reply === 'string' && parsed.reply.trim()) ? parsed.reply.trim() : '';

    if (isTranscriptEmpty && !reply) {
      const errDict = ERROR_RESPONSES[language_code] || ERROR_RESPONSES[langKey] || ERROR_RESPONSES['default'];
      reply = errDict.empty_audio;
      return {
        error_type: 'empty_audio',
        detected_language,
        language_code,
        transcript: '',
        reply,
        step,
        checklist,
        confidence: 'low'
      };
    }

    return {
      error_type: null,
      detected_language,
      language_code,
      transcript,
      reply,
      step,
      checklist,
      confidence
    };

  } catch (fatalErr) {
    console.error('[Sakhi Client Fatal Exception]:', fatalErr);
    const errDict = ERROR_RESPONSES[langKey] || ERROR_RESPONSES['default'];
    return {
      error_type: 'api_error',
      detected_language: 'Hindi',
      language_code: lastLanguageCode || 'hi-IN',
      transcript: '',
      reply: errDict.api_error,
      step: 'discover',
      checklist: [],
      confidence: 'low'
    };
  }
}

/**
 * Client-Side Gemini Cloud TTS Fallback
 */
export async function callClientGeminiTTS({ text, language_code = 'hi-IN' }) {
  const apiKey = (import.meta.env?.VITE_GEMINI_API_KEY || import.meta.env?.GEMINI_API_KEY || '').trim();
  const ttsModel = import.meta.env?.VITE_GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';

  if (!apiKey || !text.trim()) {
    return { fallback: true };
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(ttsModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const payload = {
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Sulafat"
            }
          }
        }
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return { fallback: true };
    }

    const data = await res.json();
    const inlineAudio = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;

    if (inlineAudio && inlineAudio.data) {
      return {
        fallback: false,
        audio: inlineAudio.data,
        mimeType: inlineAudio.mimeType || 'audio/wav'
      };
    }

    return { fallback: true };
  } catch (e) {
    console.warn('[Sakhi Client TTS Error]:', e);
    return { fallback: true };
  }
}
