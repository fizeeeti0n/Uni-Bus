import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

describe('Driver Flow E2E', () => {
  let driver: WebDriver;
  const baseUrl = 'http://localhost:5173';

  beforeAll(async () => {
    const options = new edge.Options();
    // options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1280,800');

    driver = await new Builder()
      .forBrowser('MicrosoftEdge')
      .setEdgeOptions(options)
      .build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('views driver dashboard and interacts with trip state', async () => {
    await driver.get(baseUrl + '/driver');

    const driverHeading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Driver #101')]")),
      5000
    );
    expect(await driverHeading.isDisplayed()).toBe(true);

    // Start trip
    const startTripBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Start Trip')]")),
      5000
    );
    await startTripBtn.click();

    // Verify trip is active by looking for End Trip
    const endTripBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'End Trip')]")),
      5000
    );
    expect(await endTripBtn.isDisplayed()).toBe(true);
  });
});
