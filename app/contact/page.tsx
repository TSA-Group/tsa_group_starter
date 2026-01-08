"use client";

import styles from "./contact.module.css";

export const metadata = {
  title: "Contact Us | Gatherly",
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Contact Form */}
          <section className={styles.card}>
            <h1>Contact Gatherly</h1>
            <p className={styles.lead}>
              Have a question, feedback, or partnership idea? Send us a message and
              we’ll get back to you.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className={styles.form}
            >
              <div className={styles.row}>
                <div>
                  <label>First name</label>
                  <input type="text" placeholder="Jane" required />
                </div>
                <div>
                  <label>Last name</label>
                  <input type="text" placeholder="Doe" required />
                </div>
              </div>

              <div className={styles.row}>
                <div>
                  <label>Email</label>
                  <input type="email" placeholder="jane@gatherly.com" required />
                </div>
                <div>
                  <label>Subject</label>
                  <input type="text" placeholder="How can we help?" />
                </div>
              </div>

              <div>
                <label>Message</label>
                <textarea
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <div className={styles.actions}>
                <button type="submit">Send Message</button>
                <span className={styles.hint}>
                  We usually reply within 1–2 business days.
                </span>
              </div>
            </form>
          </section>

          {/* Info */}
          <aside className={`${styles.card} ${styles.info}`}>
            <h3>Get in touch</h3>
            <ul>
              <li>
                <span className={styles.badge}>Email</span>
                support@gatherly.com
              </li>
              <li>
                <span className={styles.badge}>Business</span>
                partners@gatherly.com
              </li>
              <li>
                <span className={styles.badge}>Social</span>
                <span>
                  <a href="#">Twitter</a> · <a href="#">Instagram</a> ·{" "}
                  <a href="#">LinkedIn</a>
                </span>
              </li>
              <li>
                <span className={styles.badge}>Location</span>
                Remote-first • Serving communities worldwide
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
