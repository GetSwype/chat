const fs = require('fs');
import vCard from 'vcf';
const axis = require('axios');
import vcardparser from 'vcardparser';

// Read the VCF file as a string



export async function extract_name_and_number(url: string) {
  try {
    // Download the VCF file using Axios
    const response = await axis.get(url);

    // Parse the VCF file using vCardsJS
    vcardparser.parseString(response.data, (err: any, vcard: any) => {
      console.log(vcard.tel);
    })

    // Extract the contact name and phone number
    // const name = vc.data.fn.value;
    // const phone = vc.data.tel[0].value;

    // Return the name and phone number as an object
    return { name: "name", phone: "phone" };
    // return { name, phone };
  } catch (error) {
    console.error(error);
    return { name: null, number: null }
  }
}
