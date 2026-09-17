class TimeConverter {
  constructor() {
    this.timezones = {
      'local': 'Local Time',
      'UTC': 'UTC',
      'Europe/London': 'London',
      'America/New_York': 'New York',
      'Asia/Tokyo': 'Tokyo'
    };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUTCOffsets();
  }

  bindEvents() {
    document.getElementById('source-time').addEventListener('input', () => this.convertTime());
    document.getElementById('source-timezone').addEventListener('change', () => {
      this.updateUTCOffsets();
      this.convertTime();
    });
    document.getElementById('target-timezone').addEventListener('change', () => {
      this.updateUTCOffsets();
      this.convertTime();
    });
  }

  updateUTCOffsets() {
    const sourceTz = document.getElementById('source-timezone').value;
    const targetTz = document.getElementById('target-timezone').value;
    
    const now = new Date();
    const sourceOffset = this.getTimezoneOffset(now, sourceTz);
    const targetOffset = this.getTimezoneOffset(now, targetTz);
    
    document.getElementById('source-offset').textContent = sourceOffset;
    document.getElementById('target-offset').textContent = targetOffset;
  }

  getTimezoneOffset(date, timezone) {
    if (timezone === 'local' || timezone === 'UTC') {
      const offset = -date.getTimezoneOffset() / 60;
      return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    }
    
    // For other timezones, we'd need more complex logic
    // This is a simplified version
    try {
      const localized = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      const offset = -localized.getTimezoneOffset() / 60;
      return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    } catch {
      return 'UTC±0';
    }
  }

  convertTime() {
    const sourceTime = document.getElementById('source-time').value;
    if (!sourceTime) {
      document.getElementById('converted-time').textContent = '--:--:--';
      return;
    }
    
    const sourceTz = document.getElementById('source-timezone').value;
    const targetTz = document.getElementById('target-timezone').value;
    
    // Parse the input time (HH:mm)
    const [hours, minutes] = sourceTime.split(':').map(Number);
    
    // Create a date object with today's date and the input time
    const now = new Date();
    let sourceDate = new Date(now);
    sourceDate.setHours(hours, minutes, 0, 0);
    
    // Convert to target timezone
    let targetDate;
    
    if (sourceTz === 'local' && targetTz === 'local') {
      targetDate = new Date(sourceDate);
    } else if (sourceTz === 'UTC' && targetTz === 'UTC') {
      targetDate = new Date(sourceDate);
    } else {
      // Simplified conversion - in a real app you'd use a proper timezone library
      targetDate = this.simpleTimeConversion(sourceDate, sourceTz, targetTz);
    }
    
    const timeFormat = settingsManager.getSetting('timeFormat');
    const formattedTime = this.formatTime(targetDate, timeFormat);
    document.getElementById('converted-time').textContent = formattedTime;
  }

  simpleTimeConversion(date, sourceTz, targetTz) {
    // This is a simplified conversion using browser's locale capabilities
    // For production, consider using a library like date-fns-tz
    
    try {
      if (sourceTz === 'local' && targetTz !== 'local') {
        // Local to other timezone
        const sourceString = date.toLocaleString('en-US', { timeZone: targetTz });
        return new Date(sourceString);
      } else if (sourceTz !== 'local' && targetTz === 'local') {
        // Other timezone to local
        const sourceString = date.toLocaleString('en-US', { timeZone: sourceTz });
        return new Date(sourceString);
      } else {
        // Both non-local - convert via UTC
        return new Date(date);
      }
    } catch {
      return new Date(date);
    }
  }

  formatTime(date, format = '24h') {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    
    if (format === '12h') {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes}:${seconds} ${ampm}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
  }
}

// Initialize converter when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.timeConverter = new TimeConverter();
});
