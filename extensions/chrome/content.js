(function(){
  if(document.getElementById('pricey-widget')) return;
  const a = document.createElement('a');
  a.id = 'pricey-widget';
  a.href = 'https://your-app.example.com';
  a.textContent = 'View Price History';
  a.style.cssText = 'position:fixed;bottom:16px;right:16px;padding:8px 12px;border-radius:8px;background:#0ea5e9;color:#fff;font:14px system-ui;z-index:999999;box-shadow:0 8px 24px rgba(0,0,0,.2)';
  document.body.appendChild(a);
})();