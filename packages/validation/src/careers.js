"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCareerApplication = validateCareerApplication;
const common_1 = require("./common");
function validateCareerApplication(input) {
    return {
        submissionKey: (0, common_1.readSubmissionKey)(input),
        candidateName: (0, common_1.readString)(input, "fullName", { min: 2, max: 120, required: true }),
        email: (0, common_1.readEmail)(input, "email", true),
        phone: (0, common_1.readString)(input, "phone", { min: 5, max: 30, required: true }),
        role: (0, common_1.readString)(input, "role", { min: 2, max: 120, required: true }),
        experience: (0, common_1.readString)(input, "experience", { min: 2, max: 80, required: true }),
        workLinks: (0, common_1.readUrlList)(input, "workLinks", 10),
        message: (0, common_1.readString)(input, "message", { min: 10, max: 3_000, required: true }),
    };
}
//# sourceMappingURL=careers.js.map