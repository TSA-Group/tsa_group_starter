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
            <h1 className={styles.heading}>Contact Gatherly</h1>
            <p className={styles.lead}>
              Have a question, feedback, or partnership idea? Send us a message and we’ll get back to you.
            </p>

            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>First name</label>
                  <input className={styles.input} type="text" placeholder="Jane" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Last name</label>
                  <input className={styles.input} type="text" placeholder="Doe" required />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input className={styles.input} type="email" placeholder="jane@gatherly.com" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Subject</label>
                  <input className={styles.input} type="text" placeholder="How can we help?" />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Message</label>
                <textarea className={styles.textarea} placeholder="Write your message here..." required />
              </div>

              <div className={styles.actions}>
                <button className={styles.button} type="submit">Send Message</button>
                <span className={styles.hint}>We usually reply within 1–2 business days.</span>
              </div>
            </form>
          </section>

          {/* Contact Info */}
          <aside className={`${styles.card} ${styles.info}`}>
            <h3 className={styles.heading}>Get in touch</h3>
            <ul className={styles.infoList}>
              <li>
                <span className={styles.badge}>Email</span> support@gatherly.com
              </li>
              <li>
                <span className={styles.badge}>Business</span> partners@gatherly.com
              </li>
              <li>
                <span className={styles.badge}>Social</span>
                <span>
                  <a className={styles.link} href="#">Twitter</a> ·
                  <a className={styles.link} href="#">Instagram</a> ·
                  <a className={styles.link} href="#">LinkedIn</a>
                </span>
              </li>
              <li>
                <span className={styles.badge}>Location</span> Remote-first • Serving communities worldwide
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
