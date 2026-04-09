const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createProject,
  getProjects,
  addMember,
  removeMember
} = require("../controllers/projectController");

//  Create project
router.post("/", authMiddleware, createProject);

//  Get all user projects
router.get("/", authMiddleware, getProjects);

//  Add member to project
router.post("/:projectId/members", authMiddleware, addMember);

// Remove member from project
router.delete("/:projectId/members/:userId", authMiddleware, removeMember);

module.exports = router;