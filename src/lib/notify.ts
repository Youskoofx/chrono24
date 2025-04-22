// src/lib/notify.ts
// Simple SMS notification service using Twilio

/**
 * Sends an SMS notification when a tire is added to stock
 * @param reference - The reference of the tire that was added
 */
export async function sendSms(reference: string): Promise<boolean> {
  try {
    console.log(`SMS notification would be sent for tire: ${reference}`);
    // In a real implementation, this would call Twilio API
    // For now, we'll just log the notification
    return true;
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    return false;
  }
}
