import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Detail() {
  const [loading, setLoading] = useState(true);
  const [certainMovie, setCertainMovie] = useState([]);
  const { id } = useParams();
  const getMovie = async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();
    setLoading(false);
    setCertainMovie(json.data.movie);
  };
  useEffect(() => {
    getMovie();
  }, []);
  return (
    <div>
      {loading ? (
        <h1>Please Wait, I'm working</h1>
      ) : (
        <div>
          <h1>This movie is {certainMovie.title}</h1>
          <p>The genres of this movie are {certainMovie.genres}</p>
          <img src={certainMovie.url} />
        </div>
      )}
    </div>
  );
}

export default Detail;
