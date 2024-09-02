document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadBtn = document.getElementById('uploadBtn');
    const continueBtn = document.getElementById('continueBtn');
    const uploadStatus = document.getElementById('uploadStatus');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            fileNameDisplay.value = file.name;
        } else {
            fileNameDisplay.value = 'No File Chosen';
        }
        uploadStatus.textContent = ''; // Clear any previous status message
    });

    uploadBtn.addEventListener('click', async () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file); // Changed from 'csvFile' to 'file'

            try {
                const response = await axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploadStatus.textContent = 'File Upload Success. Click again to upload another.';
                uploadStatus.className = 'success';
                fileInput.value = ''; // Clear the file input
                fileNameDisplay.value = 'No File Chosen';
            } catch (error) {
                console.error('Error uploading file:', error);
                uploadStatus.textContent = 'File Upload unsuccessful. Please try again.';
                uploadStatus.className = 'error';
            }
        } else {
            alert('Please choose a file first');
        }
    });

    continueBtn.addEventListener('click', () => {
        window.location.href = 'teams.html'; // Navigate to the teams selection page
    });
});
