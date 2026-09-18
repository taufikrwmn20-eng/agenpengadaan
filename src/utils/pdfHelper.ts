import * as pdfjsLib from 'pdfjs-dist';

// Configure worker path from standard reliable CDN matching pdfjsLib version
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    // Set worker source to CDN matching installed pdfjs-dist
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('Could not set pdfjs workerSrc:', e);
  }
}

/**
 * Converts the first page of a PDF File/Blob into a high-resolution PNG Data URL.
 * Automatically scales to high definition (~1920px width for standard landscape A4/Letter).
 */
export async function convertPdfFirstPageToImage(file: File): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  totalPages: number;
}> {
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;
  
  // Render page 1
  const page = await pdf.getPage(1);
  const unscaledViewport = page.getViewport({ scale: 1.0 });

  // Calculate high-resolution scale (target ~1920px width for sharp certificate background)
  const targetWidth = 1920;
  const scale = Math.max(1.5, targetWidth / unscaledViewport.width);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    throw new Error('Gagal menginisialisasi canvas context.');
  }

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  // Fill white background in case PDF has transparent regions
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvas: canvas,
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  const dataUrl = canvas.toDataURL('image/png', 0.95);

  return {
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    totalPages,
  };
}
