import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

describe('Student Flow E2E', () => {
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

  it('views student dashboard properly', async () => {
    // Navigate directly
    await driver.get(baseUrl + '/student');

    const overviewHeading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Bus Tracking')]")),
      5000
    );
    expect(await overviewHeading.isDisplayed()).toBe(true);

    // Verify SOS feature is present
    const sosBtn = await driver.findElement(By.xpath("//button[contains(., 'SOS')]"));
    expect(await sosBtn.isDisplayed()).toBe(true);
  });
});
