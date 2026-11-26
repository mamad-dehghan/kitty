import { describe, expect, test } from "bun:test";
import {
  compareVersions,
  incrementVersion,
  parseArgs,
  promoteChangelog,
} from "./release";

describe("incrementVersion", () => {
  test("bumps patch, minor, and major", () => {
    expect(incrementVersion("0.1.0", "patch")).toBe("0.1.1");
    expect(incrementVersion("0.1.0", "minor")).toBe("0.2.0");
    expect(incrementVersion("0.1.0", "major")).toBe("1.0.0");
  });

  test("accepts an explicit greater version", () => {
    expect(incrementVersion("0.1.0", "0.3.0")).toBe("0.3.0");
  });

  test("rejects an explicit version that is not greater", () => {
    expect(() => incrementVersion("0.1.0", "0.1.0")).toThrow();
    expect(() => incrementVersion("0.1.0", "0.0.9")).toThrow();
  });
});

describe("compareVersions", () => {
  test("orders semantic versions", () => {
    expect(compareVersions("0.2.0", "0.1.9")).toBeGreaterThan(0);
    expect(compareVersions("0.1.0", "0.1.0")).toBe(0);
    expect(compareVersions("0.1.0", "1.0.0")).toBeLessThan(0);
  });
});

describe("parseArgs", () => {
  test("parses a bump and dry-run", () => {
    expect(parseArgs(["minor", "--dry-run"])).toEqual({
      target: "minor",
      dryRun: true,
    });
  });

  test("rejects missing or duplicate targets", () => {
    expect(() => parseArgs([])).toThrow();
    expect(() => parseArgs(["minor", "patch"])).toThrow();
  });
});

describe("promoteChangelog", () => {
  const changelog = `# Changelog

## [Unreleased]

### Added
- FAB

## [0.1.0] - 2026-10-02

- Initial release.
`;

  test("moves Unreleased entries into a dated version section", () => {
    const result = promoteChangelog(changelog, "0.2.0", "2026-11-26");

    expect(result.startsWith("# Changelog\n\n## [Unreleased]\n\n## [0.2.0] - 2026-11-26")).toBe(
      true,
    );
    expect(result).toContain("### Added\n- FAB");
    expect(result).toContain("## [0.1.0] - 2026-10-02");
  });

  test("rejects an empty Unreleased section", () => {
    const empty = `# Changelog\n\n## [Unreleased]\n\n## [0.1.0] - 2026-10-02\n\n- Initial.\n`;
    expect(() => promoteChangelog(empty, "0.2.0", "2026-11-26")).toThrow();
  });

  test("rejects a missing Unreleased heading", () => {
    expect(() => promoteChangelog("# Changelog\n", "0.2.0", "2026-11-26")).toThrow();
  });
});
