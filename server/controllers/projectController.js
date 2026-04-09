const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const name  = req.body.name?.trim();

        if (!name) {
            return res.status(400).json({ message: "Project name is required" });
        }

        const existing = await Project.findOne({ 
            name,
            owner: req.user.id 
        });

        if (existing) {
            return res.status(400).json({ message: "Project with that name already exists" });
        }

        const project = await Project.create({
            name,
            owner: req.user.id,
            members: [],
        });

        await project.populate("owner", "email name");

        res.status(201).json(project);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating project" });
    }
};

// Get all projects where user is owner or member
exports.getProjects = async (req, res) => {
    try {
        const userId = req.user.id;

        const projects = await Project.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        }).populate("owner", "email name")
        .populate("members", "email name")
        .sort({ createdAt: -1 });

        res.json(projects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching projects" });
    }
};

//  Add user to project (ONLY OWNER)
exports.addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can add users
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner can add users" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❗ Prevent adding owner as member
    if (project.owner.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Owner is already part of the project" });
    }

    // Prevent duplicate members
    const alreadyMember = project.members.some(
      member => member.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already in project" });
    }

    project.members.push(user._id);
    await project.save();

    res.json({ message: "User added to project" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding user" });
  }
};

// Remove user from project (ONLY OWNER)
exports.removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can remove users
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner can remove users" });
    }

    // Prevent removing owner
    if (project.owner.toString() === userId) {
      return res.status(400).json({ message: "Cannot remove project owner" });
    }

    // Check if user is actually a member
    const isMember = project.members.some(
      member => member.toString() === userId
    );

    if (!isMember) {
      return res.status(404).json({ message: "User is not in the project" });
    }

    // Remove user
    project.members = project.members.filter(
      member => member.toString() !== userId
    );

    await project.save();

    res.json({ message: "User removed from project" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing user" });
  }
};