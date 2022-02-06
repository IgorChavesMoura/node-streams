import http from 'http';
import { createReadStream, readFileSync } from 'fs';

http.createServer((req, res) => {

    // Bad approach for big files
    // const file = readFileSync('bigfile');
    
    // res.write(file);
    // res.end();

    createReadStream('bigfile').pipe(res);

}).listen(3000, () => console.log('running at 3000'));