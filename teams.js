// teams.js

document.addEventListener('DOMContentLoaded', () => {
    const teamsList = document.getElementById('teamsList');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const selectNoneBtn = document.getElementById('selectNoneBtn');
    const finishBtn = document.getElementById('finishBtn');

    async function displayTeams() {
        try {
            const response = await fetch('/file-mapping');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fileMapping = await response.json();

            if (Object.keys(fileMapping).length === 0) {
                teamsList.innerHTML = '<p>No teams found. Please upload teams first.</p>';
                return;
            }

            teamsList.innerHTML = ''; // Clear existing content
            for (const [uploadedName, originalName] of Object.entries(fileMapping)) {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" name="teams" value="${uploadedName}">
                    ${originalName}
                `;
                teamsList.appendChild(label);
                teamsList.appendChild(document.createElement('br'));
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            teamsList.innerHTML = '<p>Error loading teams. Please try again later.</p>';
        }
    }

    function setAllCheckboxes(checked) {
        document.querySelectorAll('input[name="teams"]').forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    selectAllBtn.addEventListener('click', () => setAllCheckboxes(true));
    selectNoneBtn.addEventListener('click', () => setAllCheckboxes(false));

    finishBtn.addEventListener('click', () => {
        const selectedTeams = Array.from(document.querySelectorAll('input[name="teams"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedTeams.length === 0) {
            alert('Please select at least one team before proceeding.');
            return;
        }

        localStorage.setItem('selectedTeams', JSON.stringify(selectedTeams));
        window.location.href = 'stats.html';
    });

    displayTeams();
});