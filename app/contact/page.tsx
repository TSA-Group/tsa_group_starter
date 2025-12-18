<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact Us | Gatherly</title>
  <style>
    :root {
      --primary: #4f46e5; /* indigo */
      --primary-dark: #4338ca;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --radius: 14px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      color: var(--text);
      background: linear-gradient(180deg, #eef2ff 0%, var(--bg) 40%);
    }

    header {
      padding: 1.25rem 1rem;
      background: transparent;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1rem;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--primary);
    }

    main {
      padding: 2rem 0 3rem;
    }

    .grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 1.5rem;
    }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
    }

    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    }

    h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      letter-spacing: -0.02em;
    }

    p.lead {
      margin: 0 0 1.5rem;
      color: var(--muted);
    }

    form {
      display: grid;
      gap: 1rem;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 600px) {
      .row { grid-template-columns: 1fr; }
    }

    label {
      font-size: 0.85rem;
      color: var(--muted);
      margin-bottom: 0.25rem;
      display: block;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem 0.85rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      font-size: 0.95rem;
      outline: none;
    }

    input:focus, textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }

    textarea { min-height: 130px; resize: vertical; }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    button {
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 0.75rem 1.25rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
    }

    button:hover { background: var(--primary-dark); }

    .hint {
      font-size: 0.8rem;
      color: var(--muted);
    }

    .info h3 {
      margin-top: 0;
      margin-bottom: 0.75rem;
    }

    .info ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.75rem;
    }

    .info li {
      display: flex;
      gap: 0.6rem;
      align-items: flex-start;
      font-size: 0.95rem;
    }

    .badge {
      background: #eef2ff;
      color: var(--primary);
      border-radius: 999px;
      padding: 0.2rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    footer {
      border-top: 1px solid var(--border);
      background: #fff;
    }

    footer .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      flex-wrap: wrap;
    }

    footer small { color: var(--muted); }

    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <div class="brand">Gatherly</div>
    </div>
  </header>

  <main>
    <div class="container">
      <div class="grid">
        <!-- Contact Form -->
        <section class="card">
          <h1>Contact Gatherly</h1>
          <p class="lead">Have a question, feedback, or partnership idea? Send us a message and we’ll get back to you.</p>

          <form action="#" method="post">
            <div class="row">
              <div>
                <label for="firstName">First name</label>
                <input id="firstName" name="firstName" type="text" placeholder="Jane" required />
              </div>
              <div>
                <label for="lastName">Last name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Doe" required />
              </div>
            </div>

            <div class="row">
              <div>
                <label for="email">Email</label>
                <input id="email" name="email" type="email" placeholder="jane@gatherly.com" required />
              </div>
              <div>
                <label for="subject">Subject</label>
                <input id="subject" name="subject" type="text" placeholder="How can we help?" />
              </div>
            </div>

            <div>
              <label for="message">Message</label>
              <textarea id="message" name="message" placeholder="Write your message here..." required></textarea>
            </div>

            <div class="actions">
              <button type="submit">Send Message</button>
              <span class="hint">We usually reply within 1–2 business days.</span>
            </div>
          </form>
        </section>

        <!-- Contact Info -->
        <aside class="card info">
          <h3>Get in touch</h3>
          <ul>
            <li>
              <span class="badge">Email</span>
              <span>support@gatherly.com</span>
            </li>
            <li>
              <span class="badge">Business</span>
              <span>partners@gatherly.com</span>
            </li>
            <li>
              <span class="badge">Social</span>
              <span>
                <a href="#">Twitter</a> · <a href="#">Instagram</a> · <a href="#">LinkedIn</a>
              </span>
            </li>
            <li>
              <span class="badge">Location</span>
              <span>Remote-first • Serving communities worldwide</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <small>© 2025 Gatherly. All rights reserved.</small>
      <small><a href="#">Privacy</a> · <a href="#">Terms</a></small>
    </div>
  </footer>
</body>
</html>


