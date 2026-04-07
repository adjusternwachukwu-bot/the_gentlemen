const TELEHEALTH_API_URL = process.env.TELEHEALTH_API_BASE_URL;
const TELEHEALTH_API_KEY = process.env.TELEHEALTH_API_KEY;

const headers = {
  Authorization: `Bearer ${TELEHEALTH_API_KEY}`,
  "Content-Type": "application/json",
};

export async function createReferral(userId: string, intakeData: Record<string, unknown>) {
  const response = await fetch(`${TELEHEALTH_API_URL}/referral`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      user_id: userId,
      ...intakeData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create referral");
  }

  return response.json();
}

export async function getAvailableSlots(providerId: string) {
  const response = await fetch(
    `${TELEHEALTH_API_URL}/appointments?provider_id=${providerId}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch slots");
  }

  return response.json();
}

export async function bookAppointment(
  userId: string,
  providerId: string,
  slotId: string
) {
  const response = await fetch(`${TELEHEALTH_API_URL}/appointments`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      user_id: userId,
      provider_id: providerId,
      slot_id: slotId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to book appointment");
  }

  return response.json();
}

export async function getAppointmentStatus(appointmentId: string) {
  const response = await fetch(
    `${TELEHEALTH_API_URL}/appointments/${appointmentId}/status`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch appointment status");
  }

  return response.json();
}

export async function checkInsuranceEligibility(
  insuranceProvider: string,
  memberId: string
) {
  const response = await fetch(`${TELEHEALTH_API_URL}/insurance/verify`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      provider: insuranceProvider,
      member_id: memberId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to verify insurance");
  }

  return response.json();
}