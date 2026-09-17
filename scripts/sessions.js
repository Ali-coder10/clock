class TradingSessions {
  constructor() {
    this.sessions = [
      {
        id: 'london',
        name: 'London Session',
        open: { hour: 8, minute: 0 }, // 8:00 AM GMT
        close: { hour: 16, minute: 0 }, // 4:00 PM GMT
        timezone: 'Europe/London'
      },
      {
        id: 'new-york',
        name: 'New York Session',
        open: { hour: 8, minute: 0 }, // 8:00 AM EST
        close: { hour: 17, minute: 0 }, // 5:00 PM EST
        timezone: 'America/New_York'
      },
      {
        id: 'tokyo',
        name: 'Tokyo Session',
        open: { hour: 9, minute: 0 }, // 9:00 AM JST
        close: { hour: 18, minute: 0 }, // 6:00 PM JST
        timezone: 'Asia/Tokyo'
      }
    ];
    
    this.init();
  }

  init() {
    this.createSessionCards();
    this.updateAllSessions();
    setInterval(() => this.updateAllSessions(), 1000);
  }

  createSessionCards() {
    const grid = document.getElementById('sessions-grid');
    grid.innerHTML = this.sessions.map(session => `
      <div class="session-card" id="${session.id}-session">
        <div class="session-card-header">
          <div class="session-card-title">${session.name}</div>
          <div class="session-status">Closed</div>
        </div>
        <div class="session-hours">
          ${this.formatHour(session.open.hour)}:${session.open.minute.toString().padStart(2, '0')} - 
          ${this.formatHour(session.close.hour)}:${session.close.minute.toString().padStart(2, '0')} Local Time
        </div>
        <div class="session-countdown" id="${session.id}-countdown">--:--:--</div>
      </div>
    `).join('');
  }

  updateAllSessions() {
    const now = new Date();
    
    this.sessions.forEach(session => {
      this.updateSession(session, now);
    });
  }

  updateSession(session, now) {
    const sessionTime = new Date(now.toLocaleString('en-US', { timeZone: session.timezone }));
    const sessionDate = new Date(sessionTime);
    
    // Set open and close times for today
    const openTime = new Date(sessionDate);
    openTime.setHours(session.open.hour, session.open.minute, 0, 0);
    
    const closeTime = new Date(sessionDate);
    closeTime.setHours(session.close.hour, session.close.minute, 0, 0);
    
    // Check if session is open
    const isOpen = sessionTime >= openTime && sessionTime < closeTime;
    
    const card = document.getElementById(`${session.id}-session`);
    const status = card.querySelector('.session-status');
    const countdown = document.getElementById(`${session.id}-countdown`);
    
    card.classList.toggle('open', isOpen);
    status.textContent = isOpen ? 'Open' : 'Closed';
    
    // Calculate countdown
    let targetTime;
    let message;
    
    if (isOpen) {
      targetTime = closeTime;
      message = 'Closes in: ';
    } else if (sessionTime < openTime) {
      targetTime = openTime;
      message = 'Opens in: ';
    } else {
      // Session closed for today, show next day's open
      const nextOpen = new Date(sessionDate);
      nextOpen.setDate(nextOpen.getDate() + 1);
      nextOpen.setHours(session.open.hour, session.open.minute, 0, 0);
      targetTime = nextOpen;
      message = 'Opens in: ';
    }
    
    const diff = targetTime - sessionTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdown.textContent = `${message}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatHour(hour) {
    const timeFormat = settingsManager.getSetting('timeFormat');
    
    if (timeFormat === '12h') {
      const displayHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      return `${displayHour}${ampm}`;
    }
    
    return hour.toString().padStart(2, '0');
  }
}

// Initialize trading sessions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.tradingSessions = new TradingSessions();
});
