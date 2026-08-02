export const MAX_MAS_PASS_ATTEMPTS = 5;

// Escalating temporary lockout: 5 fails -> 15 min, then 1 hr, then 24 hr (capped).
// Auto-unlocks once the lock window passes. Successful unlock resets the level.
const LOCK_DURATIONS_MS = [
  15 * 60 * 1000,
  60 * 60 * 1000,
  24 * 60 * 60 * 1000,
];

export const isMasPassLocked = (user) =>
  !!user.masPassLockUntil && new Date(user.masPassLockUntil) > new Date();

export const masPassLockRemainingMs = (user) => {
  if (!isMasPassLocked(user)) return 0;
  return new Date(user.masPassLockUntil) - new Date();
};

// Mutates user; caller must save().
// Returns true when this failure pushed the user into a new lockout window.
export const registerMasPassFailure = (user) => {
  user.masPassAttempts = (user.masPassAttempts || 0) + 1;
  if (user.masPassAttempts < MAX_MAS_PASS_ATTEMPTS) return false;

  const level = Math.min(
    user.masPassLockLevel || 0,
    LOCK_DURATIONS_MS.length - 1,
  );
  user.masPassLockUntil = new Date(Date.now() + LOCK_DURATIONS_MS[level]);
  user.masPassLockLevel = (user.masPassLockLevel || 0) + 1;
  user.masPassAttempts = 0;
  return true;
};

// Mutates user; caller must save().
export const clearMasPassFailures = (user) => {
  user.masPassAttempts = 0;
  user.masPassLockUntil = null;
  user.masPassLockLevel = 0;
};
