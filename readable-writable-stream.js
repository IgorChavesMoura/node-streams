import { Readable, Writable } from 'stream';

const readable = Readable({
    read() {
        this.push('Hello World 1');
        this.push('Hello World 2');
        this.push('Hello World 3');

        // Signal that the data has ended
        this.push(null);
    }
});

const writable = Writable({
    write(chunk, encoding, cb) {
        console.log('msg', chunk.toString());

        cb();
    }
});

readable.pipe(writable); // Writable is always the output