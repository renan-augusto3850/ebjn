import { exec } from 'child_process';
export default class pdfTools{
    convertToImages(path, title) {
        exec(`magick convert ${path} -quality 100 temp/${title}-%3d.jpg`);
    }
}