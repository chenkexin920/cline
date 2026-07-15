import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
		exclude: ["src/**/*.e2e.test.ts"],
		testTimeout: 30000,        // ← 加这行（默认 5000 太小，鸿蒙 PC 慢 IO 经常超）
        hookTimeout: 30000,        // ← 可选（默认 5000）
	},
});
