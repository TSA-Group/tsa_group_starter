<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Speak "contact" demo</title>
</head>
<body>
  <div id="log"></div>
  <button id="add">Add "contact" text</button>

  <script>
    // speak function
    function speak(text) {
      if (!('speechSynthesis' in window)) return console.warn('No speech support');
      const u = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel(); // stop any current speech (optional)
      window.speechSynthesis.speak(u);
    }

    // speak immediately on page load if word exists
    if (document.body.innerText.toLowerCase().includes('contact')) {
      speak('contact');
    }

    // Observe DOM for new nodes that include the word "contact"
    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.innerText && node.innerText.toLowerCase().includes('contact')) {
            speak('contact');
            return; // speak once per mutation batch
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Demo button to add "contact" text
    document.getElementById('add').addEventListener('click', () => {
      const el = document.createElement('p');
      el.textContent = 'Contact: you@example.com';
      document.getElementById('log').appendChild(el);
    });
  </script>
</body>
</html>


