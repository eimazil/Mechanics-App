import { useContext } from "react";
import SecondContext from "../../Contexts/SecondContext";

function Line({ mechanic }) {
  const { setDeleteData, setModalData } = useContext(SecondContext);

  return (
    <li className="list-group-item">
      <div className="line">
        <div className="line__content">
          <div className="line__content__info">
            {mechanic.image ? (
              <div className="img-bin">
                <img src={mechanic.image} alt={mechanic.name}></img>
              </div>
            ) : (
              <span className="red-image">No image</span>
            )}
          </div>
          <div className="d-flex flex-column gap-2">
            <h5>{mechanic.name}</h5>
            <h5>{mechanic.surname}</h5>
            <span>Specialisation: {mechanic.specialisation_title}</span>
            <span>Repair shop: {mechanic.service_name}</span>
            <span>City: {mechanic.city}</span>
          </div>
        </div>
        <div className="line__buttons">
          <button
            onClick={() => setModalData(mechanic)}
            type="button"
            className="btn btn-outline-success"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteData(mechanic)}
            type="button"
            className="btn btn-outline-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default Line;
