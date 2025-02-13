import { getRemainingDays } from '../utils/timeUtils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const startButton = document.getElementById('start-blocking');
  const durationInput = document.getElementById('duration');
  const fileInput = document.getElementById('blocklist-file');
  const statusIndicator = document.getElementById('status-indicator');
  const remainingTime = document.getElementById('remaining-time');
  const domainsCount = document.getElementById('domains-count');

  // Load initial state
  await updateStatus();

  // Start blocking
  startButton.addEventListener('click', async () => {
    const duration = parseInt(durationInput.value);
    if (duration < 30 || duration > 60) {
      alert('Duration must be between 30 and 60 days');
      return;
    }

    await chrome.runtime.sendMessage({
      type: 'START_BLOCKING',
      duration
    });

    await updateStatus();
  });

  // Import blocklist
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const domains = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    await chrome.runtime.sendMessage({
      type: 'IMPORT_BLOCKLIST',
      domains
    });

    await updateStatus();
  });

  async function updateStatus() {
    const { blockingEnabled, endDate, blocklist } = await chrome.storage.local.get([
      'blockingEnabled',
      'endDate',
      'blocklist'
    ]);

    // Update status indicator
    statusIndicator.className = 'status-indicator ' + 
      (blockingEnabled ? 'status-active' : 'status-inactive');

    // Update remaining time
    const remaining = getRemainingDays(endDate);
    remainingTime.textContent = blockingEnabled
      ? `${remaining} days remaining`
      : 'Blocking not active';

    // Update domains count
    domainsCount.textContent = `${blocklist?.length || 0} domains blocked`;
  }

  // Update status every minute
  setInterval(updateStatus, 60000);
});