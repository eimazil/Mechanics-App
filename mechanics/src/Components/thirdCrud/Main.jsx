import { useState, useEffect } from "react";
import ThirdContext from "../../Contexts/ThirdContext";
import Create from "./Create";
import List from "./List";
import axios from "axios";
import Edit from "./Edit";
import { authConfig } from "../../Functions/auth";

function Main() {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [createData, setCreateData] = useState(null);
  const [specialisations, setSpecialisations] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [editData, setEditData] = useState(null);

  // READ for list
  useEffect(() => {
    axios
      .get("http://localhost:3003/specialisations", authConfig())
      .then((res) => {
        setSpecialisations(res.data);
      });
  }, [lastUpdate]);

  useEffect(() => {
    if (null === createData) {
      return;
    }
    axios
      .post(
        "http://localhost:3003/admin/specialisations",
        createData,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [createData]);

  useEffect(() => {
    if (null === deleteData) {
      return;
    }
    axios
      .delete(
        "http://localhost:3003/admin/specialisations/" + deleteData.id,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [deleteData]);

  useEffect(() => {
    if (null === editData) {
      return;
    }
    axios
      .put(
        "http://localhost:3003/admin/specialisations/" + editData.id,
        editData,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [editData]);

  return (
    <ThirdContext.Provider
      value={{
        setCreateData,
        specialisations,
        setDeleteData,
        modalData,
        setModalData,
        setEditData,
      }}
    >
      <div className="container">
        <div className="row">
          <div className=" col-lg-4">{<Create />}</div>
          <div className=" col-lg-8">{<List />}</div>
        </div>
      </div>
      <Edit />
    </ThirdContext.Provider>
  );
}
export default Main;
