import { injectable } from "tsyringe";
import logger from "../utils/logger";
import { chromium } from "playwright";

@injectable()
class ScrapeService {
  constructor() {}

  async scrape() {
    try {
      const browser = await chromium.launch({ headless: false }); // set headless: true to hide browser
      const page = await browser.newPage();

      await page.goto("https://www.tradingview.com/");

      // Example: Wait for the login button or some element
      await page.waitForTimeout(5000); // or use more specific waits like `page.waitForSelector()`

      await page.locator('button[aria-label="Open user menu"]').first().click();
      await page
        .locator('button[data-name="header-user-menu-sign-in"]')
        .first()
        .click();

      await page.locator('button[name="Email"]').first().click();

      await page.fill('input[id="id_username"]', "joshuaagbeja@punch.agency");
      await page.fill('input[id="id_password"]', "Oagbeja@019@");

      await page
        .locator('button[data-overflow-tooltip-text="Sign in"]')
        .first()
        .click();

      await page.goto("https://www.tradingview.com/chart");
      // You can interact here: click buttons, fill forms,  etc.

      await page
        .locator('button[aria-label="Open Trading Panel"]')
        .first()
        .click();

      await page.locator('div[data-broker="Paper"]').first().click();
      await page.locator('button[data-name="Join for free"]').first().click();

      await page
        .locator('button[aria-label="Open Trading Panel"]')
        .first()
        .click();

      // You can interact here: click buttons, fill forms, etc.
      console.log(await page.title());

      //   await  browser.close();
    } catch (err) {
      console.log({ err });
    }
  }
}

export default ScrapeService;
