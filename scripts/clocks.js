class ClockManager {
  constructor() {
    this.clocks = [
      { id: 'utc', label: 'UTC', timezone: 'UTC' },
      { id: 'local', label: 'Local', timezone: 'local' },
      { id: 'london', label: 'London', timezone: 'Europe/London' },
      { id: 'new-york', label: 'New York', timezone: 'America/New_York' },
      { id: 'tokyo', label: 'Tokyo', timezone: 'Asia/Tokyo' }
    ];
    
    this.mainClockElements = {
      digital: {
        time: document.getElementById('digital-time'),
        date: document.getElementById('digital-date'),
        tz: document.getElementById('digital-tz')
      },
      analog: {
        hour: document.getElementById('hour-hand'),
        minute: document.getElementById('minute-hand'),
        second: document.getElementById('second-hand')
      },
      vintage: {
        hour: document.getElementById('vintage-hour'),
        minute: document.getElementById('vintage-minute'),
        second: document.getElementById('vintage-second')
      },
      glass: {
        time: document.getElementById('glass-time'),
        date: document.getElementById('glass-date')
      },
      trading: {
        time: document.getElementById('trading-time'),
        date: document.getElementById('trading-date')
      }
    };
    
    this.init();
  }

  init() {
    this.createClockCards();
    this.updateAllClocks();
    setInterval(() => this.updateAllClocks(), 1000);
  }

  createClockCards() {
    const grid = document.getElementById('clocks-grid');
    grid.innerHTML = this.clocks.map(clock => `
      <div class="clock-card" data-timezone="${clock.timezone}">
        <div class="clock-card-header">
          <div class="clock-card-title">${clock.label}</div>
          <div class="clock-card-offset" id="${clock.id}-offset">UTC±0</div>
        </div>
        <div class="clock-card-time" id="${clock.id}-time">00:00:00</div>
        <div class="clock-card-date" id="${clock.id}-date">Loading...</div>
      </div>
    `).join('');
  }

  updateAllClocks() {
    const now = new Date();
    
    // Update main clock based on current theme
    this.updateMainClock(now);
    
    // Update world clocks
    this.clocks.forEach(clock => {
      this.updateClockCard(clock.id, clock.timezone, now);
    });
  }

  updateMainClock(now) {
    const timeFormat = settingsManager.getSetting('timeFormat');
    const theme = settingsManager.getSetting('theme');
    
    // Hide all clock types, show active one
    document.querySelectorAll('.clock-main > div').forEach(el => {
      el.classList.remove('active');
    });
    document.querySelector(`.clock-${theme}`).classList.add('active');
    
    // Digital clock
    this.mainClockElements.digital.time.textContent = this.formatTime(now, timeFormat);
    this.mainClockElements.digital.date.textContent = this.formatDate(now);
    this.mainClockElements.digital.tz.textContent = 'UTC';
    
    // Analog clock
    this.updateAnalogClock(now, this.mainClockElements.analog);
    
    // Vintage clock
    this.updateAnalogClock(now, this.mainClockElements.vintage);
    
    // Glass clock
    this.mainClockElements.glass.time.textContent = this.formatTime(now, timeFormat);
    this.mainClockElements.glass.date.textContent = this.formatDate(now, true);
    
    // Trading clock
    this.mainClockElements.trading.time.textContent = this.formatTime(now, timeFormat);
    this.mainClockElements.trading.date.textContent = 'UTC';
  }

  updateAnalogClock(now, elements) {
    const hours = now.getUTCHours() % 12;
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    
    elements.hour.style.transform = `translateX(-50%) rotate(${(hours * 30) + (minutes * 0.5)}deg)`;
    elements.minute.style.transform = `translateX(-50%) rotate(${minutes * 6}deg)`;
    elements.second.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
  }

  updateClockCard(clockId, timezone, now) {
    let cardTime;
    
    if (timezone === 'local') {
      cardTime = new Date(now);
    } else if (timezone === 'UTC') {
      cardTime = new Date(now);
    } else {
      cardTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    }
    
    const timeFormat = settingsManager.getSetting('timeFormat');
    const offset = this.getUTCOffset(cardTime);
    
    document.getElementById(`${clockId}-time`).textContent = this.formatTime(cardTime, timeFormat);
    document.getElementById(`${clockId}-date`).textContent = this.formatDate(cardTime);
    document.getElementById(`${clockId}-offset`).textContent = offset;
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

  formatDate(date, short = false) {
    const options = short 
      ? { weekday: 'short', month: 'short', day: 'numeric' }
      : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    return date.toLocaleDateString('en-US', options);
  }

  getUTCOffset(date) {
    const offset = -date.getTimezoneOffset() / 60;
    return `UTC${offset >= 0 ? '+' : ''}${offset}`;
  }
}

// Initialize clock manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.clockManager = new ClockManager();
});
