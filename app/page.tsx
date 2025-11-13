import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/tan-buster"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen min-w-screen flex flex-col bg-black font-sans">
        {/* Header with Gatherly and Nav */}
        <header className="w-full flex items-center justify-between px-8 py-6 bg-black border-b border-green-900">
          {/* Logo / Brand */}
          <Link href="/" className="text-4xl font-extrabold tracking-tight text-green-400" style={{fontFamily: '"Tan Buster", sans-serif'}}>
            Gatherly
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-8 text-lg font-medium">
              <li>
                <Link href="/" className="hover:text-green-400 transition-colors text-green-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-green-400 transition-colors text-green-200">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-green-400 transition-colors text-green-200">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400 transition-colors text-green-200">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full p-8 text-green-200 flex flex-col items-start bg-black">
          <h2 className="text-5xl font-semibold leading-snug tracking-tight mb-6 text-green-400" style={{fontFamily:'Momo Signature, sans-serif'}}>
            Your Personal Geolocation Data Assembler
          </h2>
          <p className="text-lg leading-relaxed max-w-4xl mb-8 text-green-200">
            Gatherly helps you find, organize, and visualize nearby locations with precision.
            Explore local data, discover insights, and connect your maps like never before.
          </p>
          <Link href="/map" className="inline-block rounded-full bg-green-600 px-8 py-3 text-white font-medium shadow-md transition-colors hover:bg-green-700 mb-6">
            Launch Maps
          </Link>
        </main>

        {/* Footer aligned bottom with muted text */}
        <footer className="w-full p-4 text-center text-sm text-green-800 bg-black border-t border-green-900">
          © {year} Gatherly. All rights reserved.
        </footer>
      </div>
    </>
  );
}

