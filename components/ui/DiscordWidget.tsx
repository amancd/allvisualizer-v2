'use client';

interface DiscordWidgetProps {
  serverId?: string;
  theme?: 'dark' | 'light';
}

export default function DiscordWidget({ serverId = 'YOUR_SERVER_ID', theme = 'dark' }: DiscordWidgetProps) {
  return (
    <div className="w-full">
      <iframe
        src={`https://discord.com/widget?id=${serverId}&theme=${theme}`}
        width="100%"
        height="500"
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}
