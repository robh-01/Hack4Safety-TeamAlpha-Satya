// Configuration Template for DeepFake Detector Extension
// Save as: extension/config.example.js
// Copy to: extension/config.js (if you want to version control safely)

export const CONFIG = {
  // Server Configuration
  SERVER: {
    // Main API endpoint
    URL: 'http://localhost:3000',
    
    // Timeout for API requests (in milliseconds)
    TIMEOUT: 30000,
    
    // API endpoint path
    DETECT_ENDPOINT: '/api/detect'
  },

  // Extension Behavior
  EXTENSION: {
    // Auto-detect images on page load
    AUTO_DETECT_ON_LOAD: true,
    
    // Scan dynamically added images
    DETECT_DYNAMIC_IMAGES: true,
    
    // Delay before initial scan (ms)
    INITIAL_SCAN_DELAY: 0,
    
    // Additional scans at these intervals (ms)
    ADDITIONAL_SCAN_DELAYS: [1000, 3000],
    
    // Show scan button on hover
    SHOW_ON_HOVER: true,
    
    // Initial button opacity (0-1)
    INITIAL_BUTTON_OPACITY: 0.7
  },

  // Score Thresholds (0-1 or 0-100%)
  THRESHOLDS: {
    // Score below this is "Likely Authentic" (green)
    AUTHENTIC_MAX: 0.4,
    
    // Score between these is "Uncertain" (yellow)
    UNCERTAIN_MIN: 0.4,
    UNCERTAIN_MAX: 0.7,
    
    // Score above this is "Likely Deepfake" (red)
    DEEPFAKE_MIN: 0.7
  },

  // UI Configuration
  UI: {
    // Scan button styling
    BUTTON: {
      SIZE: '40px',
      BORDER_RADIUS: '50%',
      HOVER_SCALE: 1.1,
      DISABLED_OPACITY: 0.6
    },
    
    // Color scheme (for future theme support)
    COLORS: {
      PRIMARY: '#667eea',
      PRIMARY_DARK: '#764ba2',
      SAFE: '#28a745',
      UNSAFE: '#ffc107',
      DANGER: '#dc3545'
    },
    
    // Result colors for image highlighting
    HIGHLIGHT_COLORS: {
      SAFE: '#28a745',      // Green
      UNCERTAIN: '#ffc107',  // Yellow
      DANGEROUS: '#dc3545'   // Red
    },
    
    HIGHLIGHT_BORDER_WIDTH: '3px'
  },

  // Feature Flags
  FEATURES: {
    // Show scan button
    SHOW_SCAN_BUTTON: true,
    
    // Highlight images with border
    HIGHLIGHT_RESULTS: true,
    
    // Show popup results
    SHOW_POPUP: true,
    
    // Enable detailed results
    SHOW_DETAILED_RESULTS: true,
    
    // Log to console (development)
    DEBUG_LOGGING: false
  },

  // Supported Image Types
  SUPPORTED_FORMATS: [
    'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'
  ],

  // Image Processing
  IMAGE: {
    // Max file size before warning (in MB)
    MAX_SIZE_MB: 50,
    
    // Compression quality for base64 (0-1)
    COMPRESSION_QUALITY: 0.9,
    
    // Timeout for image fetch (ms)
    FETCH_TIMEOUT: 10000
  },

  // API Response Handling
  API: {
    // Expected response format: 'ndjson' or 'json'
    RESPONSE_FORMAT: 'ndjson',
    
    // Which service is being used
    SERVICE: 'auto', // 'auto', 'sightengine', 'hiveai'
    
    // Retry failed requests
    RETRY_ON_FAILURE: true,
    RETRY_COUNT: 3,
    RETRY_DELAY_MS: 1000
  },

  // Development/Debug
  DEV: {
    // Log all messages
    VERBOSE_LOGGING: false,
    
    // Show timing information
    SHOW_TIMING: false,
    
    // Mock server responses (for testing)
    MOCK_SERVER: false,
    
    // Mock response delay (ms)
    MOCK_RESPONSE_DELAY: 1500
  }
};

/**
 * Usage in background.js or content.js:
 * 
 * import { CONFIG } from './config.js';
 * 
 * const serverUrl = CONFIG.SERVER.URL;
 * const threshold = CONFIG.THRESHOLDS.DEEPFAKE_MIN;
 * const scanDelay = CONFIG.EXTENSION.ADDITIONAL_SCAN_DELAYS[0];
 */

/**
 * Environment-specific configurations:
 * 
 * // Development
 * CONFIG.SERVER.URL = 'http://localhost:3000';
 * CONFIG.DEV.VERBOSE_LOGGING = true;
 * 
 * // Production
 * CONFIG.SERVER.URL = 'https://api.yourdomain.com';
 * CONFIG.DEV.VERBOSE_LOGGING = false;
 */
