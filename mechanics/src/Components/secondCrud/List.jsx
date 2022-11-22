import { useContext } from "react";
import SecondContext from "../../Contexts/SecondContext";
import Line from "./Line";

function List() {
  const { mechanics } = useContext(SecondContext);

  return (
    <div className="card m-4">
      <h5 className="card-header">Mechanics List</h5>
      <div className="card-body">
        <ul className="list-group">
          {mechanics?.map((m) => (
            <Line key={m.id} mechanic={m} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default List;
