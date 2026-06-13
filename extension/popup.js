const api = globalThis.browser ?? globalThis.chrome;

const noResultSection = document.getElementById('no-result');
const loadingSection = document.getElementById('loading');
const resultSection = document.getElementById('result');
const newScanBtn = document.getElementById('new-scan-btn');

// On popup open, check if there's a recent result
document.addEventListener('DOMContentLoaded', () => {
  api.runtime.sendMessage({ type: 'GET_LAST_RESULT' }, (response) => {
    if (response && response.result) {
      displayResult(response.result);
    } else {
      showNoResult();
    }
  });

  newScanBtn.addEventListener('click', () => {
    showNoResult();
  });
});

function showNoResult() {
  noResultSection.classList.remove('hidden');
  loadingSection.classList.add('hidden');
  resultSection.classList.add('hidden');
}

function showLoading() {
  noResultSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');
  resultSection.classList.add('hidden');
}

function displayResult(data) {
  noResultSection.classList.add('hidden');
  loadingSection.classList.add('hidden');
  resultSection.classList.remove('hidden');

  // Set preview image
  const previewImg = document.getElementById('preview-img');
  previewImg.src = data.imageSrc;
  previewImg.onerror = () => {
    previewImg.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EImage unavailable%3C/text%3E%3C/svg%3E';
  };

  const verdict = String(data.result.verdict || 'UNKNOWN').toUpperCase();
  const manipulationConfidence = Number(data.result.manipulationConfidence ?? Number(data.result.confidence ?? Math.round((data.result.deepfakeScore || 0) * 100)));
  const authenticityConfidence = Number(data.result.authenticityConfidence ?? Math.max(0, 100 - manipulationConfidence));

  // Set source
  document.getElementById('source').textContent = data.result.source || 'Unknown';

  // Set manipulation score
  const scorePercentage = manipulationConfidence;
  document.getElementById('score-percentage').textContent = `${scorePercentage}%`;
  document.getElementById('score-fill').style.width = `${scorePercentage}%`;

  document.getElementById('auth-confidence').textContent = `${authenticityConfidence}%`;
  document.getElementById('manip-confidence').textContent = `${manipulationConfidence}%`;

  // Set assessment
  const assessmentEl = document.getElementById('assessment');
  let assessment = '';
  let cssClass = '';

  if (verdict === 'REAL' || scorePercentage < 40) {
    assessment = 'No signs of manipulation detected';
    cssClass = 'safe';
  } else if (verdict === 'FAKE' || scorePercentage >= 70) {
    assessment = 'Likely AI-Generated or Deepfake';
    cssClass = 'deepfake';
  } else {
    assessment = 'Uncertain - May be AI-Generated';
    cssClass = 'uncertain';
  }

  assessmentEl.textContent = assessment;
  assessmentEl.className = `assessment ${cssClass}`;

  // Set timestamp
  const date = new Date(data.timestamp);
  document.getElementById('timestamp').textContent = `Scanned: ${date.toLocaleString()}`;

  // Set raw data
  const rawDataEl = document.getElementById('raw-data');
  try {
    rawDataEl.textContent = JSON.stringify(data.result.rawData || data.result, null, 2);
  } catch (e) {
    rawDataEl.textContent = 'Could not format raw data';
  }
}
