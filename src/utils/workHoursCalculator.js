/**
 * Parse a time string (e.g. "09:30 AM", "9:15 AM", "06:45 PM", "18:30") into minutes from midnight
 * @param {string} timeStr
 * @returns {number|null} minutes from 00:00
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;

  const clean = timeStr.trim();
  // Support "hh:mm AM/PM", "hh:mm:ss AM/PM", or 24-hr "hh:mm"
  const match = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3] ? match[3].toUpperCase() : null;

  if (meridian === 'PM' && hours < 12) {
    hours += 12;
  } else if (meridian === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Accurately calculate working hours between a check-in and check-out time
 * @param {string} checkInStr - e.g. "09:15 AM"
 * @param {string} checkOutStr - e.g. "06:30 PM", "--:--", "In Progress"
 * @returns {string} - Formatted duration e.g. "9h 15m" or "In Progress"
 */
export function calculateWorkHours(checkInStr, checkOutStr) {
  if (
    !checkInStr ||
    !checkOutStr ||
    checkOutStr === '--:--' ||
    checkOutStr === '-' ||
    checkOutStr === 'In Progress'
  ) {
    return 'In Progress';
  }

  const inMins = parseTimeToMinutes(checkInStr);
  const outMins = parseTimeToMinutes(checkOutStr);

  if (inMins === null || outMins === null) {
    return 'In Progress';
  }

  let diff = outMins - inMins;
  // Handle cross-midnight shift if end time is numerically less than start
  if (diff < 0) {
    diff += 24 * 60;
  }

  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;

  return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}

/**
 * Calculate live elapsed working hours from punch-in time to current live clock
 * @param {string} checkInStr - e.g. "09:20 AM"
 * @returns {string} - e.g. "3h 40m"
 */
export function calculateElapsedHours(checkInStr) {
  if (!checkInStr || checkInStr === '--:--' || checkInStr === 'Not Punched In') {
    return '0h 00m';
  }

  const inMins = parseTimeToMinutes(checkInStr);
  if (inMins === null) return '0h 00m';

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  let diff = nowMins - inMins;
  if (diff < 0) {
    diff += 24 * 60;
  }

  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;

  return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}
