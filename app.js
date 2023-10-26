const express = require("express");
const bodyParser = require("body-parser");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs").promises;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public")); 

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

app.post("/generate", async (req, res) => {
  const { name, email, City, PhoneNumber } = req.body;

  const pdfDoc = await PDFDocument.create();
  const form = pdfDoc.getForm();
  const page = pdfDoc.addPage([595, 842]);


  const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const textHeight = 12;

  const nameText = `Name: ${name}`;
  const emailText = `Email: ${email}`;
  const cityText = `City: ${City}`;
  const phoneNumberText = `Phone Number: ${PhoneNumber}`;


  const textX = 150;
  const startY = 600;
  const spacing = 25;

  page.drawText(nameText, { x: textX, y: startY, size: textHeight, font: timesFont });
  page.drawText(emailText, { x: textX, y: startY - spacing, size: textHeight, font: timesFont });
  page.drawText(cityText, { x: textX, y: startY - 2 * spacing, size: textHeight, font: timesFont });
  page.drawText(phoneNumberText, { x: textX, y: startY - 3 * spacing, size: textHeight, font: timesFont });


  const pdfBytes = await pdfDoc.save();
  await fs.writeFile('generated_cv.pdf', pdfBytes);
  res.download('generated_cv.pdf');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

