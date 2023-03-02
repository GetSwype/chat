const fs = require('fs');
const axis = require('axios');
import vcardparser from 'vcardparser';


const parseVCF = (vcf: string) => {
  return new Promise((resolve, reject) => {
    vcardparser.parseString(vcf, (err: any, data: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
}

export async function extract_name_and_number(url: string) {
  try {
    // Download the VCF file using Axios
    const response = await axis.get(url);
    // Parse the VCF file using vCardsJS
    const contact: any = await parseVCF(response.data)

    // Extract the contact name and phone number
    // const name = vc.data.fn.value;
    // const phone = vc.data.tel[0].value;

    // Return the name and phone number as an object
    return { name: contact.n.first, phone: contact.tel[0].value };
    // return { name, phone };
  } catch (error) {
    console.error(error);
    return { name: null, number: null }
  }
}
