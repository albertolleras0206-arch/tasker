const Project = require("../models/Project");
const User = require("../models/User");
const { isOwner, isMember } = require("../utils/projectHelper");


// Create a new project
exports.createProject = async (req, res) => {
  try {
    // Check for duplicate project name for this user
    const existingProject = await Project.findOne({
      name: req.body.name,
      owner: req.user.id,
    });

    if (existingProject) {
      return res.status(400).json({ message: "Project name already exists" });
    }

    const project = await Project.create({
      name: req.body.name,
      owner: req.user.id,
      members: [],
    });

    if (!name || name.trim() === "") {
      alert("Project name is required");
      return;
    }

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all projects where user is owner or member
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId },
      ],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    if (!isOwner(project, req.user.id)) {
      return res.status(403).json({ message: "Only owner can add users" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent adding owner as member
    if (isOwner(project, user._id.toString())) {
      return res.status(400).json({ message: "Owner is already part of the project" });
    }

    // Prevent duplicate members
    if (isMember(project, user._id.toString())) {
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
    if (!isOwner(project, req.user.id)) {
      return res.status(403).json({ message: "Only owner can remove users" });
    }

    // Prevent removing owner
    if (isOwner(project, userId)) {
      return res.status(400).json({ message: "Cannot remove project owner" });
    }

    // Check if user is actually a member
    if (!isMember(project, userId)) {
      return res.status(404).json({ message: "User is not in the project" });
    }

    // Remove user
    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );

    await project.save();

    res.json({ message: "User removed from project" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing user" });
  }
};


// Update project name (ONLY OWNER)
exports.updateProject = async (req, res) => {
  try {
    const { name } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can update
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.name = name || project.name;
    
    const updatedProject = await project.save();

    res.json(updatedProject);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete project (ONLY OWNER) 

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get projects by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};