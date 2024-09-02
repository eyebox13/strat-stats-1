// stats.js

document.addEventListener('DOMContentLoaded', () => {
    const statsTypeDropdown = document.getElementById('statsType');
    const qualifiersCheckbox = document.getElementById('qualifiersOnly');
    const fetchStatsBtn = document.getElementById('fetchStatsBtn');
    const statsTableContainer = document.getElementById('statsTableContainer');

    fetchStatsBtn.addEventListener('click', () => {
        const statsType = statsTypeDropdown.value;
        const qualifiersOnly = qualifiersCheckbox.checked;
        const selectedTeams = JSON.parse(localStorage.getItem('selectedTeams') || '[]');
        fetchAndDisplayStats(statsType, selectedTeams, qualifiersOnly);
    });

    async function fetchAndDisplayStats(statsType, selectedTeams, qualifiersOnly) {
        try {
            console.log(`Fetching stats for type: ${statsType} and teams: ${selectedTeams.join(', ')}`);
            const response = await fetch(`/getStats?type=${statsType}&teams=${JSON.stringify(selectedTeams)}`);
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const stats = await response.json();
            console.log('Fetched stats:', stats);
            const filteredStats = applyQualifiers(stats, statsType, qualifiersOnly);
            displayStats(filteredStats);
        } catch (error) {
            console.error('Error fetching or displaying stats:', error);
            statsTableContainer.innerHTML = `<p>Error loading stats: ${error.message}</p>`;
        }
    }

    function applyQualifiers(stats, statsType, qualifiersOnly) {
        if (!qualifiersOnly) {
            return stats;
        }

        if (statsType === 'batting') {
            return stats.filter(player => parseInt(player.AB, 10) >= 8);
        } else if (statsType === 'pitching') {
            return stats.filter(pitcher => parseFloat(pitcher.IP) >= 2);
        }
        return stats;
    }

    function displayStats(stats) {
        if (stats.length === 0) {
            statsTableContainer.innerHTML = '<p>No stats found.</p>';
            return;
        }

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create header row
        const headerRow = document.createElement('tr');
        Object.keys(stats[0]).forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.dataset.sortDirection = 'asc';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create data rows
        stats.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        statsTableContainer.innerHTML = '';
        statsTableContainer.appendChild(table);

        applySorting(table);
    }

    function applySorting(table) {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                sortTable(table, index);
            });
        });
    }

    function sortTable(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAscending = table.querySelector('th').dataset.sortDirection === 'asc';
        table.querySelector('th').dataset.sortDirection = isAscending ? 'desc' : 'asc';

        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent;
            const bValue = b.cells[columnIndex].textContent;
            return isAscending ? 
                aValue.localeCompare(bValue, undefined, {numeric: true, sensitivity: 'base'}) :
                bValue.localeCompare(aValue, undefined, {numeric: true, sensitivity: 'base'});
        });

        rows.forEach(row => tbody.appendChild(row));
    }
});
