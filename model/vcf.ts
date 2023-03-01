const fs = require('fs');
var vCard = require( 'vcf' )
const axis = require('axios');

// Read the VCF file as a string



export async function extract_name_and_number(url: string) {
    try {
        // Download the VCF file using Axios
        const response = await axis.get(url);
    
        // Save the VCF file locally
        fs.writeFileSync('contact.vcf', response.data);
    
        // Parse the VCF file using vCardsJS
        const vc = new vCard().parse(fs.readFileSync('contact.vcf', 'utf8'));
        console.log(vc);
    
        // Extract the contact name and phone number
        const name = vc.data.fn.value;
        const phone = vc.data.tel[0].value;
    
        // Return the name and phone number as an object
        return { name, phone };
    } catch (error) {
      console.error(error);
      return { name: null, number: null }
    }
}
