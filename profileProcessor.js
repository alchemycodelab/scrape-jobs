require('dotenv').config();

const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const RawProfile = require('./lib/models/RawProfile');

module.exports = async(job) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });
  const page = await browser.newPage();

  // Search by DPSST ID
  await page.goto('http://dpsstnet.state.or.us/PublicInquiry_CJ/smsgoperson.aspx', { waitUntil: 'load' });
  await page.waitFor('input[id="RadioButtonList1_1"]');
  await page.$eval('input[id="RadioButtonList1_1"]', el => el.checked = '"checked"');
  await page.$eval('input[name=txtFindValue]', (el, id) => el.value = id, job.data.id);
  await page.click('input[type="submit"]');

  // Find and click the first link
  await page.waitFor('#DataGridAgcyEmp');
  await page.$eval('#DataGridAgcyEmp tr:nth-child(2) a', el => el.click());

  // Click Profile Report
  await Promise.all([
    page.waitFor('#TblOrgTitle'),
    page.click('input[name="BtnProfile"]'),
    page.waitForNavigation()
  ]);
 
  await Promise.all([
    page.waitForNavigation(),
    page.waitFor('#FormEmpOptProfile'),
    page.click('input[name="BtnProfile"]')
  ]);

  // Scrape Employee Info
  await page.waitFor('body');
  const bodyHandle = await page.$('body');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);

  await browser.close();
};
