// A small C program, built and tested with make, then installed by hand.
// Copy of examples/02-package/nixty.ts, compiled to compile04.nix by test/compiler/compile.test.ts.
import { DefaultPhases, Definition, Licenses, Nixpkgs, Package, Path, Source, System, nix } from "nixty-lib"

const SYSTEMS = [System.x86_64Linux]

const NIX_PKGS = new Nixpkgs({ tag: "nixos-25.05" })

const greeter = new Package({
    name: "greeter",
    systems: SYSTEMS,
    definition: () => ({
        version: "1.0.0",
        // This folder: hello.c and the Makefile.
        src: new Source(Path.fetchInternalPath(".")),
        // A C compiler and make come with every package, so nothing to add.
        deps: {},
        phases: (out) => ({
            build: DefaultPhases.BUILD,
            test: DefaultPhases.TEST,
            // The Makefile has no `install` target, so copy the program ourselves.
            install: nix`mkdir -p ${out}/bin\ncp greeter ${out}/bin/`,
        }),
        metadata: {
            description: "Says hello",
            license: Licenses.MIT,
            mainProgram: "greeter",
        },
    }),
})

export default new Definition({
    description: "Example 02: a package",
    nixpkgs: NIX_PKGS,
    packages: [greeter],
})
