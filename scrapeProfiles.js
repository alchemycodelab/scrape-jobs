const puppeteer = require('puppeteer');

module.exports = async(job) => {
  const browser = await puppeteer.launch();
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
  await page.$('#TblOrgTitle');
  await page.click('input[name="BtnProfile"]');

  // Click Profile Report Again
  await page.$('#TblOrgTitle');
  await page.click('input[name="BtnProfile"]');

  // Scrape Employee Info

  let nameIDAgencyTable = await page.$('#TableNmAg');
  const nameIDAgencyArray = await nameIDAgencyTable.evaluate(element => {
    return [...element.querySelectorAll('#TableNmAg td').values()]
      .map(node => node.innerText);
  });

  let statusTable = await page.$('#Table1');
  const statusArray = await statusTable.evaluate(element => {
    return [...element.querySelectorAll('#Table1 td:nth-child(2)').values()]
      .map(node => node.innerText);
  });


  // Scrape Employment History
  let employmentTable = await page.$('#DataGridEmpHst');
  const employmentArray = await employmentTable.evaluate(element => {
    return [...element.querySelectorAll('#DataGridEmpHst tr').values()]
      .map(node => node.innerText)
      .map(row => row.split('\t'))
      .map(row => ({ 
        date: row[0], 
        agency: row[1], 
        action: row[2], 
        rank: row[3], 
        classification: row[4] || '', 
        assignment: row[5] || '' 
      }));
  });

  // Scrape Certifications
  let certificationTable = await page.$('#DataGridEmpCert');
  const certificationArray = await certificationTable.evaluate(element => {
    return [...element.querySelectorAll('#DataGridEmpCert tr').values()]
      .map(node => node.innerText)
      .map(row => row.split('\t'));
  });

  // Scrape Training
  let trainingTable = await page.$('#DataGrid1');
  const trainingArray = await trainingTable.evaluate(element => {
    return [...element.querySelectorAll('#DataGrid1 tr').values()]
      .map(node => node.innerText)
      .map(row => row.split('\t'));
  });
  
  //   Scrape Attributes
  let attributesTable = await page.$('#DataGridEmpAttr');
  const attributesArray = await attributesTable.evaluate(element => {
    return [...element.querySelectorAll('#DataGridEmpAttr tr').values()]
      .map(node => node.innerText)
      .map(row => row.split('\t'));
  });

  //   Scrape Education
  let educationTable = await page.$('#DataGridEmpEduc');
  const educationArray = await educationTable.evaluate(element => {
    return [...element.querySelectorAll('#DataGridEmpEduc tr').values()]
      .map(node => node.innerText)
      .map(row => row.split('\t'));
  });

  await browser.close();
  console.log([
    ...nameIDAgencyArray, 
    ...statusArray, 
    ...employmentArray, 
    ...certificationArray, 
    ...trainingArray, 
    ...attributesArray, 
    ...educationArray
  ]);

  return Promise.resolve({ nameIDAgencyArray, statusArray, employmentArray, certificationArray, trainingArray, attributesArray, educationArray });
};
