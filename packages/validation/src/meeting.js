"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMeetingRequest = validateMeetingRequest;
const common_1 = require("./common");
function validateMeetingRequest(input) {
    return {
        submissionKey: (0, common_1.readSubmissionKey)(input),
        name: (0, common_1.readString)(input, "name", { min: 2, max: 120, required: true }),
        email: (0, common_1.readEmail)(input, "email"),
        phone: (0, common_1.readString)(input, "phone", { max: 30 }),
        message: (0, common_1.readString)(input, "message", { min: 3, max: 3_000, required: true }),
        source: (0, common_1.readString)(input, "source", { max: 100 }),
    };
}
//# sourceMappingURL=meeting.js.map