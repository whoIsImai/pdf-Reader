const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');
const pdfViewer = document.getElementById('pdf-viewer');

const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")


// fileUpload.addEventListener('change', async function(e) {
//     const file = e.target.files[0];
//     if (file && file.type === 'application/pdf') {
//         document.getElementById("search-btn").disabled = false;
//         fileName.textContent = `Selected file: ${file.name}`;
//         // Creates a temporary URL that represents the file object
//         const fileURL = URL.createObjectURL(file);
//         pdfViewer.src = fileURL;

     
//     } else {
//         fileName.textContent = 'Please select a valid PDF file.';
//         pdfViewer.src = '';
//         document.getElementById("search-btn").disabled = true;
//     }
// });

fileUpload.addEventListener('change',function(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') 
    {
        document.getElementById("search-btn").disabled = false;
        fileName.textContent = `Selected file: ${file.name}`;
        
        const reader = new FileReader();
        reader.onload = (event) => 
        {
            const pdfData = event.target.result;
            const pdfDoc = pdfjsLib.getDocument({data: pdfData});

            pdfDoc.promise.then((pdf)=> 
            {
                const numPages = pdf.numPages;
                console.log(numPages);

                for (let i = 1; i <= numPages; i++)
                {
                    pdf.getPage(i).then((page) => 
                    {
                        const scale = 1.5;
                        const viewport = page.getViewport({scale: scale});
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                      page.render({
                        canvasContext: context,
                        viewport: viewport
                      })
                        pdfViewer.appendChild(canvas);
                    });
                }
            })
        }
        reader.readAsArrayBuffer(file);
     
    } else {
        fileName.textContent = 'Please select a valid PDF file.';
        pdfViewer.src = '';
        document.getElementById("search-btn").disabled = true;
    }
})