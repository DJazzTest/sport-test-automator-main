const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// POST /api/run-playwright
app.post('/api/run-playwright', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing Playwright code' });

  // Write code to temp file
  const tempFile = path.join(__dirname, 'temp-test.spec.ts');
  fs.writeFileSync(tempFile, code, 'utf8');

  // Run Playwright test
  exec(`npx playwright test ${tempFile} --reporter=line`, { cwd: __dirname }, (err, stdout, stderr) => {
    // Clean up temp file
    fs.unlinkSync(tempFile);
    if (err) {
      return res.json({ success: false, output: stderr || stdout });
    }
    res.json({ success: true, output: stdout });
  });
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Playwright runner API listening on port ${PORT}`);
});
