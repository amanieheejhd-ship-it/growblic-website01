"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuoteRequest = validateQuoteRequest;
const common_1 = require("./common");
function validateQuoteRequest(input) {
    return {
        submissionKey: (0, common_1.readSubmissionKey)(input),
        name: (0, common_1.readString)(input, "name", { min: 2, max: 120, required: true }),
        email: (0, common_1.readEmail)(input, "email"),
        phone: (0, common_1.readString)(input, "phone", { max: 30 }),
        company: (0, common_1.readString)(input, "company", { max: 160 }),
        location: (0, common_1.readString)(input, "location", { max: 160 }),
        service: (0, common_1.readString)(input, "service", { max: 160 }),
        budget: (0, common_1.readString)(input, "budget", { max: 120 }),
        requirements: (0, common_1.readString)(input, "requirements", { min: 3, max: 10_000, required: true }),
        calculatorData: (0, common_1.readOptionalJsonObject)(input, "calculatorData"),
        source: (0, common_1.readString)(input, "source", { max: 100 }),
    };
}
//# sourceMappingURL=quote.js.map