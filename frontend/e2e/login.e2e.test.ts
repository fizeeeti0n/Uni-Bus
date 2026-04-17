import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

describe('Authentication Flow E2E', () => {
  let driver: WebDriver;
  const baseUrl = 'http://localhost:5173';

  beforeAll(async () => {
    // Setup Edge options
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

  it('navigates to login via Home page', async () => {
    // 1. Visit Home
    await driver.get(baseUrl + '/');

    // 2. Find and click Login button in navigation
    const loginLink = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(text(), 'Login')]")),
      5000
    );
    await loginLink.click();

    // 3. Wait for Login Page to load
    await driver.wait(until.urlContains('/login'), 5000);
    const heading = await driver.findElement(By.xpath("//h1[contains(text(), 'Welcome Back')]"));
    expect(await heading.isDisplayed()).toBe(true);
  });

  it('can login as a student', async () => {
    // 1. Visit Login directly
    await driver.get(baseUrl + '/login');

    // 2. Click Student toggle 
    const studentToggle = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Student')]")),
      5000
    );
    await studentToggle.click();

    // 3. Fill in email and password
    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys("student@university.edu");

    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys("password123");

    // 4. Submit form
    const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Sign In')]"));
    await submitBtn.click();

    // 5. Assert navigation to student dashboard
    await driver.wait(until.urlContains('/student'), 5000);

    // 6. Assert dashboard loads correctly
    const trackingHeading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Bus Tracking')]")),
      5000
    );
    expect(await trackingHeading.isDisplayed()).toBe(true);
  });
});
