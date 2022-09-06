const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const date = require("date-fns");
const format = require("date-fns/format");
var isValid = require("date-fns/isValid");

const app = express();
const dbPath = path.join(__dirname, "todoApplication.db");
app.use(express.json());
let db = null;

const initializeServerAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
  } catch (e) {
    console.log(`Db error ${e.message}`);
  }
};

initializeServerAndDb();

const hasValidStatus = (requestQuery) => {
  let statusArray = ["TO DO", "IN PROGRESS", "DONE"];

  let isValidStatus = statusArray.includes(requestQuery.status);
  return isValidStatus;
};

const hasValidCategory = (requestQuery) => {
  let categoryArray = ["WORK", "HOME", "LEARNING"];
  let isValidCategory = categoryArray.includes(requestQuery.category);
  return isValidCategory;
};

const hasValidPriority = (requestQuery) => {
  let priorityArray = ["HIGH", "LOW", "MEDIUM"];
  let isValidPriority =
    requestQuery.priority !== undefined &&
    priorityArray.includes(requestQuery.priority);
  return isValidPriority;
};

const hasValidDate = (requestQuery) => {
  let givenDate = requestQuery.date;
  let formattedDate = format(new Date(givenDate), "yyyy-MM-dd");
  let isDateValid = isValid(new Date(formattedDate));
  return isDateValid;
};

const hasValidQueryParameters = (request, response, next) => {
  const { status, priority, category, date } = request.query;
  if (hasValidStatus(request.query) === false) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (hasValidCategory === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (hasValidPriority) {
    response.status(400);
    response.send("Invalid Todo priority");
  } else {
    next();
  }
};

app.get("/todos/", hasValidQueryParameters, async (request, response) => {
  const { status } = request.query;
  const getTodoQuery = `
    SELECT
    *
    FROM
    todo
    WHERE
    category = '${category}';`;
  const data = await db.all(getTodoQuery);
  response.send(data);
});
