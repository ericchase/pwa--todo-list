// Register the service worker for the app
if ('serviceWorker' in window.navigator) {
    window.navigator.serviceWorker.register('./serviceworker.js');
};

// Lazy load images
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement








// NOTE: TEMPORARY FIX
// Remove GitHub Pages Added Content
for (const el of document.body.querySelectorAll('style')) {
    el.remove();
}
