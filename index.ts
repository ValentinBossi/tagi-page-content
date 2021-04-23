import { chromium, ChromiumBrowser } from 'playwright';
import * as express from 'express';
import { json } from 'body-parser';

const PORT = process.env.PORT || 3001;

const email = process.env['EMAIL'];
const password = process.env['PASSWORD'];


const app = express();

let browser: ChromiumBrowser;

app.use(json())

app.use(function (req, res, next) {
  let hostname;
  try {
    hostname = new URL(req.body.url).hostname;
    console.log(hostname)
  } catch (error) {
  }
  if (browser && hostname === "www.tagesanzeiger.ch") {
    next()
  } else {
    res.statusMessage = "Playwright is not ready or url is invalid";
    res.status(400).end();
  }
});

app.get('/pagecontent', function (req, res, next) {
  getPageContent(req.body.url).then((content) => {
    res.json({ content });
  }).catch(next)
})

app.listen(PORT, async function () {
  console.log('Example app listening on port ' + PORT + '!');
  browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage']
  });
  console.log('Chromium is loaded in version: ', browser.version());
});

const getPageContent = async (url: string): Promise<string> => {
  console.log('Going to ', url)

  const context = await browser.newContext();
  // Open new page
  const page = await context.newPage();
  // Go to https://login.tagesanzeiger.ch/
  await page.goto('https://login.tagesanzeiger.ch/');

  //await page.click('text=E-Mail-Adresse');
  // Fill [placeholder=" "]
  console.log('logging in with email: ', email);
  await page.fill('input[type="email"]', email);
  // Fill input[type="password"]
  await page.fill('input[type="password"]', password);
  // Click button:has-text("Einloggen")
  await page.click('button:has-text("Einloggen")')
  await page.waitForLoadState('networkidle');

  await page.goto(url);
  const content = await page.content();
  await context.close();
  return content;
}