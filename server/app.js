const express = require("express");
const app = express();
const port = 3003;
app.use(express.json({ limit: "10mb" }));
const cors = require("cors");
app.use(cors());
const md5 = require("js-md5");
const uuid = require("uuid");
const mysql = require("mysql");
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mechanics_database",
});

////////////////////LOGIN/////////////////

const doAuth = function (req, res, next) {
  if (0 === req.url.indexOf("/server")) {
    // admin
    const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
    con.query(sql, [req.headers["authorization"] || ""], (err, results) => {
      if (err) throw err;
      if (!results.length || results[0].role !== 10) {
        res.status(401).send({});
        req.connection.destroy();
      } else {
        next();
      }
    });
  } else if (
    0 === req.url.indexOf("/login-check") ||
    0 === req.url.indexOf("/login") ||
    0 === req.url.indexOf("/register")
  ) {
    next();
  } else {
    // fron
    const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
    con.query(sql, [req.headers["authorization"] || ""], (err, results) => {
      if (err) throw err;
      if (!results.length) {
        res.status(401).send({});
        req.connection.destroy();
      } else {
        next();
      }
    });
  }
};

app.use(doAuth);

// AUTH
app.get("/login-check", (req, res) => {
  const sql = `
         SELECT
         name, role
         FROM users
         WHERE session = ?
        `;
  con.query(sql, [req.headers["authorization"] || ""], (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.send({ msg: "error", status: 1 }); // user not logged
    } else {
      if ("admin" === req.query.role) {
        if (result[0].role !== 10) {
          res.send({ msg: "error", status: 2 }); // not an admin
        } else {
          res.send({ msg: "ok", status: 3 }); // is admin
        }
      } else {
        res.send({ msg: "ok", status: 4 }); // is user
      }
    }
  });
});

app.post("/login", (req, res) => {
  const key = uuid.v4();
  const sql = `
    UPDATE users
    SET session = ?
    WHERE name = ? AND psw = ?
  `;
  con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
    if (err) throw err;
    if (!result.affectedRows) {
      res.send({ msg: "error", key: "" });
    } else {
      res.send({ msg: "ok", key });
    }
  });
});

app.get("/login/:session", (req, res) => {
  const sql = `
         SELECT id
         FROM users
         WHERE session = ?
    `;
  con.query(sql, [req.params.session], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/register", (req, res) => {
  const sql = `
    INSERT INTO users (name, psw)
    VALUES (?, ?)
  `;
  con.query(sql, [req.body.name, md5(req.body.pass)], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

///////////////////END////////////////////

// Municipalities CRUD
// CREATE
app.post("/admin/mechanics", (req, res) => {
  const sql = `
    INSERT INTO mechanics (name, surname, specialisation_id, service_name, city, image)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
  con.query(
    sql,
    [
      req.body.name,
      req.body.surname,
      req.body.specialisation_id,
      req.body.service_name,
      req.body.city,
      req.body.image,
    ],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});
// READ

app.get("/mechanics", (req, res) => {
  const sql = `
    SELECT m.*, s.title as specialisation_title 
    FROM mechanics AS m
    INNER JOIN specialisations AS s
    ON m.specialisation_id = s.id
    ORDER BY m.id
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// EDIT
app.put("/admin/mechanics/:id", (req, res) => {
  let sql;
  let r;
  if (req.body.deletePhoto) {
    sql = `
        UPDATE mechanics
        SET name = ?, surname = ?, specialisation_id = ?, service_name = ?, city = ?, image = null
        WHERE id = ?
        `;
    r = [
      req.body.name,
      req.body.surname,
      req.body.specialisation_id,
      req.body.service_name,
      req.body.city,
      req.params.id,
    ];
  } else if (req.body.image) {
    sql = `
        UPDATE mechanics
        SET name = ?, surname = ?, specialisation_id = ?, service_name = ?, city = ?, image = ?
        WHERE id = ?
        `;
    r = [
      req.body.name,
      req.body.surname,
      req.body.specialisation_id,
      req.body.service_name,
      req.body.city,
      req.body.image,
      req.params.id,
    ];
  } else {
    sql = `
        UPDATE mechanics
        SET name = ?, surname = ?, specialisation_id = ?, service_name = ?, city = ?
        WHERE id = ?
        `;
    r = [
      req.body.name,
      req.body.surname,
      req.body.specialisation_id,
      req.body.service_name,
      req.body.city,
      req.params.id,
    ];
  }
  con.query(sql, r, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete
app.delete("/admin/mechanics/:id", (req, res) => {
  const sql = `
    DELETE FROM mechanics
    WHERE id = ?
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Scopes CRUD
// CREATE
app.post("/admin/specialisations", (req, res) => {
  const sql = `
    INSERT INTO specialisations (title)
    VALUES (?)
    `;
  con.query(sql, [req.body.title, req.body.image], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
// READ

app.get("/specialisations", (req, res) => {
  const sql = `
    SELECT *
    FROM specialisations
    ORDER BY id DESC
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// EDIT
app.put("/admin/specialisations/:id", (req, res) => {
  const sql = `
    UPDATE specialisations
    SET title = ?
    WHERE id = ?
    `;
  con.query(sql, [req.body.title, req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete
app.delete("/admin/specialisations/:id", (req, res) => {
  const sql = `
    DELETE FROM specialisations
    WHERE id = ?
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Home

app.get("/mechanics", (req, res) => {
  const sql = `
    SELECT m.*, s.title as specialisation_title 
    FROM mechanics AS m
    INNER JOIN specialisations AS s
    ON m.specialisation_id = s.id
    ORDER BY m.id
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put("/home/mechanics/:id", (req, res) => {
  const sql = `
    UPDATE mechanics
    SET current_balance = current_balance + 1
    WHERE id = ?
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/home/likes", (req, res) => {
  const sql = `
    INSERT INTO likes (user_id, mechanic_id)
    VALUES (?, ?)
    `;
  con.query(sql, [req.body.user_id, req.body.mechanic_id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/home/likes/:id", (req, res) => {
  const sql = `
    SELECT *
    FROM likes
    WHERE user_id = ?
    ORDER BY id DESC
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.all("*", (req, res) => {
  res.status(404).send();
});

app.listen(port, () => {
  console.log(` ${port} port!`);
});
