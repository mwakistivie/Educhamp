import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import Result from '../models/Result.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { authenticateClerk, adminOnly } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload and parse Excel sheet (Admin only)
router.post('/upload', authenticateClerk, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    
    const workbook = XLSX.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    let successCount = 0;
    let errors = [];
    
    for (const row of data) {
      try {
        const student = await Student.findOne({ studentId: row.studentId });
        if (!student) {
          errors.push(`Student ${row.studentId} not found`);
          continue;
        }
        
        const result = new Result({
          student: student._id,
          subject: row.subject,
          score: row.score,
          maxScore: row.maxScore || 100,
          percentage: (row.score / (row.maxScore || 100)) * 100,
          grade: calculateGrade((row.score / (row.maxScore || 100)) * 100),
          examType: row.examType || 'Assessment'
        });
        
        await result.save();
        successCount++;
      } catch (err) {
        errors.push(`Error processing ${row.studentId}: ${err.message}`);
      }
    }
    
    res.json({ 
      message: 'Results uploaded successfully',
      successCount,
      errors,
      data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get parent's children results
router.get('/parent/:parentId', authenticateClerk, async (req, res) => {
  try {
    // Verify the parent is accessing their own data
    if (req.userId !== req.params.parentId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const parent = await User.findOne({ clerkId: req.params.parentId }).populate('children');
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    
    const results = await Result.find({ 
      student: { $in: parent.children } 
    }).populate('student');
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function calculateGrade(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export default router;
