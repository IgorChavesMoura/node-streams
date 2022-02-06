import axios from 'axios';
import { Writable, PassThrough } from 'stream';

const API_01 = 'http://localhost:3000';
const API_02 = 'http://localhost:4000';

const requests = await Promise.all([
    axios({
        method: 'get',
        url: API_01,
        responseType: 'stream'
    }),
    axios({
        method: 'get',
        url: API_02,
        responseType: 'stream'
    })
]);

const result = requests.map(({ data }) => data);

const output = new Writable({
    write(chunk, enc, callback) {
        const data = chunk.toString().replace(/\n/, '');
        const name = data.match(/:"(?<name>.*)(?=-)/).groups.name;
        console.log(`[${name.toLowerCase()}] ${data}`);
        callback();
    }
});

function merge(streams) {
    return streams.reduce((prev, current, index, items) => {
        // prevent stream to close by itself
        current.pipe(prev, { end: false });

        // When we put end as false, we can manipulate when the current ends. 
        // When it finished, we check if everyone in the pipeline has closed. 
        // If not, it forces the previous chain to close.
        current.on('end', () => items.every(s => s.ended) && prev.end());
        return prev;

    }, new PassThrough());
}

const streams = merge(result).pipe(output);

// result[0].pipe(output);
// result[1].pipe(output);
