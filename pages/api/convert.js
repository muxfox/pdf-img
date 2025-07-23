import formidable from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const imageStore = {};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = "/tmp";
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    const id = uuidv4();
    const sampleImagePath = path.resolve("./public/sample.png");
    const sampleBase64 = fs.readFileSync(sampleImagePath, { encoding: "base64" });

    imageStore[id] = [sampleBase64];

    res.status(200).json({
      images: imageStore[id],
      zipId: id,
    });
  });
}