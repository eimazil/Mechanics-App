import { useState, useContext, useRef } from "react";
import DataContext from "../../Contexts/DataContext";
import SecondContext from "../../Contexts/SecondContext";
import getBase64 from "../../Functions/getBase64";
import cities from "../../data/cities";
import { validName } from "../../Functions/regex";

function Create() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [specialisation, setSpecialisation] = useState(0);
  const [serviceName, setServiceName] = useState("");
  const [city, setCity] = useState(0);
  const fileInput = useRef();

  const { setCreateData, specialisations } = useContext(SecondContext);
  const { makeMsg } = useContext(DataContext);

  const [photoPrint, setPhotoPrint] = useState(null);

  const doPhoto = () => {
    getBase64(fileInput.current.files[0])
      .then((photo) => setPhotoPrint(photo))
      .catch((_) => {
        // tylim
      });
  };

  const add = () => {
    if (name.length === 0) {
      makeMsg("Add name", "error");
      return;
    }
    if (name.length > 20) {
      makeMsg("Name is too long", "error");
      return;
    }
    if (!validName.test(name)) {
      makeMsg("Name is not vidal", "error");
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
    if (!validName.test(surname)) {
      makeMsg("Surname is not vidal", "error");
      return;
    }
    if (serviceName.length === 0) {
      makeMsg("Add repair shop name", "error");
      return;
    }
    if (serviceName.length > 100) {
      makeMsg("Repair shop name is too long", "error");
      return;
    }
    if (city === 0) {
      makeMsg("Choose city", "error");
      return;
    }
    if (specialisation === 0) {
      makeMsg("Choose specialisation", "error");
      return;
    }
    setCreateData({
      name,
      surname,
      specialisation_id: parseInt(specialisation),
      service_name: serviceName,
      city,
      image: photoPrint,
    });
    setName("");
    setSurname("");
    setSpecialisation(0);
    setServiceName("");
    setCity("");
    setPhotoPrint(null);
    fileInput.current.value = null;
  };

  return (
    <div className="card m-4">
      <h5 className="card-header">New Mechanic</h5>
      <div className="card-body">
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
          <select
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value={0} disabled>
              Choose from list
            </option>
            {cities?.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
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
              <img src={photoPrint} alt="upload"></img>
            </div>
          ) : null}
        </div>
        <button onClick={add} type="button" className="btn btn-outline-success">
          Add
        </button>
      </div>
    </div>
  );
}

export default Create;
