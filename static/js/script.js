document.getElementById('downloadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const videoUrl = document.getElementById('videoUrl').value;
    const quality = document.getElementById('quality').value;
    const messageDiv = document.getElementById('message');

    // Clear previous messages
    messageDiv.innerHTML = '';

    // Send POST request to the Flask API
    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: videoUrl,
            quality: quality
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Something went wrong!');
            });
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'downloaded_video.mp4';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        messageDiv.innerHTML = '<span style="color: green;">Download started!</span>';
    })
    .catch(error => {
        messageDiv.innerHTML = `<span style="color: red;">${error.message}</span>`;
    });
});
