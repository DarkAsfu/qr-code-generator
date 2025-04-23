"use client";

import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const GenerateQR = () => {
  const [text, setText] = useState("");
  const [qrSize, setQrSize] = useState(200);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoShape, setLogoShape] = useState("square");
  const [logoBorder, setLogoBorder] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);
  const [logoScale, setLogoScale] = useState(0.2);
  const [qrWithLogoPreview, setQrWithLogoPreview] = useState(null);

  const handleTextChange = (e) => setText(e.target.value);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setLogoPreview(reader.result);
        generateQrWithLogoPreview(text, qrSize, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    setQrWithLogoPreview(null);
  };

  const generateQrWithLogoPreview = (text, size, logoData) => {
    const qrCanvas = canvasRef.current?.querySelector("canvas");
    if (!text || !logoData || !qrCanvas) return;

    const finalCanvas = document.createElement("canvas");
    const padding = 20;
    finalCanvas.width = qrCanvas.width + padding * 2;
    finalCanvas.height = qrCanvas.height + padding * 2;

    const ctx = finalCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(qrCanvas, padding, padding);

    const img = new Image();
    img.src = logoData;
    img.onload = () => {
      const logoSize = qrCanvas.width * logoScale;
      const x = padding + qrCanvas.width / 2 - logoSize / 2;
      const y = padding + qrCanvas.height / 2 - logoSize / 2;

      // White border
      if (logoBorder) {
        ctx.save();
        ctx.fillStyle = "#ffffff";
        if (logoShape === "rounded") {
          ctx.beginPath();
          ctx.arc(
            x + logoSize / 2,
            y + logoSize / 2,
            logoSize / 2 + 4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else {
          ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
        }
        ctx.restore();
      }

      if (logoShape === "rounded") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          x + logoSize / 2,
          y + logoSize / 2,
          logoSize / 2,
          0,
          Math.PI * 2
        );
        ctx.clip();
      }

      ctx.drawImage(img, x, y, logoSize, logoSize);

      if (logoShape === "rounded") ctx.restore();

      setQrWithLogoPreview(finalCanvas.toDataURL());
    };
  };

  useEffect(() => {
    if (text && logo) {
      generateQrWithLogoPreview(text, qrSize, logo);
    }
  }, [text, qrSize, logo, logoShape, logoBorder, logoScale]);
  

  const downloadQR = () => {
    setIsGenerating(true);
    const qrCanvas = canvasRef.current.querySelector("canvas");
    if (!qrCanvas) return;

    const exportCanvas = document.createElement("canvas");
    const padding = 20;
    exportCanvas.width = qrCanvas.width + padding * 2;
    exportCanvas.height = qrCanvas.height + padding * 2;
    const ctx = exportCanvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(qrCanvas, padding, padding);

    if (logo) {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        const logoSize = qrCanvas.width * logoScale;
        const x = exportCanvas.width / 2 - logoSize / 2;
        const y = exportCanvas.height / 2 - logoSize / 2;

        if (logoBorder) {
          ctx.save();
          ctx.fillStyle = "#ffffff";
          if (logoShape === "rounded") {
            ctx.beginPath();
            ctx.arc(
              x + logoSize / 2,
              y + logoSize / 2,
              logoSize / 2 + 4,
              0,
              Math.PI * 2
            );
            ctx.fill();
          } else {
            ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
          }
          ctx.restore();
        }

        if (logoShape === "rounded") {
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            x + logoSize / 2,
            y + logoSize / 2,
            logoSize / 2,
            0,
            Math.PI * 2
          );
          ctx.clip();
        }

        ctx.drawImage(img, x, y, logoSize, logoSize);

        if (logoShape === "rounded") ctx.restore();

        const image = exportCanvas.toDataURL("image/png");
        triggerDownload(image);
      };
    } else {
      const image = exportCanvas.toDataURL("image/png");
      triggerDownload(image);
    }
  };

  const triggerDownload = (imageData) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `qr-code-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsGenerating(false);
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            QR Code Generator
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create custom QR codes with your logo and style
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Settings Panel */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter text or URL
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      value={text}
                      onChange={handleTextChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 py-3 border-gray-300 rounded-lg border"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Size:{" "}
                    <span className="font-semibold">{qrSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    value={qrSize}
                    onChange={(e) => {
                      setQrSize(Number(e.target.value));
                      if (logo)
                        generateQrWithLogoPreview(
                          text,
                          Number(e.target.value),
                          logo
                        );
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Logo Settings
                  </label>

                  {logoPreview ? (
                    <div className="space-y-4">
                      <div className="md:flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className={`w-16 mb-2 h-16 object-cover ${
                              logoShape === "rounded"
                                ? "rounded-full"
                                : "rounded-md"
                            }`}
                          />
                          <button
                            onClick={removeLogo}
                            className="absolute -top-2 left bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <select
                            value={logoShape}
                            onChange={(e) => {
                              setLogoShape(e.target.value);
                              generateQrWithLogoPreview(text, qrSize, logo);
                            }}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg border"
                          >
                            <option value="square">Square</option>
                            <option value="rounded">Rounded</option>
                          </select>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="logoBorder"
                              checked={logoBorder}
                              onChange={(e) => {
                                setLogoBorder(e.target.checked);
                                generateQrWithLogoPreview(text, qrSize, logo);
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="logoBorder"
                              className="ml-2 block text-sm text-gray-700"
                            >
                              Add white border around logo
                            </label>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Logo Size:{" "}
                              <span className="font-semibold">
                                {Math.round(logoScale * 100)}%
                              </span>
                            </label>
                            <input
                              type="range"
                              min="10"
                              max="50"
                              value={logoScale * 100}
                              onChange={(e) => {
                                const scale = Number(e.target.value) / 100;
                                setLogoScale(scale);
                                generateQrWithLogoPreview(text, qrSize, logo); // Update preview
                              }}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                      {qrWithLogoPreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Preview in QR:
                          </p>
                          <div className="bg-gray-100 p-2 rounded-lg inline-block">
                            <img
                              src={qrWithLogoPreview}
                              alt="QR with logo preview"
                              className={`w-${qrSize} h-${qrSize} object-contain`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 2MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Preview */}
              <div className="flex flex-col items-center justify-center space-y-6">
                {text ? (
                  <>
                    <div
                      className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                      ref={canvasRef}
                    >
                      <QRCodeCanvas
                        value={text}
                        size={qrSize}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <button
                      onClick={downloadQR}
                      disabled={isGenerating}
                      className={`px-6 py-3 rounded-lg font-medium text-white shadow-sm ${
                        isGenerating
                          ? "bg-indigo-400"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } transition-colors duration-200 flex items-center`}
                    >
                      {isGenerating ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            ></path>
                          </svg>
                          Download QR Code
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-gray-100 p-8 rounded-full mb-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Ready to generate
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter some text or URL to create your QR code
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>QR codes will remain valid as long as the linked content exists</p>
        </div>
      </div>
    </div>
  );
};

export default GenerateQR;
