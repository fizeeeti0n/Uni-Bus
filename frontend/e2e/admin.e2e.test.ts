import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

describe('Admin Flow E2E', () => {
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

  it('can authenticate and view admin dashboard', async () => {
    await driver.get(baseUrl + '/admin/login');

    // Admin portal login
    const heading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Administrator Access')]")),
      5000
    );
    expect(await heading.isDisplayed()).toBe(true);

    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys("admin@university.edu");

    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys("securepassword123");

    const codeInput = await driver.findElement(By.id("adminCode"));
    await codeInput.sendKeys("ADMIN2026");

    const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Sign In as Admin')]"));
    await submitBtn.click();

    // Wait for redirect to admin dash
    await driver.wait(until.urlContains('/admin'), 5000);

    // Expect Overview to be present
    const overviewHeading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Admin Dashboard')]")),
      5000
    );
    expect(await overviewHeading.isDisplayed()).toBe(true);
  });

  it('can switch tabs successfully', async () => {
    // Assuming already on admin dashboard from previous test
    // Click Buses tab
    const busesTab = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'buses') or contains(., 'Buses')]")),
      5000
    );
    await driver.executeScript("arguments[0].click();", busesTab);

    // Check Add Bus button appears
    const addBusBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Add Bus')]")),
      5000
    );
    expect(await addBusBtn.isDisplayed()).toBe(true);
  });
});
