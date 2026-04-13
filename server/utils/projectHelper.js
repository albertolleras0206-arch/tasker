const isOwner = (project, userId) => {
  return project.owner.toString() === userId;
};

const isMember = (project, userId) => {
  return project.members.some(
    member => member.toString() === userId);
};

const hasAccess = (project, userId) => {
  return isOwner(project, userId) || isMember(project, userId);
};

module.exports = {
  isOwner,
  isMember,
  hasAccess,
};