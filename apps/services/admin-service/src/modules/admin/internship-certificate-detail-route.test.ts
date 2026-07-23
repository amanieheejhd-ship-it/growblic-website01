import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { resolveInternshipCertificateDetail } from "./internship-certificate-detail-route";

const certificateId = "cert_6691fb23e4cdad08c5a8874e811417d6";
const root = process.cwd().endsWith("apps/services/admin-service")
  ? resolve(process.cwd(), "../../..")
  : process.cwd();

function missing(): never {
  throw new Error("NEXT_NOT_FOUND");
}

describe("internship certificate detail route", () => {
  it("builds each list View href directly from the Prisma certificate ID", async () => {
    const page = await readFile(resolve(
      root,
      "apps/admin/src/app/internship-certificates/page.tsx",
    ), "utf8");
    assert.match(page, /const hrefId = certificate\.id/);
    assert.match(page, /if \(certificate\.id !== hrefId\)/);
    assert.match(page, /throw new Error\("Certificate ID mismatch"\)/);
    assert.match(page, /key=\{certificate\.id\}/);
    assert.match(page, /internship-certificates\/\$\{hrefId\}/);
  });

  it("opens an existing certificate by its internal ID", async () => {
    const calls: string[] = [];
    const resolved = await resolveInternshipCertificateDetail({
      id: certificateId,
      findById: async (id) => {
        calls.push(id);
        return { candidateName: "Fixture Candidate" };
      },
      notFound: missing,
    });

    assert.deepEqual(calls, [certificateId]);
    assert.equal(resolved.id, certificateId);
    assert.equal(resolved.result.candidateName, "Fixture Candidate");
  });

  it("does not treat a public reference as an internal detail-route ID", async () => {
    let queried = false;
    await assert.rejects(
      resolveInternshipCertificateDetail({
        id: "GB26ABCDEFGH",
        findById: async () => {
          queried = true;
          return {};
        },
        notFound: missing,
      }),
      /NEXT_NOT_FOUND/,
    );
    assert.equal(queried, false);
  });

  it("returns notFound for a missing certificate", async () => {
    await assert.rejects(
      resolveInternshipCertificateDetail({
        id: certificateId,
        findById: async () => null,
        notFound: missing,
      }),
      /NEXT_NOT_FOUND/,
    );
  });
});
