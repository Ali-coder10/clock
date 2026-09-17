// Main application initialization
class ClockApp {
  constructor() {
    this.init();
  }

  init() {
    // All initialization is handled by individual managers
    // This class serves as the main application coordinator
    
    // Add any app-wide event listeners or initialization logic here
    this.addGlobalEventListeners();
  }

  addGlobalEventListeners() {
    // Close settings panel when clicking outside
    document.addEventListener('click', (e) => {
      const settingsPanel = document.getElementById('settings-panel');
      const settingsToggle = document.getElementById('settings-toggle');
      
      if (settingsPanel.classList.contains('open') && 
          !settingsPanel.contains(e.target) && 
          !settingsToggle.contains(e.target)) {
        settingsPanel.classList.remove('open');
      }
    });
    
    // Escape key to close settings
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('settings-panel').classList.remove('open');
      }
    });
  }
}

// Initialize the main application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.clockApp = new ClockApp();
});
