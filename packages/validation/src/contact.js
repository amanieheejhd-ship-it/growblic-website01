"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContact = validateContact;
function getTrimmedString(input, field, fieldErrors, options) {
    const value = input[field];
    const label = `${field[0].toUpperCase()}${field.slice(1)}`;
    if (value === undefined || value === null || value === "") {
        if (options.required)
            fieldErrors[field] = `${label} is required.`;
        return undefined;
    }
    if (typeof value !== "string") {
        fieldErrors[field] = `${label} must be text.`;
        return undefined;
    }
    const normalized = value.trim();
    if (!normalized && options.required)
        fieldErrors[field] = `${label} is required.`;
    else if (options.min && normalized.length < options.min) {
        fieldErrors[field] = `${label} must be at least ${options.min} characters.`;
    }
    else if (normalized.length > options.max) {
        fieldErrors[field] = `${label} must be at most ${options.max} characters.`;
    }
    return normalized || undefined;
}
function validateContact(input) {
    const fieldErrors = {};
    const name = getTrimmedString(input, "name", fieldErrors, { required: true, min: 2, max: 100 });
    const email = getTrimmedString(input, "email", fieldErrors, { required: true, max: 254 })?.toLowerCase();
    const phone = getTrimmedString(input, "phone", fieldErrors, { max: 30 });
    const company = getTrimmedString(input, "company", fieldErrors, { max: 120 });
    const service = getTrimmedString(input, "service", fieldErrors, { max: 120 });
    const budget = getTrimmedString(input, "budget", fieldErrors, { max: 100 });
    const message = getTrimmedString(input, "message", fieldErrors, { required: true, min: 10, max: 3000 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        fieldErrors.email = "Please enter a valid email address.";
    }
    if (Object.keys(fieldErrors).length > 0 || !name || !email || !message) {
        return { success: false, fieldErrors };
    }
    return { success: true, data: { name, email, phone, company, service, budget, message } };
}
//# sourceMappingURL=contact.js.map