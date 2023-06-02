with import (fetchTarball https://github.com/NixOS/nixpkgs/archive/22.11.tar.gz) {};

stdenv.mkDerivation {
  name = "hasura-where";

  buildInputs = with pkgs; [
    git
    nodejs-16_x
    yarn
  ];
}
