"use client";

export default function Header() {
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#000",
    borderBottom: "1px solid rgba(0,255,0,0.2)",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "rgba(0, 255, 0, 0.8)",
    textDecoration: "none",
    transition: "transform 0.3s ease, color 0.3s ease",
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    gap: "2rem",
  };

  const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "color 0.3s ease",
  };

  return (
    <header style={headerStyle}>
      <a
        href="/"
        style={logoStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.color = "rgba(0, 255, 0, 1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.color = "rgba(0, 255, 0, 0.8)";
        }}
      >
        Gatherly
      </a>
      <nav style={navStyle}>
        <a href="/resources" style={linkStyle}>Resources</a>
        <a href="/events" style={linkStyle}>Events</a>
        <a href="/contact" style={linkStyle}>Contact</a>
      </nav>
    </header>
  );
}
