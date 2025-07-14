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
  const { code, browser } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing Playwright code' });

  // Validate browser
  const allowedBrowsers = ['chromium', 'firefox', 'webkit'];
  const browserProject = allowedBrowsers.includes(browser) ? browser : 'chromium';

  // Write code to temp file
  const tempFile = path.join(__dirname, 'temp-test.spec.ts');
  fs.writeFileSync(tempFile, code, 'utf8');

  // Run Playwright test with browser selection
  exec(`npx playwright test ${tempFile} --project=${browserProject} --reporter=line`, { cwd: __dirname }, (err, stdout, stderr) => {
    // Clean up temp file
    fs.unlinkSync(tempFile);
    if (err) {
      // Suggestion logic
      const output = stderr || stdout || '';
      const suggestions = [];
      if (/Timeout.*exceeded|timed out/i.test(output)) {
        suggestions.push('Timeout exceeded: The page may be slow to load, the selector may not exist, or the network is slow. Consider increasing the timeout or checking your selectors.');
      }
      if (/not found|No node found|Unable to locate element|waiting for selector/i.test(output)) {
        suggestions.push('Selector not found: The element may not exist, be hidden, or the selector may be incorrect. Check for typos or use waitForSelector.');
      }
      if (/expect.*failed|AssertionError|assertion failed/i.test(output)) {
        suggestions.push('Assertion failed: The expected value may be incorrect, or the page state may not be ready. Double-check your assertions and ensure the page is in the correct state.');
      }
      if (/Navigation.*failed|net::ERR|ERR_CONNECTION|ERR_ABORTED|Cannot navigate/i.test(output)) {
        suggestions.push('Navigation error: The URL may be wrong, the page may require authentication, or there may be network issues. Check the URL and authentication requirements.');
      }
      if (suggestions.length === 0) {
        suggestions.push('Check the error message above and Playwright documentation for more details.');
      }
      return res.json({ success: false, output, suggestions });
    }
    res.json({ success: true, output: stdout, suggestions: [] });
  });
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Playwright runner API listening on port ${PORT}`);
});
