'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Correct import for canvas rendering

const GenerateQR = () => {
  const [text, setText] = useState('');
  const [qrSize, setQrSize] = useState(200);

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Create a new canvas with padding
      const paddedCanvas = document.createElement('canvas');
      const padding = 20; // 4px padding on each side
      paddedCanvas.width = canvas.width + (padding * 2);
      paddedCanvas.height = canvas.height + (padding * 2);
      
      const ctx = paddedCanvas.getContext('2d');
      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
      // Draw the original QR code in the center
      ctx.drawImage(canvas, padding, padding);
      
      const image = paddedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="mt-24">
      <div className="max-w-7xl md:mx-auto bg-white rounded-lg shadow-xl p-8 border-1 border-dashed mx-2">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">QR Code Generator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter text or URL
              </label>
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QR Code Size
              </label>
              <input
                type="range"
                min="100"
                max="400"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-500">{qrSize}px</p>
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="flex flex-col items-center justify-center space-y-6">
            {text ? (
              <>
                <div className="bg-white p-4 rounded-lg shadow">
                  <QRCodeCanvas
                    value={text}
                    size={qrSize}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>
                <button
                  onClick={downloadQR}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Download QR Code
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Enter something to generate QR</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQR;
