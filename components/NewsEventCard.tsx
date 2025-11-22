export default function NewsCard({ news }: { news: any }) {
  return (
    <div className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer transition transform hover:scale-[1.03]">
      {news.imageUrls && news.imageUrls[0] && (
        <img src={news.imageUrls[0]} alt={news.title} className="w-full h-64 object-cover transition group-hover:brightness-75" />
      )}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
        <h3 className="text-white text-xl font-semibold tracking-wide">{news.title}</h3>
      </div>
    </div>
  );
}
