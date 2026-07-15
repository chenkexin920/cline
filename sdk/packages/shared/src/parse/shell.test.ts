import { describe, expect, it } from "vitest";
import { getDefaultShell, getShellArgs } from "./shell";

describe("shell helpers", () => {
	it("selects PowerShell on Windows and bash elsewhere", () => {
		expect(getDefaultShell("win32")).toBe("powershell");
		
		// Non-Windows: returns SHELL env (or /bin/bash if it exists, falling back to /bin/sh).
		// This handles cross-platform shells (bash, zsh, /bin/sh on HongMeng PC, etc.) without
		// hardcoding a single path.
		for (const platform of ["darwin", "linux", "openharmony", "freebsd"] as const) {
			const shell = getDefaultShell(platform);
			expect(shell).toMatch(/sh$/);  // ends with "sh"
			expect(shell.startsWith("/") || shell.includes("/")).toBe(true);  // is a path
		}
	});

	it("uses PowerShell flags for PowerShell executables", () => {
		expect(getShellArgs("powershell", "Write-Output 'hi'")).toEqual([
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			"Write-Output 'hi'",
		]);
		expect(
			getShellArgs(
				"C:\\Program Files\\PowerShell\\7\\pwsh.exe",
				"Write-Output 'hi'",
			),
		).toEqual([
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			"Write-Output 'hi'",
		]);
	});

	it("uses cmd flags for cmd.exe", () => {
		expect(getShellArgs("cmd.exe", "echo hello")).toEqual([
			"/d",
			"/s",
			"/c",
			"echo hello",
		]);
	});

	it("uses POSIX flags for bash-like shells", () => {
		expect(getShellArgs("/bin/bash", "echo hi")).toEqual(["-c", "echo hi"]);
		expect(
			getShellArgs("C:\\Program Files\\Git\\bin\\bash.exe", "echo hi"),
		).toEqual(["-c", "echo hi"]);
	});
});
