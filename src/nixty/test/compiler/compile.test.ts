import { describe, expect, it } from "vitest"
import { Definition, Nixpkgs, Package, Path, Source, System } from "nixty-lib"
import { compile } from "nixty-lib/compiler"
import compile01 from "../cases/compile01.js"
import compile02 from "../cases/compile02.js"
import compile03 from "../cases/compile03.js"
import compile04 from "../cases/compile04.js"
import compile05 from "../cases/compile05.js"
import compile06 from "../cases/compile06.js"
import compile07 from "../cases/compile07.js"
import weathercli from "../cases/weathercli.js"

describe("compile01", () => {
    it("matches the golden flake.nix", async () => {
        await expect(compile(compile01)).toMatchFileSnapshot("./cases/compile01.nix")
    })

    it("leaves out inputs nothing reaches", () => {
        expect(compile(compile01)).not.toContain("github:me/unused")
    })
})

describe("weathercli", () => {
    it("matches the golden flake.nix", async () => {
        await expect(compile(weathercli)).toMatchFileSnapshot("./cases/weathercli.nix")
    })
})

// Copies of examples/00-tour to examples/05-flake-input.
describe.each([
    ["compile02", compile02],
    ["compile03", compile03],
    ["compile04", compile04],
    ["compile05", compile05],
    ["compile06", compile06],
    ["compile07", compile07],
])("%s", (name, definition) => {
    it("matches the golden flake.nix", async () => {
        await expect(compile(definition)).toMatchFileSnapshot(`./cases/${name}.nix`)
    })
})

describe("compile", () => {
    it("rejects a package from another system", () => {
        const NIX_PKGS = new Nixpkgs({ tag: "nixos-25.05" })
        const p = new Package({
            name: "p",
            systems: [System.x86_64Linux, System.aarch64Linux],
            definition: () => ({
                version: "1.0",
                src: new Source(Path.fetchInternalPath(".")),
                // A fixed system instead of the one the recipe receives.
                deps: { atBuild: NIX_PKGS.getPackages(["go"], System.x86_64Linux) },
                phases: () => ({}),
            }),
        })
        const definition = new Definition({ description: "", nixpkgs: NIX_PKGS, packages: [p] })
        expect(() => compile(definition)).toThrow(/packages\.p \(aarch64-linux\) uses a value made for x86_64-linux/)
    })
})
