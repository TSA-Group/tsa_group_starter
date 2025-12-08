  <!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Speech Demo</title>
    </head>
    <body>
      <script>
        function speak() {
          const phrase = "Welcome to the contact section, where you can contact some of our finest members of the community";
          const utter = new SpeechSynthesisUtterance(phrase);
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        }

        // Speak on page load
        window.onload = speak;
      </script>
    </body>
    </html>



