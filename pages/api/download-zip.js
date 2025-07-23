import JSZip from "jszip";
import { imageStore } from "./convert";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || !imageStore[id]) {
    return res.status(404).json({ error: "ZIP not found" });
  }

  const images = imageStore[id];
  const zip = new JSZip();

  images.forEach((img, i) => {
    zip.file(\`page-\${i + 1}.png\`, img, { base64: true });
  });

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", \`attachment; filename=converted-pages-\${id}.zip\`);
  res.status(200).send(zipBuffer);

  delete imageStore[id]; // Clean up
}