/* Shifts service worker — notifications only, no caching (so updates are never stale) */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e){
  var d={};
  try{ d=e.data.json(); }catch(_){ d={title:'סידור עבודה', body: e.data?e.data.text():''}; }
  e.waitUntil(self.registration.showNotification(d.title||'סידור עבודה',{
    body: d.body||'',
    icon: './icon-192.png',
    badge: './icon-192.png',
    dir: 'rtl',
    lang: 'he',
    data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url=(e.notification.data&&e.notification.data.url)||'./';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){ if('focus' in list[i]) return list[i].focus(); }
    if(self.clients.openWindow) return self.clients.openWindow(url);
  }));
});
