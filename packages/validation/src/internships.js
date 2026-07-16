"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInternshipApplication = validateInternshipApplication;
const common_1 = require("./common");
function validateInternshipApplication(input) {
    const submissionKey = (0, common_1.readSubmissionKey)(input);
    const internshipSlug = (0, common_1.readString)(input, "internshipSlug", { min: 2, max: 100, required: true });
    const candidateName = (0, common_1.readString)(input, "fullName", { min: 2, max: 120, required: true });
    const email = (0, common_1.readEmail)(input, "email", true);
    const phone = (0, common_1.readString)(input, "phone", { min: 5, max: 30, required: true });
    const state = (0, common_1.readString)(input, "state", { min: 2, max: 100, required: true });
    const instituteEnrollment = (0, common_1.readString)(input, "instituteEnrollment", { max: 3, required: true });
    if (!internshipSlug || !/^[a-z0-9-]+$/.test(internshipSlug))
        throw new common_1.FormValidationError();
    if (!instituteEnrollment || !["Yes", "No"].includes(instituteEnrollment))
        throw new common_1.FormValidationError();
    const enrollment = instituteEnrollment;
    const instituteName = (0, common_1.readString)(input, "instituteName", { min: enrollment === "Yes" ? 2 : 0, max: 180, required: enrollment === "Yes" });
    const course = (0, common_1.readString)(input, "course", { min: enrollment === "Yes" ? 2 : 0, max: 120, required: enrollment === "Yes" });
    const enrollmentNumber = (0, common_1.readString)(input, "enrollmentNumber", { min: enrollment === "Yes" ? 2 : 0, max: 100, required: enrollment === "Yes" });
    const highestQualification = (0, common_1.readString)(input, "highestQualification", { min: enrollment === "No" ? 2 : 0, max: 120, required: enrollment === "No" });
    const passingYear = (0, common_1.readString)(input, "passingYear", { min: enrollment === "No" ? 4 : 0, max: 4, required: enrollment === "No" });
    return {
        submissionKey,
        internshipSlug,
        candidateName: candidateName,
        email: email,
        phone: phone,
        state: state,
        instituteEnrollment: enrollment,
        instituteName: enrollment === "Yes" ? instituteName : null,
        course: enrollment === "Yes" ? course : null,
        enrollmentNumber: enrollment === "Yes" ? enrollmentNumber : null,
        highestQualification: enrollment === "No" ? highestQualification : null,
        passingYear: enrollment === "No" ? passingYear : null,
        message: (0, common_1.readString)(input, "message", { max: 2_000 }),
    };
}
//# sourceMappingURL=internships.js.map