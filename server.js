import express from "express";
import {
  iFUniq,
  readFileToJson,
  writeFileToJson,
  ifExists,
  validBody,
  getNumTicket,
  eventSub,
} from "./utils.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "server works" });
});

app.get("/users", async (req, res) => {
  const file = await readFileToJson("./data/users.json");
  res.send(file);
});

app.post("/user/register", async (req, res) => {
  const file = await readFileToJson("./data/users.json");
  const isUniq = await iFUniq(file.users, req.body.username, "username");
  if (
    isUniq &&
    Object.keys(req.body)[0] === "username" &&
    Object.keys(req.body)[1] === "password" &&
    Object.keys(req.body).length === 2
  ) {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
    };
    file.users.push(newUser);
    const addToFile = await writeFileToJson(file, "./data/users.json");
    res.send({ message: `User ${addToFile}` });
  } else {
    res.send("wrong - username exist");
  }
});

app.post("/creator/events", async (req, res) => {
  const users = await readFileToJson("./data/users.json");
  const isExists = await ifExists(users.users, "username", req.body.username);
  if (isExists) {
    const isCorrectPassword = await ifExists(
      users.users,
      "password",
      req.body.password
    );
    if (isCorrectPassword) {
      const isValidBody = await validBody(
        ["eventName", "ticketsForSale", "username", "password"],
        req.body
      );
      if (isValidBody) {
        const newEvent = {
          eventName: req.body.eventName.toLowerCase(),
          ticketsForSale: req.body.ticketsForSale,
          createdBy: req.body.username,
        };
        const file = await readFileToJson("./data/events.json");
        file.events.push(newEvent);
        await writeFileToJson(file, "./data/events.json");
        res.send({ message: `Event created successfully` });
      } else {
        res.send("wrong body");
      }
    } else {
      res.send("wrong password");
    }
  } else {
    res.send(`user "${req.body.username}" not exists`);
  }
});

app.post("/users/tickets/buy", async (req, res) => {
  const users = await readFileToJson("./data/users.json");
  const isExists = await ifExists(users.users, "username", req.body.username);
  if (isExists) {
    const isCorrectPassword = await ifExists(
      users.users,
      "password",
      req.body.password
    );
    if (isCorrectPassword) {
      const isValidBody = await validBody(
        ["username", "password", "eventName", "quantity"],
        req.body
      );
      if (isValidBody) {
        const events = await readFileToJson("./data/events.json");
        const isEvent = await ifExists(
          events.events,
          "eventName",
          req.body.eventName.toLowerCase()
        );
        if (isEvent) {
          const numOfTickets = await getNumTicket(
            events.events,
            req.body.eventName.toLowerCase()
          );
          if (numOfTickets - req.body.quantity > 0) {
            const newReceipt = {
              username: req.body.username,
              eventName: req.body.eventName.toLowerCase(),
              ticketsBought: req.body.quantity,
            };
            const receipts = await readFileToJson("./data/receipts.json");
            receipts.receipts.push(newReceipt);
            await writeFileToJson(receipts, "./data/receipts.json");
            const newEvents = await eventSub(
              events.events,
              req.body.eventName.toLowerCase(),
              req.body.quantity
            );
            await writeFileToJson(
              { events: newEvents },
              "./data/events.json"
            );
            res.send({ message: "Tickets purchased successfully" });
          } else {
            res.send("not enough tickets");
          }
        } else {
          res.send("not find event");
        }
      } else {
        res.send("wrong body");
      }
    } else {
      res.send("wrong password");
    }
  } else {
    res.send(`user "${req.body.username}" not exists`);
  }
});

app.get("/users/:username/summary", async (req, res) => {
  const receipts = await readFileToJson("./data/receipts.json")
  const isUserExists = await ifExists(receipts.receipts, "username", req.params.username)
  if (isUserExists) {
    console.log(1);
    
    } else {
    res.send(0)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
