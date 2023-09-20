const dayjs = require("dayjs");
const DATE_FORMAT = "YYYYMMDDHHmmss";

async function queryTargetDayMessages(req, res) {
    const {memberId, date, group} = req.body;
    const [year, month] = date.split("-");

    const dateObject = dayjs(`${year}${month}`, "YYYYMM")

    const startDate = dateObject.utc().format(DATE_FORMAT);
    const endDate = dateObject.utc().add(1, "month").format(DATE_FORMAT);
    try {
        const result = await req.db
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
            .project({published_at: 1})
            .sort({published_at: 1})
            .toArray()

        let redirectUrl = `/${group}/${memberId}/messages/${year}${month}/nodata`;
        if (result.length > 0) {
            const firstDay = result.sort((a, b) => Number(a.published_at) - Number(b.published_at))[0]
            const publishDate = firstDay.published_at;
            const day = dayjs.utc(publishDate).local().format("DD");
            redirectUrl = `/${group}/${memberId}/messages/${year}-${month}/${day}`;
        }

        return res.redirect(redirectUrl);
    } catch (err) {
        console.log(err);
    }
}

module.exports = queryTargetDayMessages;