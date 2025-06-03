import Job from "../models/job.js";

export async function getJobs(req, res) {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: "Server error while fetching jobs" });
    }
}

export async function createJob(req, res) {
    try {
        const newJob = new Job(req.body);
        console.log('request...', req.body);
        console.log('newJob...', newJob);
        

        if (!req.body.jobCategory || !req.body.jobType || !req.body.jobTitle || !req.body.company) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        await newJob.save();
        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job: newJob,
        });
    } catch (err) {
        res.status(400).json({ error: "Error creating job", details: err.message });
    }
}

export async function getJobById(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: "Job not found" });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: "Error fetching job by ID" });
    }
}

export async function updateJob(req, res) {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,       
            runValidators: true  
        });

        if (!job) return res.status(404).json({ error: "Job not found" });

        res.json({
            success: true,
            message: "Job updated successfully",
            job
        });
    } catch (err) {
        res.status(400).json({ error: "Error updating job" });
    }
}


export async function deleteJob(req, res) {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting job" });
    }
}
