// GitHub Pages SPA routing: restore path encoded by 404.html
(function() {
  var params = new URLSearchParams(window.location.search);
  var p = params.get('p');
  if (p) {
    var h = params.get('h') || '';
    params.delete('p');
    params.delete('h');
    var qs = params.toString();
    window.history.replaceState(
      null, null,
      p + (qs ? '?' + qs : '') + h
    );
  }
})();
