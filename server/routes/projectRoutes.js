const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createProject,
  getProjects,
  addMember,
  removeMember,
  updateProject,
  deleteProject,
  getProjectById
} = require("../controllers/projectController");

//  Create project
router.post("/", authMiddleware, createProject);

//  Get all user projects
router.get("/", authMiddleware, getProjects);

//  Add member to project
router.post("/:projectId/members", authMiddleware, addMember);

// Remove member from project
router.delete("/:projectId/members/:userId", authMiddleware, removeMember);

// Update project (name)
router.put("/:projectId", authMiddleware, updateProject);

// Delete project (ONLY OWNER)
router.delete("/:projectId", authMiddleware, deleteProject);

// Get project by ID (with tasks and members)
router.get("/:projectId", authMiddleware, getProjectById);

module.exports = router;