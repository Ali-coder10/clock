class SettingsManager {
  constructor() {
    this.defaultSettings = {
      timeFormat: '24h',
      theme: 'digital',
      background: 'pure-black',
      animations: true
    };
    this.init();
  }

  init() {
    this.loadSettings();
    this.bindEvents();
    this.applySettings();
  }

  loadSettings() {
    const saved = localStorage.getItem('clockAppSettings');
    this.settings = saved ? { ...this.defaultSettings, ...JSON.parse(saved) } : { ...this.defaultSettings };
  }

  saveSettings() {
    localStorage.setItem('clockAppSettings', JSON.stringify(this.settings));
    this.applySettings();
  }

  applySettings() {
    // Theme
    document.body.setAttribute('data-theme', this.settings.theme);
    
    // Background
    document.body.setAttribute('data-background', this.settings.background);
    
    // Time format
    document.querySelectorAll('input[name="time-format"]').forEach(radio => {
      radio.checked = radio.value === this.settings.timeFormat;
    });
    
    // Animations
    document.getElementById('animations-toggle').checked = this.settings.animations;
    document.body.style.transition = this.settings.animations ? 'all 0.3s ease' : 'none';
    
    // Active theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === this.settings.theme);
    });
    
    // Active background buttons
    document.querySelectorAll('.bg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bg === this.settings.background);
    });
  }

  bindEvents() {
    // Settings panel toggle
    document.getElementById('settings-toggle').addEventListener('click', () => {
      document.getElementById('settings-panel').classList.add('open');
    });
    
    document.getElementById('settings-close').addEventListener('click', () => {
      document.getElementById('settings-panel').classList.remove('open');
    });
    
    // Time format
    document.querySelectorAll('input[name="time-format"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.settings.timeFormat = e.target.value;
        this.saveSettings();
      });
    });
    
    // Theme selection
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.settings.theme = e.target.dataset.theme;
        this.saveSettings();
      });
    });
    
    // Background selection
    document.querySelectorAll('.bg-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.settings.background = e.target.dataset.bg;
        this.saveSettings();
      });
    });
    
    // Animations toggle
    document.getElementById('animations-toggle').addEventListener('change', (e) => {
      this.settings.animations = e.target.checked;
      this.saveSettings();
    });
  }

  getSetting(key) {
    return this.settings[key];
  }
}

// Initialize settings manager
const settingsManager = new SettingsManager();
