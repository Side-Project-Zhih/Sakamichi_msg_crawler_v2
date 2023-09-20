const express = require("express");
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");
const {engine} = require("express-handlebars");
const dotenv = require("dotenv");

const path = require("path");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

const getMember = require("./middleware/getMember");
const getMonthList = require("./middleware/getMonthList");

const injectDb = require("./middleware/injectDb");
const queryTargetDayMessages = require("./routes/queryTargetDayMessages");
const showNoMessagesAtTheDay = require("./routes/showNoMessagesAtTheDay");
const getTargetDayMessages = require("./routes/getTargetDayMessages");
const getHomePage = require("./routes/getHomePage");

dayjs().format();
dayjs.extend(utc);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;
const DATE_FORMAT = "YYYYMMDDHHmmss";

app.use(bodyParser.urlencoded({extended: true}));
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

app.use(injectDb);

app.post("/query", queryTargetDayMessages);
app.get(
    "/:group/:memberId/messages/:year_month/nodata",
    getMember,
    showNoMessagesAtTheDay
);
app.get(
    "/:group/:memberId/messages/:year_month/:day",
    getMonthList,
    getMember,
    getTargetDayMessages
);
app.get("/",
    getHomePage
);
app.use("/404", (req, res) => {
    res.redirect("/");
});

app.listen(PORT, () =>
    console.log(
        `Reader is ready. Please input http://localhost:${PORT}/ at browser to surfer messages`
    )
);
