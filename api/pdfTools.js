import { exec } from 'child_process';
import fs from 'fs';
import SmartSDK from '../smartSDK.js';

const smart = new SmartSDK();
export default class pdfTools{
    convertToImages(path, title) {
        const sampleTitle = smart.placeholdify(title);
        fs.mkdirSync(`./PAGES/${sampleTitle}`);
        const command = `mutool convert -o ./PAGES/${sampleTitle}/${sampleTitle}.png ${path}`;
        console.log(command);
        exec(command);
    }
}