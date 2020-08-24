export default function Navigate(route) {
  window.location.hash = '#' + route;
}

window.__navigate = Navigate;
