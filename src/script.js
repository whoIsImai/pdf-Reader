const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');
const pdfViewer = document.getElementById('pdf-viewer');

fileUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        fileName.textContent = `Selected file: ${file.name}`;
        // Creates a temporary URL that represents the file object
        const fileURL = URL.createObjectURL(file);
        pdfViewer.src = fileURL;
    } else {
        fileName.textContent = 'Please select a valid PDF file.';
        pdfViewer.src = '';
    }
});