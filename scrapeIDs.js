/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
const puppeteer = require('puppeteer');
const { profileQueue } = require('./queue');

module.exports = async(job) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });
  const page = await browser.newPage();

  await page.goto('http://dpsstnet.state.or.us/PublicInquiry_CJ/smsgoperson.aspx', { waitUntil: 'load' });
  await page.waitFor('input[name=txtFindValue]');
  await page.$eval('input[name=txtFindValue]', (el, letter) => el.value = letter, job.data.letter);
  await page.click('input[type="submit"]');

  job.progress(25);

  do{
    let lastNameSearchTable = await page.waitFor('#DataGridAgcyEmp');
    const idArray = await lastNameSearchTable.evaluate(element => {
      return [...element.querySelectorAll('#DataGridAgcyEmp tr').values()]
        .map(node => node.innerText)
        .map(row => row.split('\t'))
        .map(row => row[1])
        .filter(id => /^\d*$/.test(id));
    });
    
    idArray.forEach(id => profileQueue.add({ id }, { jobId: id }));
    
    if(!await page.$('a[href*="ctl54$_ctl1"]')) break;
    await page.evaluate(() => __doPostBack('DataGridAgcyEmp$_ctl54$_ctl1', ''));
    await page.waitForNavigation({ waitUntil: 'load' });
  } while(true);

  job.progress(100);
  await browser.close();
};

