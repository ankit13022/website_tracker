document.addEventListener('DOMContentLoaded', () => {
    const report = document.getElementById('report');
    const clearButton = document.getElementById('clearButton');

    function displayReport(data) {
        report.innerHTML = '';
        const websites = Object.keys(data).sort((a, b) => data[b] - data[a]);

        websites.forEach(site => {
            const row = document.createElement('tr');
            const siteCell = document.createElement('td');
            const timeCell = document.createElement('td');

            siteCell.textContent = site;
            timeCell.textContent = (data[site] / 1000).toFixed(2);

            row.appendChild(siteCell);
            row.appendChild(timeCell);
            report.appendChild(row);
        });
    }

    // Fetch and display the initial productivity report
    chrome.storage.local.get(null, displayReport);

    // Clear data when the clear button is clicked
    clearButton.addEventListener('click', () => {
        chrome.storage.local.clear(() => {
            report.innerHTML = '';
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = 'No data';
            cell.colSpan = 2;
            row.appendChild(cell);
            report.appendChild(row);
        });
    });
});
