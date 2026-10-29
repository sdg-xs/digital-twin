import {defineConfig} from 'vite';
export default defineConfig({base:'./',cacheDir:'.cache/vite',server:{host:'127.0.0.1',port:4174,strictPort:true},build:{chunkSizeWarningLimit:1800}});
