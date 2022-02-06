import { Duplex, Transform } from 'stream';

let count = 0;

const server = new Duplex({
    objectMode: true, // It allows to not work with buffer => uses more memor tho
    encoding: 'utf-8',
    read() {
        const everySecond = (intervalContext) => {
            if(count++ <= 5) {
                this.push(`My name is Igor[${count}]\n`);
                return;
            }

            clearInterval(intervalContext);
            this.push(null);
        }

        setInterval(function() { everySecond(this) });
    },
    write(chunk, encoding, cb) {
        console.log(`[writable] saving`, chunk);

        cb();
    }
});

//Different communication channels
//Write triggers Duplex's write
server.write('[duplex] hey this is a writable \n');

// on data => logs what happened on readable's .push
// server.on('data', msg => console.log(`[readable]${msg}`));

// push allow's to send more data
server.push(`[duplex] hey this is also a readable!\n`);

//server.pipe(process.stdout); 

const transformToUpperCase = new Transform({
    objectMode: true,
    transform(chunk, enc, cb) {
        cb(null, chunk.toUpperCase());
    }
})

// Transform is also a duplex, but it doesn't has independent communication
transformToUpperCase.write('[transform] hello from write!');

// Push will ignore transform function
transformToUpperCase.push('[transform] hello from push! \n');

server 
    // Redirect's all readable's data to duplex's writable
    .pipe(transformToUpperCase)
    .pipe(server);