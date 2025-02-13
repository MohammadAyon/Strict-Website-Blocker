import { getRemainingDays } from '../utils/timeUtils.js';

async function updateRemainingTime() {
  const { endDate } = await chrome.storage.local.get('endDate');
  const remaining = getRemainingDays(endDate);
  
  document.getElementById('remaining-time').textContent = 
    `Blocking will be active for ${remaining} more days`;
}

updateRemainingTime();
setInterval(updateRemainingTime, 60000);