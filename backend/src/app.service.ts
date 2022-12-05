import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {


  /***
   * 
   * FetchSheriff - Get listings from SHerrif website
   */
  async fetchSherrif() {
      const sherrifQuery = "draw=1&columns%5B0%5D%5Bdata%5D=propertyId&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=referenceNumber&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=salesDate&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=false&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=plaintiff&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=false&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=defendant&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=false&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=propertyAddress&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=25&search%5Bvalue%5D=&search%5Bregex%5D=false&isOpenStatus=true&sheriffNumber=&plaintiff=&defendant=&address=&saleStartDate=&saleEndDate=";
      const response = await fetch('https://sheriffsaleviewer.polkcountyiowa.gov/Home/PropertyListJson', {
          // learn more about this API here: https://graphql-pokemon2.vercel.app/
          method: 'POST',
          headers: {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "en-US,en;q=0.9,es;q=0.8",
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sec-gpc": "1",
              "x-requested-with": "XMLHttpRequest",
              "cookie": ".AspNetCore.Antiforgery.9r3Ldye5ReY=CfDJ8JsJB6qCTMdMjJWxH8M3-8G8UmBuFBuowo37U74lSfQFtREbzZUiP3JbSyNF0YV7TMiPygu5a_lRdRLBG5byiSo49dI_mM_wbO2y4fJa3dY0-0upAY7rQdAjzbDENI3UvhXWQ-AB7WcCpZ2D8LzzK80",
              "Referer": "https://sheriffsaleviewer.polkcountyiowa.gov/",
              "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          body: sherrifQuery, 
      })
      const {data, errors} = await response.json()
      if (response.ok) {
        return JSON.stringify(data);
      } else {
        console.log('Bad or no response from https://sheriffsaleviewer.polkcountyiowa.gov');
      }
  }



  /***
   * 
   * sheriffDetails - Get listings from SHerrif website
   * 
   * 
   * 
   */
  async sheriffDetails(propertyId) {
    const url = 'https://sheriffsaleviewer.polkcountyiowa.gov/Home/Detail/'+propertyId;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9,es;q=0.8",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-requested-with": "XMLHttpRequest",
            "cookie": ".AspNetCore.Antiforgery.9r3Ldye5ReY=CfDJ8JsJB6qCTMdMjJWxH8M3-8G8UmBuFBuowo37U74lSfQFtREbzZUiP3JbSyNF0YV7TMiPygu5a_lRdRLBG5byiSo49dI_mM_wbO2y4fJa3dY0-0upAY7rQdAjzbDENI3UvhXWQ-AB7WcCpZ2D8LzzK80",
            "Referer": "https://sheriffsaleviewer.polkcountyiowa.gov/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      });
      const data = await response.text()
      if (response.ok) {
        const cheerio = require('cheerio');
        const htmlparser2 = require('htmlparser2');
        const dom = htmlparser2.parseDocument(data, 'text/html');
        const $ = cheerio.load(dom);
        const judgementDetails = $('.table-striped td').eq(1).text().trim();
        console.log('returning:' + JSON.stringify(judgementDetails));
        return JSON.stringify(judgementDetails);
      } else {
        console.log('Bad or no response from https://sheriffsaleviewer.polkcountyiowa.gov');
      }
  }
}