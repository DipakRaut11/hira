"use client";

type NewsCardProps = {
  news: any;
  onSelect: (news: any) => void;
};

export default function NewsCard({ news, onSelect }: NewsCardProps) {
  return (
    <div
      className="flex flex-col cursor-pointer p-3 border rounded-lg hover:bg-gray-100 transition"
      onClick={() => onSelect(news)}
    >
      {news.imageUrls?.[0] && (
        <img
          src={news.imageUrls[0]}
          alt={news.title}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}

      <h3 className="font-semibold text-sm mb-1">{news.title}</h3>

      <p className="text-gray-500 text-xs line-clamp-2 mb-1">
        {news.description}
      </p>

      {/* Optional "Read more" indicator */}
      <span className="text-blue-600 text-xs font-medium self-end">Read more →</span>
    </div>
  );
}
