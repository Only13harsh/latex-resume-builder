import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latex } = body;

    if (!latex) {
      return NextResponse.json(
        { error: 'LaTeX code is required' },
        { status: 400 }
      );
    }
    
    const latexCode = latex;

    // Use LaTeX.js for browser-based compilation
    // Note: For production, you might want to use a dedicated LaTeX service like:
    // - https://latexonline.cc/
    // - https://www.overleaf.com/devs
    // - Or a containerized LaTeX installation
    
    // For this implementation, we'll use a proxy approach
    // You can integrate with LaTeX Online API or similar service
    
    try {
      console.log('[v0] Starting PDF compilation...');
      console.log('[v0] LaTeX code length:', latexCode.length);
      
      // Using texlive.net CGI service which is more reliable
      const texliveUrl = 'https://texlive.net/cgi-bin/latexcgi';
      
      // Create form data with the LaTeX file
      const formData = new FormData();
      const latexBlob = new Blob([latexCode], { type: 'text/plain' });
      formData.append('filecontents[]', latexBlob, 'resume.tex');
      formData.append('filename[]', 'resume.tex');
      formData.append('engine', 'pdflatex');
      formData.append('return', 'pdf');
      
      console.log('[v0] Sending request to TeXLive.net...');
      
      const response = await fetch(texliveUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('[v0] TeXLive response status:', response.status);
      console.log('[v0] Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[v0] LaTeX compilation failed:', errorText);
        throw new Error(`Compilation failed with status ${response.status}: ${errorText.substring(0, 200)}`);
      }

      const pdfBuffer = await response.arrayBuffer();
      console.log('[v0] PDF compiled successfully, size:', pdfBuffer.byteLength);
      
      // Verify it's actually a PDF
      const uint8Array = new Uint8Array(pdfBuffer);
      const isPDF = uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && uint8Array[2] === 0x44 && uint8Array[3] === 0x46; // %PDF
      
      if (!isPDF) {
        console.error('[v0] Response is not a valid PDF');
        throw new Error('Invalid PDF response from compilation service');
      }
      
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename=resume.pdf',
          'Cache-Control': 'no-cache',
          'Content-Length': pdfBuffer.byteLength.toString(),
        },
      });
    } catch (compileError) {
      console.error('[v0] LaTeX compilation error:', compileError);
      
      return NextResponse.json(
        {
          error: 'LaTeX compilation failed. The LaTeX code may contain errors. Please download the .tex file and compile it locally, or check for special characters that need escaping.',
          details: compileError instanceof Error ? compileError.message : 'Unknown error',
          suggestion: 'You can download the .tex file and compile it using Overleaf (overleaf.com) or a local LaTeX installation. The LaTeX code has been generated and is available for download.',
          latexLength: latexCode.length
        },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error('Error in PDF compilation:', error);
    return NextResponse.json(
      { error: 'Failed to compile PDF. Please try again.' },
      { status: 500 }
    );
  }
}
