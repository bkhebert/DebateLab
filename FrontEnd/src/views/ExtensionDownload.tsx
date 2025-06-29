import React from "react";

export default function ExtensionDownloadPage() {
  return (
    <div className="min-h-screen w-full px-4 py-10 bg-cstmwhite text-cstmblack dark:bg-covenantDark dark:text-cstmneutral transition-colors">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-primary dark:text-cstmwhite text-center">
            DebateLab Chrome Extension
          </h1>
          <p className="mt-2 text-center text-lg text-cstmgray dark:text-cstmneutral">
            Enhance your critical thinking. Analyze arguments instantly.
          </p>
          <p className="mt-2 text-center text-lg text-cstmgray dark:text-cstmneutral">
            Current Limit: 5 Analysis per 24hrs
          </p>
        </header>

        <section className="mb-10 text-center">
          <a
            href="/DebateLabExtension.zip"
            download
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primarylight dark:hover:bg-cstmdarkaccent transition"
          >
            Download v1.0.0
          </a>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-primary dark:text-covenantAccent mb-4">
            How to Install the Extension
          </h2>
          <ol className="space-y-6">
            <li>
              <p className="font-medium">1. Unzip the extension file.</p>
              <img
                src="/step1.gif"
                alt="Step 1 screenshot"
                className="w-full rounded-md border border-cstmgray dark:border-cstmneutral"
              />
            </li>
            <li>
              <p className="font-medium">2. Go to <code>chrome://extensions</code> and enable Developer Mode.</p>
              <img
                src="/step2.png"
                alt="Step 2 screenshot"
                className="w-full rounded-md border border-cstmgray dark:border-cstmneutral"
              />
            </li>
            <li>
              <p className="font-medium">3. Click "Load unpacked" and select the unzipped folder.</p>
              <img
                src="/step3.gif"
                alt="Step 3 screenshot"
                className="w-full rounded-md border border-cstmgray dark:border-cstmneutral"
              />
            </li>
            <li>
              <p className="font-medium">
                4. Right-click highlighted text on any webpage and choose "Analyze with DebateLab"
              </p>
              <img
                src="/step4.gif"
                alt="Step 4 screenshot"
                className="w-full rounded-md border border-cstmgray dark:border-cstmneutral"
              />
            </li>
          </ol>
        </section>

        <footer className="text-center text-sm text-cstmgray dark:text-cstmneutral">
          &copy; {new Date().getFullYear()} DebateLab. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
