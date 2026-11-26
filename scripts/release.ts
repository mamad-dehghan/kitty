export type Bump = "patch" | "minor" | "major";

export type ReleaseArgs = {
  target: Bump | string;
  dryRun: boolean;
};

const USAGE = "Usage: bun run release <patch|minor|major|x.y.z> [--dry-run]";
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const CHANGELOG = "CHANGELOG.md";

const isBump = (value: string): value is Bump =>
  value === "patch" || value === "minor" || value === "major";

const isSemver = (value: string) => SEMVER.test(value);

const parseVersion = (value: string) => {
  const match = value.match(SEMVER);
  if (!match) throw new Error(`invalid version: ${value}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])] as const;
};

export const compareVersions = (a: string, b: string) => {
  const [aMajor, aMinor, aPatch] = parseVersion(a);
  const [bMajor, bMinor, bPatch] = parseVersion(b);
  return aMajor - bMajor || aMinor - bMinor || aPatch - bPatch;
};

export const incrementVersion = (current: string, target: string) => {
  if (!isSemver(current)) throw new Error(`invalid current version: ${current}`);

  if (isSemver(target)) {
    if (compareVersions(target, current) <= 0) {
      throw new Error(`new version ${target} must be greater than ${current}`);
    }
    return target;
  }

  if (!isBump(target)) {
    throw new Error(`invalid bump or version: ${target}`);
  }

  const [major, minor, patch] = parseVersion(current);
  const next =
    target === "major"
      ? [major + 1, 0, 0]
      : target === "minor"
        ? [major, minor + 1, 0]
        : [major, minor, patch + 1];

  return next.join(".");
};

export const parseArgs = (argv: string[]): ReleaseArgs => {
  let target: string | undefined;
  let dryRun = false;

  for (const arg of argv) {
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg.startsWith("--")) throw new Error(`unknown option: ${arg}`);
    if (target) throw new Error("provide only one bump or version");
    target = arg;
  }

  if (!target || (!isBump(target) && !isSemver(target))) {
    throw new Error(USAGE);
  }

  return { target, dryRun };
};

export const promoteChangelog = (
  changelog: string,
  version: string,
  date: string,
) => {
  const normalized = changelog.replace(/\r\n/g, "\n");
  const heading = normalized.match(/^## \[Unreleased\][ \t]*$/m);
  if (heading?.index === undefined) {
    throw new Error(`${CHANGELOG} must contain a ## [Unreleased] heading`);
  }

  const bodyStart = heading.index + heading[0].length;
  const rest = normalized.slice(bodyStart);
  const nextHeading = rest.match(/\n## \[/);
  const body = (
    nextHeading ? rest.slice(0, nextHeading.index) : rest
  ).trim();

  if (!body) {
    throw new Error(`${CHANGELOG} has no Unreleased entries`);
  }

  const before = normalized.slice(0, heading.index);
  const after = nextHeading
    ? rest.slice(nextHeading.index).replace(/^\n+/, "")
    : "";
  const section = `## [Unreleased]\n\n## [${version}] - ${date}\n\n${body}\n`;

  return `${before}${section}${after ? `\n${after}` : ""}`.replace(
    /\n*$/,
    "\n",
  );
};

const run = (cmd: string[], inherit = false) => {
  const result = Bun.spawnSync({
    cmd,
    stdout: inherit ? "inherit" : "pipe",
    stderr: inherit ? "inherit" : "pipe",
  });

  return {
    exitCode: result.exitCode ?? 1,
    stdout: result.stdout ? new TextDecoder().decode(result.stdout).trim() : "",
    stderr: result.stderr ? new TextDecoder().decode(result.stderr).trim() : "",
  };
};

const fail = (message: string): never => {
  console.error(`release: ${message}`);
  process.exit(1);
};

const main = async () => {
  const args = (() => {
    try {
      return parseArgs(process.argv.slice(2));
    } catch (error) {
      return fail(error instanceof Error ? error.message : String(error));
    }
  })();

  const branch = run(["git", "branch", "--show-current"]);
  if (branch.exitCode !== 0 || branch.stdout !== "main") {
    fail(`run this from main (current: ${branch.stdout || "unknown"})`);
  }

  const status = run(["git", "status", "--porcelain"]);
  if (status.exitCode !== 0) {
    fail(status.stderr || "git status failed");
  }

  const unexpected = status.stdout
    .split("\n")
    .filter(Boolean)
    .filter((line) => line.slice(3) !== CHANGELOG);

  if (unexpected.length > 0) {
    fail(
      `commit or stash all changes first; only ${CHANGELOG} may be dirty:\n${unexpected.join("\n")}`,
    );
  }

  const packageText = await Bun.file("package.json").text();
  const packageJson = JSON.parse(packageText) as {
    version?: string;
    [key: string]: unknown;
  };

  const currentVersion = packageJson.version;
  if (!currentVersion || !isSemver(currentVersion)) {
    fail("package.json has no valid version");
  }
  const version = currentVersion as string;

  const nextVersion = incrementVersion(version, args.target);
  const tag = `v${nextVersion}`;

  if (run(["git", "rev-parse", "--verify", "--quiet", `refs/tags/${tag}`]).exitCode === 0) {
    fail(`tag ${tag} already exists`);
  }

  if (!(await Bun.file(CHANGELOG).exists())) {
    fail(`${CHANGELOG} not found`);
  }

  const changelog = await Bun.file(CHANGELOG).text();
  const date = new Date().toISOString().slice(0, 10);
  const nextChangelog = promoteChangelog(changelog, nextVersion, date);

  if (args.dryRun) {
    console.log(`current: ${currentVersion}`);
    console.log(`next:    ${nextVersion}`);
    console.log(`tag:     ${tag}`);
    console.log(`\n${nextChangelog}`);
    return;
  }

  console.log("running typecheck...");
  const typecheck = run([process.execPath, "run", "typecheck"], true);
  if (typecheck.exitCode !== 0) {
    fail("typecheck failed; nothing was changed");
  }

  console.log("running build...");
  const build = run([process.execPath, "run", "build"], true);
  if (build.exitCode !== 0) {
    fail("build failed; nothing was changed");
  }

  packageJson.version = nextVersion;
  await Bun.write("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);
  await Bun.write(CHANGELOG, nextChangelog);

  const add = run(["git", "add", "package.json", CHANGELOG]);
  if (add.exitCode !== 0) fail(add.stderr || "git add failed");

  const commit = run(["git", "commit", "-m", `chore: release ${tag}`]);
  if (commit.exitCode !== 0) fail(commit.stderr || "git commit failed");

  const tagResult = run(["git", "tag", "-a", tag, "-m", tag]);
  if (tagResult.exitCode !== 0) fail(tagResult.stderr || "git tag failed");

  console.log(`\nReleased ${tag} locally.`);
  console.log(`\nPush:\n  git push origin main\n  git push origin ${tag}`);
  console.log(`\nGitHub release:\n  gh release create ${tag} --generate-notes`);
};

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
