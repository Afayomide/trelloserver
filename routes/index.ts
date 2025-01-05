import { addTasks, deleteTasks, getAllTaskHistory, getTasks, updateTasks } from "../controllers";

const express = require("express");
const router = express.Router();

router.route("/tasks").post(addTasks);
router.route("/tasks").get(getTasks)
router.route("/tasks/:id").put(updateTasks)
router.route("/tasks/:id").delete(deleteTasks)
router.route("/history").get(getAllTaskHistory)

module.exports = router
