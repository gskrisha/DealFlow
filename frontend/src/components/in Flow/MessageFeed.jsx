// frontend/src/components/in Flow/MessageFeed.jsx
import { MessageCard } from "./MessageCard";
import { mockMessages } from "./data/mockData";

export function MessageFeed({ source, sector, sortBy }) {
  // Filter messages
  let filtered = mockMessages.filter(msg => {
    const sourceMatch = source === "all" || msg.source === source;
    const sectorMatch = sector === "all" || msg.sector === sector;
    return sourceMatch && sectorMatch;
  });

  // Sort messages
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "ai-priority":
        return b.aiScore - a.aiScore;
      case "recent":
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case "funding":
        return (b.fundingAmount || 0) - (a.fundingAmount || 0);
      case "sector":
        return a.sector.localeCompare(b.sector);
      default:
        return 0;
    }
  });

  return (
    <div className="divide-y divide-slate-200">
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <p>No messages found matching your filters</p>
        </div>
      ) : (
        filtered.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))
      )}
    </div>
  );
}