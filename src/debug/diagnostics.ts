const envVars = [
  'HOME',
  'PATH',
  'HOSTNAME',
  'LANG',
  'PWD',
  'SHELL',
  'USER'
];

export function printDiagnostic() {
  console.log('-----------------------------');
  console.log('DIAGNOSTIC - START');
  console.log('---');

  console.log('ENV VARS');
  envVars.forEach(x => {
    console.log(`${x}: ${Deno.env.get(x)}`);
  });

  console.log('---');
  console.log('VERSION INFO');
  console.log(`DENO: ${Deno.version.deno}`);
  console.log(`TS: ${Deno.version.typescript}`);
  console.log(`V8: ${Deno.version.v8}`);

  console.log('---');
  console.log('DIAGNOSTIC - STOP');
  console.log('-----------------------------');
}
