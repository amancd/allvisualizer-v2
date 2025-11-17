'use client';

import { useEffect } from 'react';

interface DisqusCommentsProps {
  identifier: string;
  title: string;
  url?: string;
}

export default function DisqusComments({ identifier, title, url }: DisqusCommentsProps) {
  useEffect(() => {
    // Load Disqus script
    const script = document.createElement('script');
    script.src = 'https://allvisualizer.disqus.com/embed.js';
    script.setAttribute('data-timestamp', String(+new Date()));
    (document.head || document.body).appendChild(script);

    // Configure Disqus
    (window as any).disqus_config = function () {
      this.page.url = url || window.location.href;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    return () => {
      // Cleanup
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) {
        disqusThread.innerHTML = '';
      }
    };
  }, [identifier, title, url]);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Discussion</h3>
      <div id="disqus_thread"></div>
      <noscript>
        <p className="text-gray-600">
          Please enable JavaScript to view the comments.
        </p>
      </noscript>
    </div>
  );
}
