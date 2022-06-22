const dayjs = require("dayjs");
dayjs().format();

const DATE_FORMAT = "YYYYMMDDHHmmss";

async function getMonthList(req, res, next) {
  const { group, memberId, year_month, day } = req.params;
  const dateObject = dayjs(year_month, "YYYYMM");
  const year = dateObject.format("YYYY");
  const month = dateObject.format("MM");

  const offset = -1 * dayjs().utcOffset();
  const queryDateObject = dayjs.utc(year_month).utcOffset(offset);
  const startDate = queryDateObject.format(DATE_FORMAT);
  const endDate = queryDateObject.add(1, "month").format(DATE_FORMAT);

  req.date = {
    year,
    month,
    day,
  };

  let days = new Set();
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


  for await (const message of msgCursor) {
    const day = dayjs.utc(message.published_at).local().format("DD");
    const aaa = dayjs.utc(message.published_at).local().format("YYYYMMDD HH:mm:ss");
    days.add(day);
  }

  days = Array.from(days);


  days.sort((a, b) => +a - +b);
  const monthList = days.map((day) => ({
    date: `${year}/${month}/${day}`,
    url: `/${group}/${memberId}/messages/${year}${month}/${day}`,
  }));

  req.monthList = monthList;

  return next();
}

module.exports = getMonthList;
