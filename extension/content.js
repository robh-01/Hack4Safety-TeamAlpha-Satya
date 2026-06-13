const api = globalThis.browser ?? globalThis.chrome;

const SCAN_ICON_CLASS = 'deepfake-detector-scan-icon';
const CONTAINER_CLASS = 'deepfake-detector-container';
const BADGE_CLASS = 'deepfake-detector-result-badge';
const processedImages = new Set();

const SCAN_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
  <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M12 6v-2M12 20v2M18 12h2M4 12H2M17 7l1.4-1.4M5.6 19.4l1.4-1.4M17 17l1.4 1.4M5.6 5.6l1.4 1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

function createScanButton(imageElement) {
  const container = document.createElement('div');
  container.className = CONTAINER_CLASS;
  container.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10000;
  `;

  const button = document.createElement('button');
  button.className = SCAN_ICON_CLASS;
  button.setAttribute('data-image-src', imageElement.src || imageElement.currentSrc);
  button.style.cssText = `
    background: linear-gradient(135deg, #6d79f6 0%, #8b5cf6 100%);
    border: none;
    border-radius: 50%;
    width: 34px;
    height: 34px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 6px 18px rgba(17, 24, 39, 0.28);
    transition: all 0.2s ease;
    padding: 0;
    opacity: 0.92;
  `;
  
  button.innerHTML = SCAN_ICON_SVG;
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 8px 22px rgba(17, 24, 39, 0.34)';
    button.style.opacity = '1';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 6px 18px rgba(17, 24, 39, 0.28)';
    button.style.opacity = '0.92';
  });

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    scanImage(imageElement);
  });

  container.appendChild(button);
  return container;
}

function createResultBadge(imageElement) {
  let badge = imageElement.parentElement?.querySelector(`.${BADGE_CLASS}`);
  if (badge) {
    return badge;
  }

  badge = document.createElement('div');
  badge.className = BADGE_CLASS;
  badge.style.cssText = `
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 10000;
    padding: 4px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    background: rgba(17, 24, 39, 0.82);
    backdrop-filter: blur(6px);
    pointer-events: none;
    display: none;
    letter-spacing: 0.02em;
  `;
  return badge;
}

function setBadgeState(badge, result) {
  const verdict = (result.verdict || 'UNKNOWN').toUpperCase();
  const manipulationConfidence = Math.round(result.manipulationConfidence ?? Number(result.confidence ?? Math.round((result.deepfakeScore || 0) * 100)));
  const authenticityConfidence = Math.round(result.authenticityConfidence ?? Math.max(0, 100 - manipulationConfidence));

  if (verdict === 'REAL') {
    badge.textContent = `REAL · ${authenticityConfidence}% authentic`;
  } else if (verdict === 'FAKE') {
    badge.textContent = `FAKE · ${manipulationConfidence}% manipulated`;
  } else {
    badge.textContent = `UNKNOWN · ${authenticityConfidence}% confident`;
  }
  badge.style.display = 'block';

  if (verdict === 'FAKE') {
    badge.style.background = 'rgba(220, 53, 69, 0.92)';
  } else if (verdict === 'REAL') {
    badge.style.background = 'rgba(40, 167, 69, 0.92)';
  } else {
    badge.style.background = 'rgba(255, 193, 7, 0.92)';
    badge.style.color = '#1f2937';
  }
}

function processImage(img) {
  if (processedImages.has(img) || !img.src) {
    return;
  }

  processedImages.add(img);

  const parent = img.parentElement;
  if (parent && window.getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }

  const scanContainer = createScanButton(img);
  const badge = createResultBadge(img);
  parent.appendChild(scanContainer);
  parent.appendChild(badge);

  parent.addEventListener('mouseenter', () => {
    scanContainer.style.opacity = '1';
  });
  parent.addEventListener('mouseleave', () => {
    scanContainer.style.opacity = '0.7';
  });
  
  scanContainer.style.opacity = '0.7';
  scanContainer.style.transition = 'opacity 0.2s ease';
}

function scanImage(imageElement) {
  const src = imageElement.src || imageElement.currentSrc;
  if (!src) return;

  const button = document.querySelector(`[data-image-src="${src}"]`);
  if (button) {
    button.disabled = true;
    button.style.opacity = '0.6';
  }

  api.runtime.sendMessage({
    type: 'SCAN_IMAGE',
    imageSrc: src,
    imageAlt: imageElement.alt || 'Scanned image'
  }, (response) => {
    if (button) {
      button.disabled = false;
      button.style.opacity = '1';
    }

    if (response && response.success) {
      highlightImage(imageElement, response.result);
      const badge = imageElement.parentElement?.querySelector(`.${BADGE_CLASS}`);
      if (badge) setBadgeState(badge, response.result);
    } else if (response && response.error) {
      alert(`Error scanning image: ${response.error}`);
    }
  });
}

function highlightImage(imageElement, result) {
  const parent = imageElement.parentElement;
  if (!parent) return;

  let borderColor = '#28a745';
  let borderWidth = '3px';

  if ((result.verdict || '').toUpperCase() === 'FAKE' || (result.deepfakeScore || 0) >= 0.7) {
    borderColor = '#dc3545';
  } else if (result.deepfakeScore >= 0.4) {
    borderColor = '#ffc107';
  }

  imageElement.style.border = `${borderWidth} solid ${borderColor}`;
  imageElement.style.boxShadow = `0 0 8px ${borderColor}`;
}

function detectImages() {
  const images = document.querySelectorAll('img');
  images.forEach(processImage);
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'IMG') {
          processImage(node);
        } else {
          node.querySelectorAll?.('img').forEach(processImage);
        }
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectImages);
} else {
  detectImages();
}

setTimeout(detectImages, 1000);
setTimeout(detectImages, 3000);
