const dayjs = require("dayjs");
dayjs().format();

const DATE_FORMAT = "YYYYMMDDHHmmss";

async function getMonthList(req, res, next) {
    const {group, memberId, year_month, day} = req.params;
    const dateObject = dayjs(year_month, "YYYYMM");


    const year = dateObject.local().format("YYYY")
    const month = dateObject.local().format("MM")

    const startDate = dateObject.utc().format(DATE_FORMAT);
    const endDate = dateObject.utc().add(1, "month").format(DATE_FORMAT);

    const messages = await req.db
        .collection("Message")
        .find({
            group: group,
            member_id: memberId,
            published_at: {
                $gte: startDate,
                $lt: endDate,
            },
            state: "published",
        }).toArray()


    let days = new Set(messages.map((message) => dayjs.utc(message.published_at).local().format("DD")));
    days = Array.from(days);
    days.sort((a, b) => +a - +b);

    const monthList = days.map((day) => ({
        date: `${year}/${month}/${day}`,
        url: `/${group}/${memberId}/messages/${year}-${month}/${day}`,
    }));

    req.monthList = monthList;

    return next();
}

module.exports = getMonthList;
