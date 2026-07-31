/* Service worker for The Hall.
   Network-first for the app itself, so a phone's home-screen install picks up a
   new build automatically on the next launch — no tap, no re-add. The app is a
   single self-contained file, so caching the one navigation response is the whole
   app; the cached copy is only ever served when the network can't be reached
   (offline play). While you are online it always serves the freshest deploy, so
   it can never strand you on a stale version. */
const CACHE='hall-shell';
const SHELL='./';                 // the app lives at the scope root, one file
const NET_TIMEOUT=4000;           // don't hang a launch on a slow network — fall back to cache

self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 await self.clients.claim();
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));   // drop old cache versions
})()));

const timeout=ms=>new Promise((_,rej)=>setTimeout(()=>rej(new Error('slow')),ms));

self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET'||req.mode!=='navigate')return;   // only manage the app page; all else goes straight to network
 e.respondWith((async()=>{
  try{
   const res=await Promise.race([fetch(SHELL,{cache:'no-store'}),timeout(NET_TIMEOUT)]);   // freshest deploy
   if(res&&res.ok){ const c=await caches.open(CACHE); c.put(SHELL,res.clone()).catch(()=>{}); }
   return res;
  }catch(_){
   const c=await caches.open(CACHE);            // offline (or slow) — last good copy
   const hit=await c.match(SHELL);
   return hit||Response.error();
  }
 })());
});
