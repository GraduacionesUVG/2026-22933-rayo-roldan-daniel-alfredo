// Using another flake: home-manager's own package, taken from its repository. It becomes an input
// read as a flake (no `flake = false`) in flake.nix.
// Copy of examples/05-flake-input/nixty.ts, compiled to compile07.nix by test/compiler/compile.test.ts.
import { Command, Definition, DevShell, Flake, Nixpkgs, Path, System } from "nixty-lib"

const SYSTEMS = [System.x86_64Linux]

const NIX_PKGS = new Nixpkgs({ tag: "nixos-25.05" })
const HOME_MANAGER = new Flake(
    Path.fetchFromGithub({ owner: "nix-community", repo: "home-manager", tag: "release-25.05" }),
)

const home = new DevShell({
    name: "home",
    systems: SYSTEMS,
    packages: (system) => HOME_MANAGER.getPackages(["home-manager"], system),
})

const hmVersion = new Command({
    name: "hm-version",
    systems: SYSTEMS,
    packages: (system) => HOME_MANAGER.getPackages(["home-manager"], system),
    command: "home-manager --version",
})

export default new Definition({
    description: "Example 05: another flake as input",
    nixpkgs: NIX_PKGS,
    devShells: [home],
    commands: [hmVersion],
})
