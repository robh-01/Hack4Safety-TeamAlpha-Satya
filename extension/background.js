const api = globalThis.browser ?? globalThis.chrome;
const SERVER_URL = 'http://localhost:3000';
let lastResult = null;

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp'
};

function normalizeFilename(filename, contentType) {
  const fallbackExt = MIME_TO_EXT[contentType?.toLowerCase()] || 'jpg';
  const safeName = String(filename || 'image').split(/[?#]/)[0].trim();
  const parts = safeName.split('/');
  const baseName = parts[parts.length - 1] || 'image';
  const hasAllowedExt = /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(baseName);

  if (hasAllowedExt) {
    return baseName;
  }

  return `${baseName.replace(/\.[^.]+$/, '') || 'image'}.${fallbackExt}`;
}

async function imageUrlToBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const contentType = response.headers.get('content-type');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve({ base64, contentType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Failed to fetch image: ${error.message}`);
  }
}

function getFilenameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1) || 'image';
    return filename.split(/[?#]/)[0] || 'image';
  } catch {
    return 'image';
  }
}

async function parseNDJSON(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const results = [];

  let chunk = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunk += decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].trim()) {
        try {
          results.push(JSON.parse(lines[i]));
        } catch (e) {
          console.error('Failed to parse line:', lines[i], e);
        }
      }
    }

    chunk = lines[lines.length - 1];
  }

  if (chunk.trim()) {
    try {
      results.push(JSON.parse(chunk));
    } catch (e) {
      console.error('Failed to parse final line:', chunk, e);
    }
  }

  return results;
}

async function analyzeImage(imageBase64, filename) {
  try {
    const response = await fetch(`${SERVER_URL}/api/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media: imageBase64,
        filename: filename
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const ndjsonResults = await parseNDJSON(response);

    let analysisResult = null;

    for (const item of ndjsonResults) {
      if (item.type === 'status') {
      } else if (item.type === 'result') {
        analysisResult = item.data;
      } else if (item.type === 'error') {
        throw new Error(item.message);
      }
    }

    if (!analysisResult) {
      throw new Error('No analysis result received from server');
    }

    return normalizeServerResult(analysisResult);
  } catch (error) {
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

function normalizeServerResult(result) {
  const confidence = Number(result.confidence ?? 0);
  const deepfakeScore = Math.max(0, Math.min(1, confidence / 100));
  const verdict = String(result.verdict || 'UNKNOWN').toUpperCase();
  const manipulationConfidence = confidence;
  const authenticityConfidence = Math.max(0, 100 - confidence);

  return {
    source: 'Team-Alpha server',
    verdict,
    confidence,
    manipulationConfidence,
    authenticityConfidence,
    deepfakeScore,
    reasoning: result.reasoning || '',
    details: result.details || {},
    frameCount: result.frameCount,
    rawData: result
  };
}

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SCAN_IMAGE') {
    const { imageSrc, imageAlt } = request;

    imageUrlToBase64(imageSrc)
      .then(({ base64, contentType }) => {
        const filename = getFilenameFromUrl(imageSrc);
        return analyzeImage(base64, normalizeFilename(filename, contentType));
      })
      .then(result => {
        lastResult = {
          imageSrc,
          imageAlt,
          result,
          timestamp: new Date().toISOString()
        };
        sendResponse({ success: true, result });
      })
      .catch(error => {
        console.error('Error analyzing image:', error);
        sendResponse({ 
          success: false, 
          error: error.message 
        });
      });

    return true;
  }

  if (request.type === 'GET_LAST_RESULT') {
    sendResponse({ result: lastResult });
  }
});
