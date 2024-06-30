let activeTabId = null;
let activeTabUrl = null;
let startTime = null;

chrome.tabs.onActivated.addListener(activeInfo => {
    updateActiveTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tabId === activeTabId) {
        updateActiveTab(tabId);
    }
});

chrome.tabs.onRemoved.addListener(tabId => {
    if (tabId === activeTabId) {
        saveTimeSpent();
        activeTabId = null;
        activeTabUrl = null;
        startTime = null;
    }
});

function updateActiveTab(tabId) {
    if (activeTabId !== null) {
        saveTimeSpent();
    }

    activeTabId = tabId;
    chrome.tabs.get(tabId, tab => {
        activeTabUrl = new URL(tab.url).hostname;
        startTime = new Date().getTime();
    });
}

function saveTimeSpent() {
    if (activeTabUrl && startTime) {
        const endTime = new Date().getTime();
        const timeSpent = endTime - startTime;

        chrome.storage.local.get([activeTabUrl], result => {
            const totalTime = result[activeTabUrl] ? result[activeTabUrl] + timeSpent : timeSpent;
            chrome.storage.local.set({ [activeTabUrl]: totalTime });
        });
    }
}
