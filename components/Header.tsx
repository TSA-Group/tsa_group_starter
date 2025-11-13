"use client";

export default function Header() {
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#000",
    borderBottom: "1px solid rgba(0,255,0,0.2)",
    position: "relative",
    zIndex: 100,
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "rgba(0, 255, 0, 1)", // stays green
    textDecoration: "none",
    transition: "transform 0.3s ease",
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

  const handleZoom = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.transform = enter ? "scale(1.1)" : "scale(1)";
    e.currentTarget.style.color = enter ? "rgba(0, 255, 0, 0.9)" : "#fff";
  };

  const handleLogoZoom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "scale(1.1)";
  };

  return (
    <header style={headerStyle}>
      <a
        href="/"
        style={logoStyle}
        onMouseEnter={handleLogoZoom}
      >
        Gatherly
      </a>
      <nav style={navStyle}>
        {["Home", "Resources", "Events", "Contact"].map((label) => (
          <a
            key={label}
            href={`/${label.toLowerCase()}`}
            style={linkBaseStyle}
            onMouseEnter={(e) => handleZoom(e, true)}
            onMouseLeave={(e) => handleZoom(e, false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
