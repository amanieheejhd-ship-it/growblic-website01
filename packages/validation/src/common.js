"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormValidationError = void 0;
exports.readString = readString;
exports.readEmail = readEmail;
exports.readSubmissionKey = readSubmissionKey;
exports.readUrlList = readUrlList;
exports.readOptionalJsonObject = readOptionalJsonObject;
class FormValidationError extends Error {
    constructor(message = "Please check the submitted information and try again.") {
        super(message);
        this.name = "FormValidationError";
    }
}
exports.FormValidationError = FormValidationError;
function readString(input, key, { min = 0, max, required = false }) {
    const value = input[key];
    if (value === undefined || value === null || value === "") {
        if (required)
            throw new FormValidationError();
        return null;
    }
    if (typeof value !== "string")
        throw new FormValidationError();
    const normalized = value.normalize("NFKC").trim();
    if ((required && normalized.length === 0) || normalized.length < min || normalized.length > max) {
        throw new FormValidationError();
    }
    return normalized || null;
}
function readEmail(input, key, required = false) {
    const value = readString(input, key, { max: 254, required });
    if (!value)
        return null;
    const normalized = value.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        throw new FormValidationError("Please provide a valid email address.");
    }
    return normalized;
}
function readSubmissionKey(input) {
    const value = readString(input, "submissionKey", { min: 8, max: 100, required: true });
    if (!value || !/^[a-zA-Z0-9_-]+$/.test(value))
        throw new FormValidationError();
    return value;
}
function readUrlList(input, key, maximumItems) {
    const value = input[key];
    if (!Array.isArray(value) || value.length === 0 || value.length > maximumItems) {
        throw new FormValidationError();
    }
    const urls = value.map((item) => {
        if (typeof item !== "string" || item.length > 2_048)
            throw new FormValidationError();
        let parsed;
        try {
            parsed = new URL(item.trim());
        }
        catch {
            throw new FormValidationError("Please provide valid work links.");
        }
        if (!["http:", "https:", "mailto:"].includes(parsed.protocol) || parsed.username || parsed.password) {
            throw new FormValidationError("Please provide valid work links.");
        }
        return parsed.toString();
    });
    return [...new Set(urls)];
}
function readOptionalJsonObject(input, key) {
    const value = input[key];
    if (value === undefined || value === null)
        return null;
    if (typeof value !== "object" || Array.isArray(value))
        throw new FormValidationError();
    return value;
}
//# sourceMappingURL=common.js.map