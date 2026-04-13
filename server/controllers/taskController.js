const Task = require("../models/Task");
const Project = require("../models/Project");

// 
const isProjectMember = (project, userId) => {
  return (
    project.owner.toString() === userId ||
    project.members.some((member) => member.toString() === userId)
  );  
}

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, projectId } = req.body;

    //1. validate that project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // validate is user is member or owner
    const isMember = 
    project.owner.toString() === req.user.id ||
    project.members.some(member => member.toString() === req.user.id);

    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    //create task
    const task = await Task.create({
      title,
      user: req.user.id,
      project: projectId,
      status:"pending"
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TASKS
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = isProjectMember(project, req.user.id);

    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("project", "owner");
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task= await Task.findById(id).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    // owner(admin user) may update else none.

    if(task.project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only project owner can update tasks" });
    }

    task.status = req.body.status ?? task.status;
    task.title = req.body.title ?? task.title;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const {id} = req.params;

    const task = await Task.findById(id).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    //onwer(admin user) may delete else none.
    if (task.project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only project owner can delete tasks" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};