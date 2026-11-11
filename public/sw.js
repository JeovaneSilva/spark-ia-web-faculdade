// Service worker mínimo: torna o app instalável e NÃO guarda nada em cache,
// então o usuário sempre recebe a versão mais recente do site e da API.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {
  // sem interceptação: o navegador segue o fluxo normal de rede
});
