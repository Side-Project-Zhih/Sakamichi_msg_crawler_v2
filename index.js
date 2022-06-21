const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const { engine } = require("express-handlebars");

const path = require("path");
const dayjs = require("dayjs");

const getMember = require("./middleware/getMember");
const getMonthList = require("./middleware/getMonthList");

dayjs().format();
const app = express();

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
    "mongodb://localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000"
  );
  await client.connect();
  const db = client.db("MessageCrawler");
  req.db = db;
  return next();
});

app.post("/query", async (req, res) => {
  const { memberId, date, group } = req.body;
  const [year, month] = date.split("-");
  try {
    const queryData = await req.db
      .collection("Message")
      .find({
        group,
        member_id: memberId,
        year,
        month,
        state: "published",
      })
      .project({ day: 1 })
      .sort({ day: 1 })
      .limit(1)
      .toArray();

    const result = queryData[0];
    let redirectUrl = `http://localhost:3000/${group}/${memberId}/messages/${year}${month}/nodata`;
    if (result) {
      const day = result.day;
      redirectUrl = `http://localhost:3000/${group}/${memberId}/messages/${year}${month}/${day}`;
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
    const messages = [];
    const msgCursor = req.db
      .collection("Message")
      .find({
        group: group,
        member_id: memberId,
        year,
        month,
        day,
        state: "published",
      })
      .sort({
        published_at: 1,
      });

    for await (const message of msgCursor) {
      message.published_at = dayjs(message.published_at).format(
        "YYYY/MM/DD HH:mm"
      );
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
  const nogi = await req.db
    .collection("Member")
    .find({
      group: "nogi",
      last_updated: {
        $exists: true,
      },
    })
    .sort({ member_id: 1 })
    .toArray();

  const sakura = await req.db
    .collection("Member")
    .find({
      group: "sakura",
      last_updated: {
        $exists: true,
      },
    })
    .sort({ member_id: 1 })
    .toArray();

  const hinata = await req.db
    .collection("Member")
    .find({
      group: "hinata",
      last_updated: {
        $exists: true,
      },
    })
    .sort({ member_id: 1 })
    .toArray();

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
  res.redirect("http://localhost:3000/");
});

app.listen(3000, () =>
  console.log(
    "Reader is ready. Please input http://localhost:3000/ at browser to surfer messages"
  )
);
