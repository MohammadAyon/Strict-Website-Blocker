import { validateDomain } from '../utils/domainUtils.js';
import { calculateEndDate, isBlockingExpired } from '../utils/timeUtils.js';

// Initialize blocking rules
chrome.runtime.onInstalled.addListener(async () => {
  const storage = await chrome.storage.local.get(['blockingEnabled', 'endDate', 'blocklist']);
  
  if (!storage.blockingEnabled) {
    await chrome.storage.local.set({
      blockingEnabled: false,
      blocklist: [],
      endDate: null
    });
  }
});

// Update blocking rules
async function updateBlockingRules() {
  const { blocklist, blockingEnabled, endDate } = await chrome.storage.local.get([
    'blocklist',
    'blockingEnabled',
    'endDate'
  ]);

  // Remove existing rules first
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1]
  });

  // If blocking is not enabled or expired, don't add new rules
  if (!blockingEnabled || isBlockingExpired(endDate)) {
    return;
  }

  // Create rules for each domain in the blocklist
  const rules = blocklist.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: `||${domain}`,
      resourceTypes: ['main_frame', 'sub_frame']
    }
  }));

  // Add the new rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules
  });
}

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blocklist || changes.blockingEnabled || changes.endDate) {
    updateBlockingRules();
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'START_BLOCKING':
        const { duration } = message;
        const endDate = calculateEndDate(duration);
        
        await chrome.storage.local.set({
          blockingEnabled: true,
          endDate
        });
        
        await updateBlockingRules();
        sendResponse({ success: true });
        break;

      case 'IMPORT_BLOCKLIST':
        const { domains } = message;
        const validDomains = domains
          .map(domain => validateDomain(domain))
          .filter(Boolean);

        await chrome.storage.local.set({
          blocklist: validDomains
        });

        await updateBlockingRules();
        sendResponse({ success: true });
        break;
    }
  } catch (error) {
    console.error('Error in message handler:', error);
    sendResponse({ success: false, error: error.message });
  }
  return true; // Keep the message channel open for async response
});

// Check blocking status periodically
setInterval(async () => {
  const { blockingEnabled, endDate } = await chrome.storage.local.get(['blockingEnabled', 'endDate']);
  if (blockingEnabled && isBlockingExpired(endDate)) {
    await chrome.storage.local.set({ blockingEnabled: false });
    await updateBlockingRules();
  }
}, 60000); // Check every minute