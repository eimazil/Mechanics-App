import { useContext } from "react";
import ThirdContext from "../../Contexts/ThirdContext";
import Line from "./Line";

function List() {
  const { specialisations } = useContext(ThirdContext);

  return (
    <div className="card m-4">
      <h5 className="card-header">Specialisations List</h5>
      <div className="card-body">
        <ul className="list-group">
          {specialisations?.map((s) => (
            <Line key={s.id} specialisation={s} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default List;
