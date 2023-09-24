const dayjs = require("dayjs");
const dotenv = require("dotenv");
const envPath = `${process.cwd()}/.env`;
dotenv.config({path: envPath});
const defaultDisplayGroup = process.env.DEFAULT_DISPLAY_GROUP || "sakura";

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

const GROUP_NAME_MAP = {
    "sakura": "櫻坂46",
    "hinata": "日向坂46",
    "nogi": "乃木坂46"
}

async function getGroupNames(db) {
    const groupNames = (await db.collection('Member').aggregate([
        {
            $group: {
                _id: "$group",
                name: {
                    $first: "$group"
                }
            }
        },
        {
            $project: {
                _id: 0,
            }
        }
    ]).toArray()).map(group => ({
        value: group.name,
        name: GROUP_NAME_MAP[group.name] || group.name,
        select: group.name === defaultDisplayGroup ? "selected" : ""
    }))
    return groupNames;
}

async function getGroupMemberMap(db) {
    const pipeline = getAllGroupPipeline();
    const groups = await db.collection("Member").aggregate(pipeline).toArray();
    const memberList = {};
    for (const group of groups) {
        group.members.sort((a, b) => +a.member_id - +b.member_id);
        if (group) {
            memberList[group._id] = group.members;
        }
    }
    return memberList;
}

async function getHomePage(req, res) {
    const groupNames = await getGroupNames(req.db);
    const memberMap = await getGroupMemberMap(req.db);
    const now = dayjs().local().format("YYYY-MM");
    const defaultMemberList = memberMap[defaultDisplayGroup];

    return res.render("index", {
        webTitle: "Message SELECTOR",
        isIndex: true,
        memberList: memberMap,
        jsonMemberList: JSON.stringify(memberMap),
        now,
        groupNames,
        defaultMemberList
    });
}

module.exports = getHomePage;