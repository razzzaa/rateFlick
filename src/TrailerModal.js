export default function TrailerModal({ movieTrailer }) {
  const youtubeSrc = `https://www.youtube.com/embed/${movieTrailer}`;

  return (
    <div className="trailerContainer">
      <div className="trailerBox">
        {movieTrailer ? (
          <iframe
            width="100%"
            height="215"
            src={youtubeSrc}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen="1"
          ></iframe>
        ) : (
          <p>No trailer Was Found...</p>
        )}
      </div>
    </div>
  );
}
