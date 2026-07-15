import { existsSync } from "fs";

function normalizeShellName(shell: string): string {
	const normalizedPath = shell.replaceAll("\\", "/");
	const lastSeparatorIndex = normalizedPath.lastIndexOf("/");
	const baseName =
		lastSeparatorIndex >= 0
			? normalizedPath.slice(lastSeparatorIndex + 1)
			: normalizedPath;
	return baseName.toLowerCase();
}

export function getDefaultShell(platform: string): string {
	if (platform === "win32") return "powershell";
    const envShell = process.env.SHELL?.trim();
    if (envShell && existsSync(envShell)) return envShell;
    if (existsSync("/bin/bash")) return "/bin/bash";
    if (existsSync("/bin/sh")) return "/bin/sh";
    return "/bin/sh";
}

export function getShellArgs(shell: string, command: string): string[] {
	const shellName = normalizeShellName(shell);

	if (
		shellName === "powershell" ||
		shellName === "powershell.exe" ||
		shellName === "pwsh" ||
		shellName === "pwsh.exe"
	) {
		return ["-NoProfile", "-NonInteractive", "-Command", command];
	}

	if (shellName === "cmd" || shellName === "cmd.exe") {
		return ["/d", "/s", "/c", command];
	}

	return ["-c", command];
}
