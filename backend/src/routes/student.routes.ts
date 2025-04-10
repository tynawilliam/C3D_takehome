import { Router } from "express";
import { studentController } from "controllers/studentController";

const router = Router();

router.post("/", studentController.createStudent);
router.get("/", studentController.getAllStudents);

//add search route
router.get("/search", studentController.searchStudents);

router.get("/:id([0-9]+)", studentController.getStudentById);
router.put("/:id(\\d+)", studentController.updateStudent);
router.delete("/:id(\\d+)", studentController.deleteStudent);

export default router;
