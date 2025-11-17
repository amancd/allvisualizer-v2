"use client";

import { useEffect } from 'react';

interface GiscusCommentsProps {
  repo: string; // e.g., "amancd/allvisualizer-v2"
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: 'top' | 'bottom';
  theme?: string;
  lang?: string;
}

export default function GiscusComments({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = 'bottom',
  theme = 'light',
  lang = 'en'
}: GiscusCommentsProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', emitMetadata ? '1' : '0');
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', lang);
    script.crossOrigin = 'anonymous';
    script.async = true;

    const commentsDiv = document.getElementById('giscus-comments');
    if (commentsDiv) {
      commentsDiv.appendChild(script);
    }

    return () => {
      const commentsDiv = document.getElementById('giscus-comments');
      if (commentsDiv) {
        commentsDiv.innerHTML = '';
      }
    };
  }, [repo, repoId, category, categoryId, mapping, reactionsEnabled, emitMetadata, inputPosition, theme, lang]);

  return (
    <div className="giscus-wrapper">
      <div id="giscus-comments" className="giscus"></div>
    </div>
  );
}
