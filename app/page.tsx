import Head from "next/head"; // For font link if loading from CDN

export default function Home() {
  return (
    <>
      {/* 
        If using a custom font from CDN, 
        place this in your _app.js or here (for demo only):
      */}
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/tan-buster"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen min-w-screen flex flex-col bg-green-50 font-sans dark:bg-black">
        {/* Header with Gatherly */}
        <header className="w-full flex items-start p-8">
          <h1
            className="text-green-800 dark:text-green-400 text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              fontFamily: "'Tan Buster', sans-serif",
            }}
          >
            Gatherly
          </h1>
        </header>
        {/* Main content fills available space */}
        <main className="flex flex-col flex-1 items-center justify-center w-full max-w-4xl mx-auto py-12 px-4 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg">
          {/* Hero Section */}
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-green-900 dark:text-green-200">
              Your Personal Geolocation Data Assembler
            </h2>
            <p className="max-w-md text-lg leading-8 text-zinc-700 dark:text-zinc-400">
              Gatherly helps you find, organize, and visualize nearby locations
              with precision. Explore local data, discover insights, and connect
              your maps like never before.
            </p>
            <a
              href="/maps"
              className="inline-block rounded-full bg-green-600 px-6 py-3 text-white font-medium shadow-md transition-colors hover:bg-green-700"
            >
              🌍 Launch Maps
            </a>
          </div>
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col gap-4 pt-8 sm:flex-row">
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 text-white font-medium shadow-md transition-colors hover:bg-green-700 md:w-[158px]"
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Deploy Now
            </a>
            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-green-600 text-green-700 font-medium px-5 transition-colors hover:bg-green-100 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-950 md:w-[158px]"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </div>
          {/* Footer */}
          <footer className="pt-12 text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Gatherly. All rights reserved.
          </footer>
        </main>
      </div>
    </>
  );
}

