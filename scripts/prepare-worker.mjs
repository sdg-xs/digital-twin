import {copyFile,mkdir} from 'node:fs/promises';
const source=import.meta.resolve('@thatopen/fragments/worker');
await mkdir(new URL('../public/engine/',import.meta.url),{recursive:true});
await copyFile(new URL(source),new URL('../public/engine/worker.mjs',import.meta.url));
console.log('Prepared the worker matching the installed That Open Fragments version.');
