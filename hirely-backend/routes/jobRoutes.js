import express from 'express';
import {
  getJobs,
  createJob,
  getJobById,
  deleteJob,
  updateJob 
} from '../controllers/jobController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: "Internal server error" 
  });
};

router.post('/add', authMiddleware, createJob);   
router.get('/', getJobs); 
router.get('/:id', getJobById);       
router.delete('/:id', deleteJob);  
router.put('/:id', updateJob);   

router.use(errorHandler);

export default router;
