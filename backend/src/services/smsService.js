const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    // For development/demo purposes, we'll log the SMS instead of actually sending
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 SMS to ${to}: ${message}`);
      return { success: true, message: 'SMS logged (development mode)' };
    }

    // In production, uncomment the following lines to send actual SMS
    /*
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    return { success: true, sid: result.sid };
    */

    // For demo purposes, return success
    return { success: true, message: 'SMS would be sent in production' };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

const sendAdmissionApprovalSMS = async (parentNumber, studentName, schoolName = 'Delhi Public School Hyderabad') => {
  const message = `🎉 Congratulations! Your admission application for ${studentName} has been approved by ${schoolName}. Please visit the school office within 7 days to complete the admission process. For queries, call +91-XXXXXXXXXX.`;
  
  return await sendSMS(parentNumber, message);
};

const sendAdmissionRejectionSMS = async (parentNumber, studentName, schoolName = 'Delhi Public School Hyderabad') => {
  const message = `Thank you for your interest in ${schoolName}. Unfortunately, we cannot offer admission to ${studentName} at this time. We encourage you to apply again in the next academic year.`;
  
  return await sendSMS(parentNumber, message);
};

const sendEventReminderSMS = async (parentNumber, studentName, eventName, eventDate) => {
  const message = `📅 Reminder: ${eventName} is scheduled for ${eventDate}. Please ensure ${studentName} attends. For any queries, contact the school office.`;
  
  return await sendSMS(parentNumber, message);
};

const sendQuizReminderSMS = async (parentNumber, studentName, quizName, dueDate) => {
  const message = `📝 Reminder: ${studentName} has a quiz "${quizName}" due on ${dueDate}. Please ensure they complete it on time.`;
  
  return await sendSMS(parentNumber, message);
};

module.exports = {
  sendSMS,
  sendAdmissionApprovalSMS,
  sendAdmissionRejectionSMS,
  sendEventReminderSMS,
  sendQuizReminderSMS
};




