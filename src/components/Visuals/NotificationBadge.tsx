interface NotificationBadgeProps {
  count: number;
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count === 0) return null;
  
  return (
    <span className="ml-2 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold border border-yellow-500/30">
      {count}
    </span>
  );
}