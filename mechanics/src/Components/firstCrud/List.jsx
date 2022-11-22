import { useState, useEffect, useContext } from "react";
import FirstContext from "../../Contexts/FirstContext";
import cities from "../../data/cities";
import Line from "./Line";

function List() {
  const [cityFilter, setCityFilter] = useState(0);
  const [specialisationFilter, setSpecialisationFilter] = useState(0);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const { mechanics, setMechanics, specialisations } = useContext(FirstContext);

  const [stats, setStats] = useState({ clothesCount: null });

  console.log(mechanics);

  useEffect(() => {
    if (null === mechanics) {
      return;
    }
    setStats((s) => ({
      ...s,
      mechanicsCount: mechanics?.filter(
        (s) =>
          s.showCity === true &&
          s.showSpecialisation === true &&
          s.showName === true &&
          s.showSurname === true
      ).length,
    }));
  }, [mechanics]);

  useEffect(() => {
    if (cityFilter == 0) {
      setMechanics((m) =>
        m?.map((mechanic) => ({ ...mechanic, showCity: true }))
      );
    } else {
      setMechanics((m) =>
        m?.map((mechanic) =>
          mechanic.city == cityFilter
            ? { ...mechanic, showCity: true }
            : { ...mechanic, showCity: false }
        )
      );
    }
  }, [cityFilter, setMechanics]);

  useEffect(() => {
    if (specialisationFilter == 0) {
      setMechanics((m) =>
        m?.map((mechanic) => ({ ...mechanic, showSpecialisation: true }))
      );
    } else {
      setMechanics((m) =>
        m?.map((mechanic) =>
          mechanic.specialisation_id == specialisationFilter
            ? { ...mechanic, showSpecialisation: true }
            : { ...mechanic, showSpecialisation: false }
        )
      );
    }
  }, [specialisationFilter, setMechanics]);

  const search = () => {
    if (name.length === 0) {
      setMechanics((m) =>
        m?.map((mechanic) => ({ ...mechanic, showName: true }))
      );
    }

    if (name.length !== 0) {
      setMechanics((m) =>
        m?.map((mechanic) =>
          mechanic.name.toLocaleLowerCase() === name.toLocaleLowerCase()
            ? { ...mechanic, showName: true }
            : { ...mechanic, showName: false }
        )
      );
    }
    if (surname.length === 0) {
      setMechanics((m) =>
        m?.map((mechanic) => ({ ...mechanic, showSurname: true }))
      );
    }
    if (surname.length !== 0) {
      setMechanics((m) =>
        m?.map((mechanic) =>
          mechanic.surname.toLocaleLowerCase() === surname.toLocaleLowerCase()
            ? { ...mechanic, showSurname: true }
            : { ...mechanic, showSurname: false }
        )
      );
    }
    setName("");
    setSurname("");
  };

  const clear = () => {
    setMechanics((m) =>
      m?.map((mechanic) => ({ ...mechanic, showName: true, showSurname: true }))
    );
  };

  return (
    <>
      <div className="card m-4">
        <h5 className="card-header">Mechanics ({stats.mechanicsCount})</h5>
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row gap-2">
            <div className="d-flex flex-column flex-md-row gap-2">
              <div>
                <label className="form-label">Filter by Specialisation</label>
                <select
                  className="form-select"
                  value={specialisationFilter}
                  onChange={(e) =>
                    setSpecialisationFilter(Number(e.target.value))
                  }
                >
                  <option value={0}>Show all</option>
                  {specialisations?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Filter by City</label>
                <select
                  className="form-select"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value={0}>Show all</option>
                  {cities?.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="form-label">Surname</label>
              <input
                type="text"
                className="form-control"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
              <div className="d-flex gap-2 mt-2">
                <button
                  onClick={search}
                  type="button"
                  className="btn btn-outline-success"
                >
                  Search
                </button>
                <button
                  onClick={clear}
                  type="button"
                  className="btn btn-outline-warning"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {mechanics?.map((m) =>
                m.showCity === true &&
                m.showSpecialisation === true &&
                m.showName === true &&
                m.showSurname === true ? (
                  <Line key={m.id} mechanic={m} />
                ) : null
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default List;
