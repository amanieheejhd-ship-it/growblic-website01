export function shouldRevealInternshipPlans(responseStatus: number) {
  return responseStatus === 201;
}

export function canContinueToInternshipPayment(
  selectedDays: number | null,
  applicationReference: string,
) {
  return selectedDays !== null && applicationReference.trim().length > 0;
}
