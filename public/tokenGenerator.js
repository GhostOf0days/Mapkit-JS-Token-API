document
  .getElementById('tokenForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const teamId = document.getElementById('teamId').value;
    const keyId = document.getElementById('keyId').value;
    const authKey = document.getElementById('authKey').value;
    let ttlValue = document.getElementById('ttl').value;
    const ttl = ttlValue ? parseInt(ttlValue) : undefined;
    const origin = document.getElementById('origin').value;

    fetch('/generate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamId, keyId, authKey, ttl, origin }),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById('result').style.display = 'block';
        document.getElementById('tokenBox').textContent = data.token;
        document.getElementById('messageBox').textContent = data.message;
      })
      .catch((error) => {
        document.getElementById('result').textContent =
          'Error generating token';
      });
  });

function copyToClipboard(elementId) {
  const text = document.querySelector(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard');
  });
}
