export type ConfirmationModalState = {
  open: boolean;
  joiningDate: string;
  error: string;
  busy: boolean;
};

export type ConfirmationModalEvent =
  | { type: "open" }
  | { type: "cancel" }
  | { type: "date-changed"; value: string }
  | { type: "submit-started" }
  | { type: "download-succeeded" }
  | { type: "download-failed"; error: string };

export const initialConfirmationModalState: ConfirmationModalState = {
  open: false,
  joiningDate: "",
  error: "",
  busy: false,
};

export function validJoiningDateInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function nextConfirmationModal(
  state: ConfirmationModalState,
  event: ConfirmationModalEvent,
): ConfirmationModalState {
  switch (event.type) {
    case "open":
      return state.busy ? state : { ...state, open: true, error: "" };
    case "cancel":
      return state.busy ? state : { ...state, open: false, error: "" };
    case "date-changed":
      return state.busy
        ? state
        : { ...state, joiningDate: event.value, error: "" };
    case "submit-started":
      return state.busy || !validJoiningDateInput(state.joiningDate)
        ? state
        : { ...state, busy: true, error: "" };
    case "download-succeeded":
      return { ...state, open: false, busy: false, error: "" };
    case "download-failed":
      return { ...state, open: true, busy: false, error: event.error };
  }
}
