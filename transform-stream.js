import { Readable, Writable, Transform } from 'stream';
import { createWriteStream } from 'fs';

const readable = Readable({
    read() {

        for(let index = 0; index < 1e6; index++){
            const person = { id: Date.now() + index, name: `Igor-${index}` };
            this.push(JSON.stringify(person));
        }

        // Signal that the data has ended
        this.push(null);
    }
});

const mapFields = Transform({
    transform(chunk, encoding, cb) {
        const data = JSON.parse(chunk); 
        const result = `${data.id},${data.name.toUpperCase()}\n`;

        cb(null, result);
    } 
});

const mapHeaders = Transform({
    transform(chunk, encoding, cb) {
        this.counter = this.counter ?? 0;
        if(this.counter) {
            return cb(null, chunk);
        }

        this.counter += 1;
        cb(null, 'id,name\n'.concat(chunk));
    }
});

const writable = Writable({
    write(chunk, encoding, cb) {
        console.log('msg', chunk.toString());

        cb();
    }
});

const pipeline = readable
    .pipe(mapFields)
    .pipe(mapHeaders)
    .pipe(createWriteStream('my.csv')); // Writable is always the output

pipeline.on('end', () => console.log('pipeline done'));