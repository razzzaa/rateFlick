export default function TrailerModal({ movieTrailer, active, onClose }) {
  const youtubeSrc = `https://www.youtube.com/embed/${movieTrailer}`;

  return (
    <>
      <div className="trailerContainer"> </div>

      <div className="trailerBox">
        <button className="trailerCloseBtn" onClick={onClose}>
          ❌
        </button>
        {movieTrailer ? (
          <iframe
            width="100%"
            height="315"
            src={youtubeSrc}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen="1"
          ></iframe>
        ) : (
          <div className="ErrDiv">
            <p className="Err">No trailer Was Found...</p>
          </div>
        )}
      </div>
    </>
  );
}
