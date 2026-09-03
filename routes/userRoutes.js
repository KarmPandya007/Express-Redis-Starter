import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { getAllPeople, getPersonById, updatePersonById, deletePersonById } from '../controllers/PeopleController.js'

const router = express.Router()

router.get('/', protect, getAllPeople)
router.get('/:id', protect, getPersonById)
router.put('/:id', updatePersonById)
router.delete('/:id', protect, deletePersonById)

export default router;