export const COMMANDS = {
    group: {
        alias: "g",
        describe: "chose group sakura / nogi / hinata ex: -g sakura",
        string: true,
    },
    time: {
        alias: "t",
        describe: "chose specific time ex: -t 2020-01-01; It's is possible to cowork with -g",
        string: true,

    },
    members: {
        alias: "m",
        describe:
            "input member id ex: -m 21, if you want to download  multiple members please input ex: -m 21 11",
        array: true,
        string: true,
    },
    showMember: {
        alias: "s",
        describe: "show member id by input group name ex: -s nogi",
        string: true,
    },
    updateMemberList: {
        alias: "update_member",
        describe:
            "update member list, please input group name ex: --update_member nogi",
        string: true,
    },
    updatePhoneImage: {
        alias: "update_phone",
        describe:
            "update phone image, please input group name ex: --update_image nogi",
        string: true,
    },
};
