import { useState } from "react";

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [zipId, setZipId] = useState(null);

  const handleFiles = async (file) => {
    if (!file || file.type !== "application/pdf") return;

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    const res = await fetch("/api/convert", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImages(data.images);
    setZipId(data.zipId);
    setLoading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFiles(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">PDF to Image Converter</h1>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={\`border-4 border-dashed p-8 rounded-lg mb-4 transition-colors \${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"}\`}
        >
          <p className="text-gray-500">Drag & drop your PDF here</p>
          <p className="text-sm mt-2 text-gray-400">or click to upload</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFiles(e.target.files[0])}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer block mt-4">
            <div className="inline-block bg-blue-500 text-white py-2 px-4 rounded shadow">
              Choose File
            </div>
          </label>
        </div>

        {loading && <p className="text-blue-500">Converting...</p>}

        <div className="grid gap-4 mt-6">
          {images.map((src, i) => (
            <img
              key={i}
              src={\`data:image/png;base64,\${src}\`}
              alt={\`Page \${i + 1}\`}
              className="border rounded shadow"
            />
          ))}
        </div>

        {zipId && (
          <a
            href={\`/api/download-zip?id=\${zipId}\`}
            className="mt-6 inline-block bg-green-500 text-white py-2 px-4 rounded shadow"
          >
            Download ZIP
          </a>
        )}
      </div>
    </div>
  );
}