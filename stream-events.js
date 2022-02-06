// Stream events
process.stdin.pipe(process.stdout).on('data', msg => console.log('data', msg.toString()))
                                  .on('error', msg => console.log('error', msg.toString()))
                                  .on('end', _ => console.log('end'))
                                  .on('close', _ => console.log('close'));
