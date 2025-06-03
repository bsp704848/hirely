import express from 'express';
import {
  getJobs,
  createJob,
  getJobById,
  deleteJob,
  updateJob 
} from '../controllers/jobController.js';

const router = express.Router();

router.post('/add', createJob);    
router.get('/', getJobs);           
router.get('/:id', getJobById);       
router.delete('/:id', deleteJob);  
router.put('/:id', updateJob);   

export default router;
