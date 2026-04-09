const Project = require("../models/Project");

// Member check (view/create)
exports.isProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember =
      project.owner.toString() === req.user.id ||
      project.members.some(
        (member) => member.toString() === req.user.id
      );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.project = project; // 🔥 reuse later

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Owner check (modify/delete)
exports.isProjectOwner = async (req, res, next) => {
  try {
    const projectId =
      req.params.projectId || req.body.projectId || req.project?._id;

    const project =
      req.project || (await Project.findById(projectId));

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner allowed" });
    }

    req.project = project;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};