import React from 'react';

export function LegalDisclaimer() {
  return (
    <footer className="mt-8 py-4 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <h4 className="font-semibold mb-2">Legal Disclaimer</h4>
          <p className="mb-1">
            This website only embeds content from Vidsrc.net and does not host, own, or control any videos.
          </p>
          <p className="mb-1">
            The web player is operated by a third-party source. All content is provided by external platforms.
          </p>
          <p className="mb-1">
            We do not control, endorse, or take responsibility for any content, ads, or anything else provided by Vidsrc.net.
          </p>
          <p>
            © {new Date().getFullYear()} Movie Streaming App. This service is provided for educational and personal use only.
          </p>
        </div>
      </div>
    </footer>
  );
}