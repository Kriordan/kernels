const puppeteer = require("puppeteer");

async function scrapePage(url) {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    const requests = [];
    const cssResponses = [];
    const htmlResponses = [];

    await page.setRequestInterception(true);

    await page.on("request", (request) => {
      requests.push({
        url: request.url(),
        type: request.resourceType(),
      });
      request.continue();
    });

    page.on("response", async (response) => {
      if (response.request().resourceType() === "stylesheet") {
        cssResponses.push(await response.text());
      }
      if (response.request().resourceType() === "document") {
        htmlResponses.push(await response.text());
      }
    });

    await page.goto(url, { timeout: 40000, waitUntil: "networkidle0" });
    const bodyContents = await page.evaluate(() => {
      return document.body.innerHTML;
    });

    await browser.close();

    return {
      requests,
      cssResponses,
      htmlResponses,
      bodyContents,
    };
  } catch (e) {
    console.log(e);
  }
}

module.exports = scrapePage;
