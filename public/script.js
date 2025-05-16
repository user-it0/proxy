document.getElementById('proxyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('urlInput').value.trim();
  if (!input) return;

  const isURL = input.includes('.') || input.startsWith('http');
  const target = isURL ? input : 'https://duckduckgo.com/?q=' + encodeURIComponent(input);

  // Save history
  let historyArr = JSON.parse(localStorage.getItem('tm_proxy_history') || '[]');
  historyArr.push({ time: new Date().toISOString(), query: target });
  localStorage.setItem('tm_proxy_history', JSON.stringify(historyArr));

  // Redirect without adding to history, encode URL
  window.location.replace('/proxy/' + encodeURIComponent(target));
});

function displayHistory(filter = '') {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  historyList.innerHTML = '';
  let historyArr = JSON.parse(localStorage.getItem('tm_proxy_history') || '[]').reverse();
  historyArr.forEach(item => {
    if (item.query.toLowerCase().includes(filter.toLowerCase())) {
      const li = document.createElement('li');
      li.textContent = `${item.query} (${new Date(item.time).toLocaleString()})`;
      historyList.appendChild(li);
    }
  });
}

document.getElementById('historySearch')?.addEventListener('input', function() {
  displayHistory(this.value);
});
displayHistory();

function goBack() {
  window.location.href = '/';
}

window.addEventListener('DOMContentLoaded', () => {
  const isProxyPage = window.location.pathname.startsWith('/proxy/');
  const backButton = document.getElementById('backButton');
  if (isProxyPage && backButton) backButton.style.display = 'inline-block';
});

// On unload, clear local history and replace URL
window.addEventListener('beforeunload', () => {
  try { history.replaceState(null, '', '/'); } catch {}
  localStorage.removeItem('tm_proxy_history');
});