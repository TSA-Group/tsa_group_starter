import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/tan-buster"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen min-w-screen flex flex-col bg-white font-sans">
        {/* Header with Gatherly */}
        <header className="w-full flex items-start p-8 bg-green-50">
          <h1
            className="text-green-800 text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              fontFamily: "'Tan Buster', sans-serif",
            }}
          >
            Gatherly
          </h1>
        </header>

        {/* Main fills remainder with padding and green text */}
        <main className="flex-grow w-full p-8 text-green-900 flex flex-col items-start">
          <h2 className="text-5xl font-semibold leading-snug tracking-tight mb-6">
            Your Personal Geolocation Data Assembler
          </h2>
          <p className="text-lg leading-relaxed max-w-4xl mb-8">
            Gatherly helps you find, organize, and visualize nearby locations
            with precision. Explore local data, discover insights, and connect
            your maps like never before.
          </p>

          <a
            href="/maps"
            className="inline-block rounded-full bg-green-600 px-8 py-3 text-white font-medium shadow-md transition-colors hover:bg-green-700 mb-6"
          >
            🌍 Launch Maps
          </a>

          <div className="flex gap-4">
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-600 px-6 py-3 text-white font-medium shadow-md transition-colors hover:bg-green-700"
            >
              Deploy Now
            </a>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-green-600 px-6 py-3 font-medium text-green-700 transition-colors hover:bg-green-100"
            >
              Documentation
            </a>
          </div>
        </main>

        {/* Footer aligned bottom with muted text */}
        <footer className="w-full p-4 text-center text-sm text-green-800 bg-green-50">
          © {new Date().getFullYear()} Gatherly. All rights reserved.
        </footer>
      </div>
    </>
  );
}

