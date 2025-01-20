const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');
const pdfViewer = document.getElementById('pdf-viewer');
const mySearchResult = document.getElementById('search-result')
const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const refreshBtn = document.getElementById('refresh-btn');

let pdfDoc = null;
let pdfData = null;
let pageTexts = [];
let pageTextItems = [];
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
        searchBtn.disabled = false;
        fileName.textContent = `Selected file: ${file.name}`;
        
        const reader = new FileReader();
        reader.onload = (event) => 
        {
            const pdfData = event.target.result;
            pdfjsLib.getDocument({data: pdfData}).promise.then((pdf) => {
                pdfDoc = pdf;
                const numPages = pdf.numPages;
                console.log(numPages);
      
                const textPromises = [];
                for (let i = 1; i <= numPages; i++) {
                  textPromises.push(pdf.getPage(i).then((page) => {
                    return page.getTextContent().then((textContent) => {
                      return textContent.items.map((item) => item.str).join(' ');
                    });
                  }));
                }
      
                Promise.all(textPromises).then((texts) => {
                  pageTexts = texts;
                });
      
                // Render PDF pages with dynamic size
                for (let i = 1; i <= numPages; i++) {
                    pdf.getPage(i).then((page) => {
                        const viewport = page.getViewport({ scale: 1 });
                        const containerWidth = pdfViewer.clientWidth;
                        const scale = containerWidth / viewport.width;
                        const scaledViewport = page.getViewport({ scale: scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = scaledViewport.height;
                        canvas.width = scaledViewport.width;

                        page.render({
                            canvasContext: context,
                            viewport: scaledViewport
                        }).promise.then(() => {
                              // Add page number at the bottom
                              context.font = 'bold 14px Arial';
                              context.fillStyle = 'black';
                              context.textAlign = 'center';
                              context.fillText(`Page ${i}`, canvas.width / 2, 20);
                            pdfViewer.appendChild(canvas);
                        });
                    });
                }
              });
        }
        reader.readAsArrayBuffer(file);
     
    } else {
        fileName.textContent = 'Please select a valid PDF file.';
        pdfViewer.src = '';
        searchBtn.disabled = true;
    }
})

searchBtn.addEventListener('click', ()=> {
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== '') {
      const searchResult = [];
      pageTexts.forEach((pageText, pageIndex) => {
        const searchTermIndex = pageText.indexOf(searchTerm);

        if (searchTermIndex !== -1) {
          searchResult.push({pageIndex: pageIndex, searchTermIndex: searchTermIndex});
        }
      });

      if (searchResult.length > 0) {
        mySearchResult.innerHTML = '';
        searchResult.forEach((result) => {
          const pageIndex = result.pageIndex;
          const searchTermIndex = result.searchTermIndex;

          const resultElement = document.createElement('div');
          resultElement.innerHTML = `Page ${pageIndex + 1}: ${pageTexts[pageIndex].substring(searchTermIndex - 50, searchTermIndex + 50)}`;

          mySearchResult.appendChild(resultElement);
        });
      } else {
        mySearchResult.textContent = 'Search term not found';
      }
    } else {
      mySearchResult.textContent = 'Enter a value to search';
    }
  });

  refreshBtn.addEventListener('click', () => {
    fileUpload.value = '';
    searchInput.value = '';
    fileName.textContent = '';
    pdfViewer.innerHTML = '';
    mySearchResult.textContent = '';
    searchBtn.disabled = true;
    pdfDoc = null;
    pdfData = null;
    pageTexts = [];
  });