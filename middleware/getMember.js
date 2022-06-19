async function getMember(req, res, next) {
  const { group, memberId } = req.params;

  const member = await req.db
    .collection("Member")
    .findOne({ group, member_id: memberId });

  req.member = member;
  return next();
}

module.exports = getMember;
