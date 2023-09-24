const dayjs = require("dayjs");
const dotenv = require("dotenv");
const envPath = `${process.cwd()}/.env`;
dotenv.config({path: envPath});

const DATE_FORMAT = "YYYYMMDDHHmmss";
const YOUR_NAME = process.env.YOUR_NAME;

function replaceReplaceSymbolByDefaultName(text) {

    const replaceSymbols = ['％％％', '%%%']

    for (const replaceSymbol of replaceSymbols) {
        if (text.includes(replaceSymbol) && YOUR_NAME) {
            text = text.replace(replaceSymbol, YOUR_NAME)
            break
        }
    }

    return text;
}

async function getTargetDayMessages(req, res) {
    const {group, memberId, year_month, day} = req.params;
    const [year, month] = year_month.split("-");

    const dateObject = dayjs(`${year}${month}${day}`, "YYYYMMDD");
    const startDate = dateObject.utc().format(DATE_FORMAT);
    const endDate = dateObject.utc().add(1, "day").format(DATE_FORMAT);

    let messages = await req.db
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
        }).toArray();

    messages = messages.sort((a, b) => +a.published_at - +b.published_at).map((message) =>
        ({
            ...message,
            published_at: dayjs.utc(message.published_at).local().format("YYYY/MM/DD HH:mm"),
        })).map(message => {

        let {text} = message;
        text = text ? replaceReplaceSymbolByDefaultName(text) : text;

        return {
            ...message,
            text
        }
    });

    const members = await req.db
        .collection("Member")
        .find({
            group,
            last_updated: {
                $exists: true,
            },
        })
        .sort({member_id: 1})
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

module.exports = getTargetDayMessages;