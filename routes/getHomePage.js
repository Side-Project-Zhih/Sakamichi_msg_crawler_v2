const dayjs = require("dayjs");
function getAllGroupPipeline() {
    return [
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
}

async function getHomePage(req, res) {
    const pipeline = getAllGroupPipeline();
    const groups = await req.db.collection("Member").aggregate(pipeline).toArray();

    const memberList = {};
    for (const group of groups) {
        group.members.sort((a, b) => +a.member_id - +b.member_id);
        memberList[group._id] = group.members;
    }


    const now = dayjs().local().format("YYYY-MM");

    return res.render("index", {
        webTitle: "Message SELECTOR",
        isIndex: true,
        memberList,
        jsonMemberList: JSON.stringify(memberList),
        now,
    });
}

module.exports = getHomePage;