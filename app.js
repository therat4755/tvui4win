const { shell } = require('electron');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

let config = {
  bgColor: '#0f0f0f',
  accentColor: '#8ab4f8',
  apps: [
    { name: 'Netflix', icon: '🎬', path: 'https://netflix.com' },
    { name: 'YouTube', icon: '▶️', path: 'https://youtube.com' },
    { name: 'Prime Video', icon: '📺', path: 'https://primevideo.com' },
    { name: 'Spotify', icon: '🎵', path: 'https://spotify.com' },
    { name: 'Steam', icon: '🎮', path: 'steam://' },
    { name: 'Browser', icon: '🌐', path: 'https://google.com' }
  ]
};

function loadConfig() {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  applyTheme();
  renderApps();
  renderContent();
}

function saveConfig() {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function applyTheme() {
  document.documentElement.style.setProperty('--bg-color', config.bgColor);
  document.documentElement.style.setProperty('--accent-color', config.accentColor);
  document.getElementById('bgColor').value = config.bgColor;
  document.getElementById('accentColor').value = config.accentColor;
}

function renderApps() {
  const grid = document.getElementById('appsGrid');
  grid.innerHTML = config.apps.map((app, i) => `
    <div class="app-card" onclick="launchApp(${i})">
      <div class="app-icon">${app.icon}</div>
      <div>${app.name}</div>
    </div>
  `).join('');
}

function renderContent() {
  const continueWatching = document.getElementById('continueWatching');
  const recommended = document.getElementById('recommended');
  
  continueWatching.innerHTML = Array(6).fill(0).map((_, i) => 
    `<div class="content-card">Continue ${i + 1}</div>`
  ).join('');
  
  recommended.innerHTML = Array(6).fill(0).map((_, i) => 
    `<div class="content-card">Recommended ${i + 1}</div>`
  ).join('');
}

function launchApp(index) {
  if (index === 'hero') return;
  const app = config.apps[index];
  if (app) shell.openExternal(app.path);
}

function openSettings() {
  document.getElementById('settingsPanel').classList.add('open');
}

function closeSettings() {
  document.getElementById('settingsPanel').classList.remove('open');
}

function addApp() {
  const name = prompt('App name:');
  const icon = prompt('App icon (emoji):');
  const path = prompt('App path (URL or executable):');
  if (name && icon && path) {
    config.apps.push({ name, icon, path });
    renderApps();
  }
}

function saveSettings() {
  config.bgColor = document.getElementById('bgColor').value;
  config.accentColor = document.getElementById('accentColor').value;
  applyTheme();
  saveConfig();
  alert('Settings saved!');
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.app-card').forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(query) ? 'block' : 'none';
  });
});

loadConfig();
