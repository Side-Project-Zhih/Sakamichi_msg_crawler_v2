const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const { engine } = require("express-handlebars");
const dotenv = require("dotenv");

const path = require("path");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

const getMember = require("./middleware/getMember");
const getMonthList = require("./middleware/getMonthList");

dayjs().format();
dayjs.extend(utc);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;
const DATE_FORMAT = "YYYYMMDDHHmmss";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.engine(
  "handlebars",
  engine({
    helpers: {
      equal: require("./handlebar_helper").equal,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(async (req, res, next) => {
  const client = new MongoClient(
    "mongodb://0.0.0.0:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000"
  );
  await client.connect();
  const db = client.db("MessageCrawler");
  req.db = db;
  return next();
});

app.post("/query", async (req, res) => {
  const { memberId, date, group } = req.body;
  const [year, month] = date.split("-");

  const offset = -1 * dayjs().utcOffset();
  const dateObject = dayjs.utc(`${date}`).utcOffset(offset);
  const startDate = dateObject.format(DATE_FORMAT);
  const endDate = dateObject.add(1, "month").format(DATE_FORMAT);

  try {
    const queryData = await req.db
      .collection("Message")
      .find({
        group,
        member_id: memberId,
        published_at: {
          $gte: startDate,
          $lt: endDate,
        },
        state: "published",
      })
      .project({ published_at: 1 })
      .sort({ published_at: 1 })
      .limit(1)
      .toArray();

    const result = queryData[0];
    let redirectUrl = `/${group}/${memberId}/messages/${year}${month}/nodata`;
    if (result) {
      const day = dayjs.utc(result.published_at).local().format("DD");
      redirectUrl = `/${group}/${memberId}/messages/${year}${month}/${day}`;
    }

    return res.redirect(redirectUrl);
  } catch (err) {
    console.log(err);
  }
});

app.get(
  "/:group/:memberId/messages/:year_month/nodata",
  getMember,
  async (req, res) => {
    const { group, year_month } = req.params;
    const dateObject = dayjs(year_month, "YYYYMM");
    const year = dateObject.format("YYYY");
    const month = dateObject.format("MM");

    const members = await req.db
      .collection("Member")
      .find({
        group,
        last_updated: {
          $exists: true,
        },
      })
      .sort({ member_id: 1 })
      .toArray();

    return res.render("message", {
      webTitle: `${req.member.name} ${year}/${month}`,
      nodata: true,
      message: "該月份沒有任何的  message !!!!!",
      members,
      member: req.member,
      monthList: req.monthList,
      year_month: `${year}-${month}`,
      date: `${year}/${month}`,
    });
  }
);

app.get(
  "/:group/:memberId/messages/:year_month/:day",
  getMonthList,
  getMember,
  async (req, res) => {
    const { group, memberId } = req.params;
    const { year, month, day } = req.date;

    const offset = -1 * dayjs().utcOffset();
    const dateObject = dayjs.utc(`${year}${month}${day}`).utcOffset(offset);
    const startDate = dateObject.format(DATE_FORMAT);
    const endDate = dateObject.add(1, "day").format(DATE_FORMAT);

    const messages = [];
    const msgCursor = req.db
      .collection("Message")
      .find({
        group: group,
        member_id: memberId,
        published_at: {
          $gte: startDate,
          $lt: endDate,
        },
        state: "published",
      })
      .sort({
        published_at: 1,
      });

    for await (const message of msgCursor) {
      message.published_at = dayjs
        .utc(message.published_at)
        .local()
        .format("YYYY/MM/DD HH:mm");
      messages.push(message);
    }

    const members = await req.db
      .collection("Member")
      .find({
        group,
        last_updated: {
          $exists: true,
        },
      })
      .sort({ member_id: 1 })
      .toArray();

    return res.render("message", {
      webTitle: `${req.member.name} ${year}/${month}/${day}`,
      messages,
      member: req.member,
      monthList: req.monthList,
      members,
      year_month: `${year}-${month}`,
      date: `${year}/${month}/${day}`,
    });
  }
);

app.get("/", async (req, res) => {
  const pipeline = [
    {
      $match: {
        last_updated: {
          $exists: true,
        },
      },
    },
    {
      $sort: {
        group: 1,
        member_id: 1,
      },
    },
    {
      $unset: ["_id"],
    },
    {
      $project: {
        group: 1,
        member_id: 1,
        name: 1,
      },
    },
    {
      $group: {
        _id: "$group",
        members: {
          $push: {
            member_id: "$member_id",
            name: "$name",
          },
        },
      },
    },
  ];
  const data = await req.db.collection("Member").aggregate(pipeline).toArray();

  let sakura, nogi, hinata;
  for (const group of data) {
    group.members.sort((a, b) => +a.member_id - +b.member_id);
    switch (group._id) {
      case "sakura": {
        sakura = group.members;
        break;
      }
      case "nogi": {
        nogi = group.members;
        break;
      }
      case "hinata": {
        hinata = group.members;
        break;
      }
    }
  }

  const memberList = {
    sakura,
    nogi,
    hinata,
  };

  const now = dayjs(new Date()).format("YYYY-MM");

  return res.render("index", {
    webTitle: "Message SELECTOR",
    isIndex: true,
    memberList,
    jsonMemberList: JSON.stringify(memberList),
    now,
  });
});

app.use("/404", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () =>
  console.log(
    `Reader is ready. Please input http://localhost:${PORT}/ at browser to surfer messages`
  )
);
