export default function Page() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/search?key=AIzaSyCvg7nk61C3TUhEQlPjbAqpyfJA9OVjC08&q=record+stores+in+Seattle"
      ></iframe>
    </div>
  );
}
