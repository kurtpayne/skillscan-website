// GitHub Pages SPA redirect trick.
// Encodes the full path/query/hash into a ?p= query param on the root URL,
// then index.html's spa-redirect.js decodes it and uses history.replaceState
// before React boots.
var l = window.location;
l.replace(
  l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
  l.pathname.split('/').slice(0, 1).join('/') +
  '/?p=' + encodeURIComponent(l.pathname + l.search) +
  (l.hash ? '&h=' + encodeURIComponent(l.hash) : '')
);
