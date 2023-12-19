import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';
const app = express();
const port = 3000;
const db=new pg.Client(
  {
    user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Guru@2003",
  port: 5433,
  }
);
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const t=await db.query("select * from items order by id");
let items = t.rows;

app.get("/", (req, res) => {
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  db.query("insert into items(title) values($1)",[req.body.newItem]);
  const t=await db.query("select * from items order by id");
  items = t.rows;
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  console.log(req.body);
  db.query("update items set title=$1 where id=$2",[req.body.updatedItemTitle,parseInt(req.body.updatedItemId)]);
  const t=await db.query("select * from items order by id");
  items = t.rows;
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  db.query("delete from items where id=$1",[req.body.deleteItemId]);
  const t=await db.query("select * from items order by id");
  items = t.rows;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
