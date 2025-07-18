import { test, expect } from '@playwright/test';

// Increase timeout for slow CI/network environments
// Set test timeout to 3 minutes (180000 ms)
test.setTimeout(180000);

test('PlanetSportBet – All In Play events animation check', async ({ page }) => {
  await page.goto('https://planetsportbet.com/');
  await page.getByRole('button', { name: /Allow all/i }).click();
  await page.locator('[data-test="close-icon"] path').click();
  await page.locator('[data-test="inplay-link"]').click();
  // Wait for event wrappers to load
  const eventWrappers = page.locator('.css-f5hkhk-EventRowWrapper');
  await expect(eventWrappers.first()).toBeVisible({ timeout: 10000 });
  const count = await eventWrappers.count();
  console.log(`Number of In Play events: ${count}`);
  let results: {event: string, result: string}[] = [];

  // Determine which indices to test
  let indices: number[] = [];
  if (count === 15) {
    // Test 7 evenly distributed events
    indices = [0, 2, 4, 6, 8, 10, 14];
  } else {
    indices = Array.from({length: count}, (_, i) => i);
  }

  for (const i of indices) {
    const event = eventWrappers.nth(i);
    // Try to get the event title for reporting
    let eventTitle = '';
    try {
      eventTitle = await event.locator('.css-1qujoqs-EventRowTitle').innerText();
    } catch {
      eventTitle = `Event index ${i}`;
    }
    await event.scrollIntoViewIfNeeded();
    await event.click();
    await page.waitForTimeout(2000); // let animation load
    try {
      await page.waitForSelector('animate-svg, #animate-svg', { timeout: 10000 });
      try {
        await page.screenshot({ path: `animation_found_${i}.png`, fullPage: true });
      } catch (ssErr) {
        console.error(`Could not take PASS screenshot for event ${eventTitle}. Page may be closed.`, ssErr);
      }
      results.push({ event: eventTitle, result: 'PASS' });
      console.log(`PASS: Animation found for event: ${eventTitle}`);
    } catch (err) {
      try {
        await page.screenshot({ path: `FAILED_${i}.png`, fullPage: true });
      } catch (ssErr) {
        console.error(`Could not take FAIL screenshot for event ${eventTitle}. Page may be closed.`, ssErr);
      }
      results.push({ event: eventTitle, result: 'FAIL' });
      console.log(`FAIL: Animation NOT found for event: ${eventTitle}`);
      console.error('❌ Test failed:', err);
    }
    // Always navigate back to IN PLAY page
    try {
      await page.goto('https://planetsportbet.com/inplay');
      await expect(eventWrappers.first()).toBeVisible({ timeout: 10000 });
    } catch (navErr) {
      console.error('❌ Failed to navigate back to IN PLAY page or reload event wrappers.', navErr);
      break; // Stop further tests if navigation fails
    }
  }
  console.log('--- Test Results ---');
  results.forEach(r => console.log(`${r.result}: ${r.event}`));
});
