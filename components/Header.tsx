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

  const linkBaseStyle: React.CSSProperties = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    transition: "transform 0.3s ease, color 0.3s ease",
  };

  // Helper to apply hover effects
  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.transform = enter ? "scale(1.1)" : "scale(1)";
    e.currentTarget.style.color = enter ? "rgba(0, 255, 0, 0.9)" : "#fff";
  };

  return (
    <header style={headerStyle}>
      <a
        href="/"
        style={logoStyle}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        Gatherly
      </a>
      <nav style={navStyle}>
        {["Home", "Resources", "Events", "Contact"].map((label) => (
          <a
            key={label}
            href={`/${label.toLowerCase()}`}
            style={linkBaseStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
