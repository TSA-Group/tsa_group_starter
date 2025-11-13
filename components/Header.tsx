"use client";

export default function Header() {
  const headerStyle: React.CSSProperties = {
    backgroundColor: "#000",
    borderBottom: "1px solid rgba(0,255,0,0.2)",
    width: "100%",
    boxSizing: "border-box",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "rgba(0, 255, 0, 1)",
    textDecoration: "none",
    transition: "transform 0.3s ease",
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    gap: "2rem",
  };

  const linkStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "transform 0.3s ease, color 0.3s ease",
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Gatherly Logo */}
        <a
          href="/"
          style={logoStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Gatherly
        </a>

        {/* Navigation Links */}
        <nav style={navStyle}>
          {["Home", "Resources", "Events", "Contact"].map((label) => (
            <a
              key={label}
              href={`/${label.toLowerCase()}`}
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.color = "rgba(0, 255, 0, 0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "#fff";
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
