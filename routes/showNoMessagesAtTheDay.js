const dayjs = require("dayjs");

async function showNoMessagesAtTheDay(req, res) {
    const {group, year_month} = req.params;
    const dateObject = dayjs(year_month, "YYYY-MM");
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
        .sort({member_id: 1})
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

module.exports = showNoMessagesAtTheDay;