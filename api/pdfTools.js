import { exec } from 'child_process';
import fs from 'fs';
import SmartSDK from '../smartSDK.js';

const smart = new SmartSDK();
export default class pdfTools{
    convertToImages(path, title) {
        const sampleTitle = smart.placeholdify(title);
        fs.mkdirSync(`./temp/PAGES/${sampleTitle}`);
        exec(`mutool convert -o ./temp/PAGES/${sampleTitle}/${title}.png ${path}`);
    }
}