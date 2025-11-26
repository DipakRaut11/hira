type NewsDetailsProps = {
  news: any;
};

export default function NewsDetails({ news }: NewsDetailsProps) {
  if (!news) return <p className="text-center text-gray-500 py-10">Select a news to read</p>;

  return (
    <div className="p-4 border rounded-lg space-y-4">
      {news.imageUrls?.[0] && (
        <img src={news.imageUrls[0]} alt={news.title} className="w-full h-64 object-cover rounded" />
      )}
      <h2 className="text-2xl font-bold">{news.title}</h2>
      <p className="text-gray-600">{news.description}</p>
      {news.content && <div className="text-gray-700">{news.content}</div>}
    </div>
  );
}
