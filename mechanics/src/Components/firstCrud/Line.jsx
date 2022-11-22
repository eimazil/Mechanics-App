import { useContext } from "react";
import FirstContext from "../../Contexts/FirstContext";

function Line({ mechanic }) {
  const { setLikeData, currentLikes } = useContext(FirstContext);

  console.log(currentLikes);

  let liked = false;

  currentLikes?.map((like) =>
    like.mechanic_id === mechanic.id ? (liked = true) : null
  );

  const add = () => {
    setLikeData({
      mechanic_id: mechanic.id,
      user_id: Number(localStorage.getItem("id")),
    });
  };

  return (
    <li className="list-group-item">
      <div className="home">
        <div className="home__content d-flex flex-row justify-content-between flex-wrap">
          <div className="col-12 col-sm-8 col-md-3">
            <h4>{mechanic.title}</h4>
            {mechanic.image ? (
              <img
                className="col-12 col-sm-12 col-lg-12"
                src={mechanic.image}
                alt={`${mechanic.title} crest`}
              ></img>
            ) : (
              <span className="red-image">No image</span>
            )}
          </div>
          <div className="d-flex flex-column">
            <span>
              {mechanic.name} {mechanic.surname}
            </span>
            <span>Area of expertise: {mechanic.specialisation_title}</span>
            <span>Repair shop: {mechanic.service_name}</span>
            <span>City: {mechanic.city}</span>
          </div>
          <div className="d-flex flex-column align-items-center">
            {liked === false ? (
              <span>Press a like button!</span>
            ) : (
              <span>Thank you for your vote!</span>
            )}
            {liked === false ? (
              <svg onClick={add} className="image-heart">
                <use xlinkHref="#svg-heart"></use>
              </svg>
            ) : (
              <svg style={{ fill: "red" }} className="image-heart">
                <use xlinkHref="#svg-heart"></use>
              </svg>
            )}
            <span>
              {mechanic.current_balance === 0
                ? "No likes"
                : mechanic.current_balance}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Line;
