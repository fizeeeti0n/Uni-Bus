import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge';
import { describe, it, beforeAll, afterAll, expect } from 'vitest';

describe('Registration Flow E2E', () => {
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

  it('can fill out and submit registration form', async () => {
    await driver.get(baseUrl + '/register');

    const heading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Create Account')]")),
      5000
    );
    expect(await heading.isDisplayed()).toBe(true);

    const firstNameInput = await driver.findElement(By.id("firstName"));
    await firstNameInput.sendKeys("Test");

    const lastNameInput = await driver.findElement(By.id("lastName"));
    await lastNameInput.sendKeys("User");

    const emailInput = await driver.findElement(By.id("email"));
    await emailInput.sendKeys("test.user@university.edu");

    const studentIdInput = await driver.findElement(By.id("studentId"));
    await studentIdInput.sendKeys("STU-123456");

    const phoneInput = await driver.findElement(By.id("phone"));
    await phoneInput.sendKeys("+1234567890");

    const passwordInput = await driver.findElement(By.id("password"));
    await passwordInput.sendKeys("securepassword123");

    const confirmPasswordInput = await driver.findElement(By.id("confirmPassword"));
    await confirmPasswordInput.sendKeys("securepassword123");

    const termsCheckbox = await driver.findElement(By.id("terms"));
    await driver.executeScript("arguments[0].click();", termsCheckbox); // Use JS click to avoid scroll interception

    const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Create Account')]"));
    await submitBtn.click();

    // Verify it redirects to login or completes
    await driver.wait(until.urlContains('/login'), 5000);
    const loginHeading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Welcome Back')]")),
      5000
    );
    expect(await loginHeading.isDisplayed()).toBe(true);
  });
});
