if(!self.define){let e,n={};const i=(i,s)=>(i=new URL(i+".js",s).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,o)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(n[r])return;let t={};const a=e=>i(e,r),c={module:{uri:r},exports:t,require:a};n[r]=Promise.all(s.map((e=>c[e]||a(e)))).then((e=>(o(...e),t)))}}define(["./workbox-e20531c6"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-0db624a7.js",revision:null},{url:"assets/index-1c57e417.css",revision:null},{url:"assets/workbox-window.prod.es5-5ffdab76.js",revision:null},{url:"index.html",revision:"1fba3eaa735b48ef94c93a57a50f1936"},{url:"icons/icon-192x192.png",revision:"3df35bf6172dfacf4df6b653f2b9555a"},{url:"icons/icon-512x512.png",revision:"445f1021a7b4ea7aa6751b5bb294beab"},{url:"manifest.webmanifest",revision:"b86e813462d72f7ad4b03b04dcaca70b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/api.themoviedb.org\//,new e.NetworkFirst({cacheName:"tmdb-api-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e})=>"image"===e.destination),new e.CacheFirst({cacheName:"image-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:604800})]}),"GET")}));
