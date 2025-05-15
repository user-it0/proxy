document.getElementById('proxyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('urlInput').value.trim();
  if (!input) return;

  const isURL = input.includes('.') || input.startsWith('http');
  const target = isURL ? input : 'https://www.google.com/search?q=' + encodeURIComponent(input);

  let history = JSON.parse(localStorage.getItem('tm_proxy_history') || '[]');
  history.push({
    time: new Date().toISOString(),
    query: target
  });
  localStorage.setItem('tm_proxy_history', JSON.stringify(history));

  window.location.replace('/proxy/' + target);
});

function displayHistory(filter = '') {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  historyList.innerHTML = '';
  let history = JSON.parse(localStorage.getItem('tm_proxy_history') || '[]');
  history = history.reverse();

  history.forEach(item => {
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

window.addEventListener('beforeunload', () => {
  try {
    history.replaceState(null, '', '/');
  } catch (e) {}
});