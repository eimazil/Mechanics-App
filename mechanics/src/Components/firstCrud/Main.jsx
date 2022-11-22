import FirstContext from "../../Contexts/FirstContext";
import List from "./List";
import { useState, useEffect } from "react";
import axios from "axios";
import { authConfig } from "../../Functions/auth";

function Main() {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [mechanics, setMechanics] = useState(null);
  const [specialisations, setSpecialisations] = useState(null);
  const [likeData, setLikeData] = useState(null);
  const [currentLikes, setCurrentLikes] = useState(null);

  console.log(likeData);

  // READ for list
  useEffect(() => {
    axios
      .get("http://localhost:3003/specialisations", authConfig())
      .then((res) => {
        setSpecialisations(res.data);
      });
  }, [lastUpdate]);

  // Mechanics GET

  useEffect(() => {
    axios.get("http://localhost:3003/mechanics", authConfig()).then((res) => {
      setMechanics(
        res.data.map((b) => ({
          ...b,
          showSpecialisation: true,
          showCity: true,
          showName: true,
          showSurname: true,
        }))
      );
    });
  }, [lastUpdate]);

  // Likes to update the numbers fields of how many likes

  useEffect(() => {
    if (null === likeData) {
      return;
    }
    axios
      .put(
        "http://localhost:3003/home/mechanics/" + likeData.mechanic_id,
        authConfig()
      )
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [likeData]);

  // Posting new likes

  useEffect(() => {
    if (null === likeData) {
      return;
    }
    axios
      .post("http://localhost:3003/home/likes", likeData, authConfig())
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [likeData]);

  // Getting likes to check for unique likes

  useEffect(() => {
    axios
      .get(
        "http://localhost:3003/home/likes/" + localStorage.getItem("id"),
        authConfig()
      )
      .then((res) => {
        setCurrentLikes(res.data);
      });
  }, [lastUpdate]);

  return (
    <FirstContext.Provider
      value={{
        mechanics,
        setLikeData,
        currentLikes,
        specialisations,
        setMechanics,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <List />
          </div>
        </div>
      </div>
    </FirstContext.Provider>
  );
}

export default Main;
