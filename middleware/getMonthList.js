const dayjs = require("dayjs");
dayjs().format();

async function getMonthList(req, res, next) {
  const { group, memberId, year_month, day } = req.params;
  const dateObject = dayjs(year_month, "YYYYMM");
  const year = dateObject.format("YYYY");
  const month = dateObject.format("MM");

  req.date = {
    year,
    month,
    day,
  };

  const pipeline = [
    {
      $match: {
        group,
        member_id: memberId,
        year,
        month,
        state: "published",
      },
    },
    {
      $group: {
        _id: "month",
        days: {
          $addToSet: "$day",
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];

  const queryData = await req.db
    .collection("Message")
    .aggregate(pipeline)
    .toArray();
  const result = queryData[0];
  if (!result) {
    return;
  }

  const { days } = result;
  days.sort((a, b) => +a - +b);
  const monthList = days.map((day) => ({
    date: `${year}/${month}/${day}`,
    url: `http://localhost:3000/${group}/${memberId}/messages/${year}${month}/${day}`,
  }));

  req.monthList = monthList;

  return next();
}

module.exports = getMonthList;
