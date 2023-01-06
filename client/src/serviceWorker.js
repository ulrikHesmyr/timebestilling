export function r(){
    
navigator.serviceWorker.register('./serviceWorker.js').then((registration)=>{
    console.log("Worker is registered", registration);
  }).catch((error)=>{
    console.log("Registration of worker failed", error);
  })
  navigator.serviceWorker.ready.then(function(registration){
    registration.showNotification('Hello world!');
  })

    //self.addEventListener('push', (event)=>{
    //    const data = event.data.json();
    //    const title = data.tile;
    //    const options = {
    //        body:data.body,
    //    }
    //
    //    event.waitUntil(self.registration.showNotification(title, options)); //ServiceWorkerRegistration
    //});
    //
    //self.addEventListener('notificationclick', (event)=>{
    //    event.notification.close();
    //
    //    event.waitUntil(
    //        clients.openWindow(event.notification.data.url)
    //    );
    //})
}