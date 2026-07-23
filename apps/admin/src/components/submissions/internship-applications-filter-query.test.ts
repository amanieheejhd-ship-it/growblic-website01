import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { updateInternshipApplicationsFilterQuery } from "./internship-applications-filter-query";

describe("internship application automatic filter query", () => {
  it("changes status while preserving search and enrollment and resetting pagination", () => {
    const query = new URLSearchParams(
      updateInternshipApplicationsFilterQuery(
        "search=meera&status=NEW&enrolledInInstitute=yes&page=4&view=compact",
        "status",
        "REVIEWING",
      ),
    );
    assert.equal(query.get("search"), "meera");
    assert.equal(query.get("status"), "REVIEWING");
    assert.equal(query.get("enrolledInInstitute"), "yes");
    assert.equal(query.get("view"), "compact");
    assert.equal(query.has("page"), false);
  });

  it("removes all/empty filters without dropping the other active filters", () => {
    const withoutEnrollment = new URLSearchParams(
      updateInternshipApplicationsFilterQuery(
        "search=meera&status=NEW&enrolledInInstitute=no&page=2",
        "enrolledInInstitute",
        "",
      ),
    );
    assert.equal(withoutEnrollment.has("enrolledInInstitute"), false);
    assert.equal(withoutEnrollment.get("search"), "meera");
    assert.equal(withoutEnrollment.get("status"), "NEW");
    assert.equal(withoutEnrollment.has("page"), false);

    const withoutSearch = new URLSearchParams(
      updateInternshipApplicationsFilterQuery(
        withoutEnrollment.toString(),
        "search",
        "   ",
      ),
    );
    assert.equal(withoutSearch.has("search"), false);
    assert.equal(withoutSearch.get("status"), "NEW");
  });
});
