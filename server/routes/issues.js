// routes/issues.js
// Updated: replaced fake hardcoded citizenId with req.user.id from JWT , updated on 20/4/2026 
// Added verifyJWT on POST, and all remaining API contract routes.

const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
// just the type of import changed here 
// const verifyJWT = require("../middleware/verifyJWT").default;
const verifyJWT = require("../middleware/verifyJWT");
const isAdmin = require("../middleware/isAdmin");

// Helper to generate a token like TOK882931 , but in future , will need a better mechanism 20/4(last viewed)
// const generateToken = () =>
//   "TOK" + Math.floor(100000 + Math.random() * 900000);
const generateToken = () => {
  return (
    "TOK" +
    Date.now().toString(36) +   // compact time
    Math.random().toString(36).slice(2, 6) // random
  ).toUpperCase();
};




// needs a review again , to clarify the , placing of the middleware 20/4
// POST /api/issues — File a new complaint (citizen must be logged in)
router.post("/", verifyJWT, async (req, res) => {
  try {
    const { description, department, location, photoUrl } = req.body;

    if (!description || !department || !location) {
      return res.status(400).json({ error: "description, department, and location are required" });
    }

    const token = generateToken();

    const newIssue = new Issue({
      token,
      citizenId: req.user.id,   // comes from verifyJWT, not request body
      description,
      department,
      location,

      // photoUrl: photoUrl || null,
      // Fix on 20/4
      photoUrl: photoUrl ?? null
    });

    await newIssue.save();

    res.status(201).json({
      success: true,
      token,
      message: "Issue filed successfully. Use your token to track progress.",
    });
  } catch (error) {
    console.error("Error submitting issue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Flow is somewhat like this -
// Request arrives
//     ↓
// verifyJWT runs → invalid? Stop here, return 401
//     ↓ (if valid)
// req.user is now { id, role }
//     ↓
// The route handler runs, and can use req.user.id
// to know which citizen is filing the complaint



// Fix - put before /api/issues/:token , to resolve router conflict 
// GET /api/issues — Get all issues (admin only)
router.get("/", verifyJWT, isAdmin, async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// GET /api/issues/:token — Track issue by token (public, no auth needed)
router.get("/:token", async (req, res) => {
  try {
    const issue = await Issue.findOne({ token: req.params.token });

    if (!issue) {
      return res.status(404).json({ error: "No issue found with that token" });
    }

    res.json({ success: true, issue });
  } catch (error) {
    console.error("Error fetching issue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





// PATCH /api/issues/:id/status — Update issue status (admin only)
router.patch("/:id/status", verifyJWT, isAdmin, async (req, res) => {
  try {
    const { status, officerNotes } = req.body;

    const validStatuses = ["Submitted", "Assigned", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // const updateData = { status, officerNotes };
    const updateData = { status };
      if (officerNotes !== undefined) updateData.officerNotes = officerNotes;
      

    // Record the resolution time so the score calculator can use it
    if (status === "Resolved") {
      updateData.resolvedAt = new Date();
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }  // return the updated document
    );

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.json({ success: true, issue });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;


// testing purpose hardcode 
// ) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;