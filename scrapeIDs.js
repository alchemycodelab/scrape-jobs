/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
const puppeteer = require('puppeteer');

let uniqueIdArray = [];

const scrapeIds = async(job) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://dpsstnet.state.or.us/PublicInquiry_CJ/smsgoperson.aspx', { waitUntil: 'load' });
  await page.waitFor('input[name=txtFindValue]');
  await page.$eval('input[name=txtFindValue]', (el, letter) => el.value = letter, job.data.letter);
  await page.click('input[type="submit"]');

  job.progress(25);

  do{
    await page.waitForNavigation({ waitUntil: 'load' });
    let lastNameSearchTable = await page.$('#DataGridAgcyEmp');
    const idArray = await lastNameSearchTable.evaluate(element => {
      return [...element.querySelectorAll('#DataGridAgcyEmp tr').values()]
        .map(node => node.innerText)
        .map(row => row.split('\t'))
        .map(row => (row[1]));
    });

    idArray.slice(1, -1).forEach(item => !uniqueIdArray.includes(item) ? uniqueIdArray.push(item) : item);

    if(!await page.$('a[href*="ctl54$_ctl1"]')) break;
    await page.evaluate(() => __doPostBack('DataGridAgcyEmp$_ctl54$_ctl1', ''));
  } while(true);

  job.progress(100);
  //   console.log(uniqueIdArray);
  await browser.close();
  return uniqueIdArray;
};

module.exports = { 
  scrapeIds,
  uniqueIdArray
};
