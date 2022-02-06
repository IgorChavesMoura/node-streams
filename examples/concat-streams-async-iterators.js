import axios from 'axios';
import { pipeline } from 'stream/promises';

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

// writable stream
async function* output(stream) {
    for await (const chunk of stream) {
        const name = chunk.match(/:"(?<name>.*)(?=-)/).groups.name;
        console.log(`[${name.toLowerCase()}] ${chunk}`);
    }
}

// passtrough stream
async function* merge(streams) {
    for (const readable of streams) {
        // Set it as objectMode
        readable.setEncoding('utf8');
        for await (const chunk of readable) {
            for (const line of chunk.trim().split(/\n/)) {
                yield line;
            }
        }
    }
}

await pipeline(
    merge(result),
    output
);

