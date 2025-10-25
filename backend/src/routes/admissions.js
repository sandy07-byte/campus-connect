const express = require('express');
const { authenticateToken, authorizeRoles } = require('../auth');
const Admission = require('../models/Admission');
const { sendAdmissionApprovalSMS, sendAdmissionRejectionSMS } = require('../services/smsService');

module.exports = function() {
  const router = express.Router();

  // Create admission (public or student)
  router.post('/', async (req, res) => {
    try {
      const { name, parent_number, email, class: classApplyingFor, address } = req.body;
      if (!name || !parent_number || !email || !classApplyingFor || !address) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      const created = await Admission.create({ name, parent_number, email, class: classApplyingFor, address });
      return res.json({ id: created._id });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  // List admissions (teacher/admin only)
  router.get('/', authenticateToken, authorizeRoles('teacher','admin'), async (req, res) => {
    try {
      const rows = await Admission.find().sort({ createdAt: -1 }).lean();
      return res.json(rows);
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  // Approve admission (admin only)
  router.put('/:id/approve', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const admissionId = req.params.id;
      const admission = await Admission.findById(admissionId);
      
      if (!admission) {
        return res.status(404).json({ error: 'Admission not found' });
      }

      admission.status = 'approved';
      admission.approved_by = req.user.id;
      admission.approved_at = new Date();
      
      await admission.save();

      // Send SMS notification
      const smsResult = await sendAdmissionApprovalSMS(
        admission.parent_number,
        admission.name
      );

      return res.json({ 
        message: 'Admission approved successfully',
        sms_sent: smsResult.success,
        sms_message: smsResult.message
      });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  // Decline admission (admin only)
  router.put('/:id/decline', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
      const admissionId = req.params.id;
      const admission = await Admission.findById(admissionId);
      
      if (!admission) {
        return res.status(404).json({ error: 'Admission not found' });
      }

      admission.status = 'declined';
      admission.declined_by = req.user.id;
      admission.declined_at = new Date();
      
      await admission.save();

      // Send SMS notification
      const smsResult = await sendAdmissionRejectionSMS(
        admission.parent_number,
        admission.name
      );

      return res.json({ 
        message: 'Admission declined',
        sms_sent: smsResult.success,
        sms_message: smsResult.message
      });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  return router;
};




