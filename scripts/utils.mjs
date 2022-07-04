import log from 'log-update';

process.stdin.setEncoding('utf-8');

export function getCharAsync() {
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((res) => {
    process.stdin.on('data', (key) => {
      // ctrl-c ( end of text )
      if (key === '\u0003') return process.exit();

      res(key);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    });
  });
}

export async function confirmOrExit(query, expectedChar, exitMsg) {
  process.stdout.write(query);
  if (expectedChar !== (await getCharAsync())) {
    console.log(exitMsg);
    process.exit();
  }
}
