import { useContext, useEffect, useState, useRef } from "react";
import SecondContext from "../../Contexts/SecondContext";
import getBase64 from "../../Functions/getBase64";
import DataContext from "../../Contexts/DataContext";

function Edit() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [specialisation, setSpecialisation] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [city, setCity] = useState("");
  const fileInput = useRef();
  const [photoPrint, setPhotoPrint] = useState(null);
  const [deletePhoto, setDeletePhoto] = useState(false);

  const doPhoto = () => {
    getBase64(fileInput.current.files[0])
      .then((photo) => setPhotoPrint(photo))
      .catch((_) => {
        // tylim
      });
  };

  const { setEditData, modalData, setModalData, specialisations } =
    useContext(SecondContext);
  const { makeMsg } = useContext(DataContext);

  const edit = () => {
    if (name.length === 0) {
      makeMsg("Add name", "error");
      return;
    }
    if (name.length > 20) {
      makeMsg("Name is too long", "error");
      return;
    }
    if (surname.length === 0) {
      makeMsg("Add surname", "error");
      return;
    }
    if (surname.length > 20) {
      makeMsg("Surname is too long", "error");
      return;
    }
    if (serviceName.length === 0) {
      makeMsg("Add surname", "error");
      return;
    }
    if (serviceName.length > 100) {
      makeMsg("Surname is too long", "error");
      return;
    }
    if (city.length === 0) {
      makeMsg("Add city", "error");
      return;
    }
    if (city.length > 100) {
      makeMsg("City name is too long", "error");
      return;
    }
    if (specialisation === 0) {
      makeMsg("Choose specialisation", "error");
      return;
    }

    setEditData({
      name,
      surname,
      specialisation_id: parseInt(specialisation),
      service_name: serviceName,
      city,
      id: modalData.id,
      deletePhoto: deletePhoto ? 1 : 0,
      image: photoPrint,
    });
    setModalData(null);
    setDeletePhoto(false);
  };

  useEffect(() => {
    if (null === modalData) {
      return;
    }
    setName(modalData.name);
    setSurname(modalData.surname);
    setSpecialisation(modalData.specialisation_id);
    setServiceName(modalData.service_name);
    setCity(modalData.city);
    setPhotoPrint(modalData.image);
    setDeletePhoto(false);
  }, [modalData]);

  if (null === modalData) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit municipality</h5>
            <button
              onClick={() => setModalData(null)}
              type="button"
              className="btn-close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Surname</label>
              <input
                type="text"
                className="form-control"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Choose specialisation</label>
              <select
                className="form-select"
                value={specialisation}
                onChange={(e) => setSpecialisation(e.target.value)}
              >
                <option value={0} disabled>
                  Choose from list
                </option>
                {specialisations?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Repair shop name</label>
              <input
                type="text"
                className="form-control"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Repair shop city</label>
              <input
                type="text"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mechanic's image</label>
              <input
                ref={fileInput}
                type="file"
                className="form-control"
                onChange={doPhoto}
              />
              {photoPrint ? (
                <div className="img-bin">
                  <label htmlFor="image-delete">X</label>
                  <input
                    id="image-delete"
                    type="checkbox"
                    checked={deletePhoto}
                    onChange={() => setDeletePhoto((d) => !d)}
                  ></input>
                  <img src={photoPrint} alt="upload"></img>
                </div>
              ) : null}
            </div>
            <button
              onClick={edit}
              type="button"
              className="btn btn-outline-success"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
