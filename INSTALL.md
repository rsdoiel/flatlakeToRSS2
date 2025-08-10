# Installation for development of **flatlakeToRSS2**

**flatlakeToRSS2** This is a demo of using the FlatLake generated JSON API to
produce an RSS 2.0 feed. It's a working proof of concept only.

The Deno+TypeScript program that will convert a FlatLake generated
`api/all/page-1.json` file into RSS 2.0 XML.

## Quick install with curl or irm

There is an experimental installer.sh script that can be run with the following
command to install latest table release. This may work for macOS, Linux and if
you’re using Windows with the Unix subsystem. This would be run from your shell
(e.g. Terminal on macOS).

```shell
curl https://rsdoiel.github.io/flatlakeToRSS2/installer.sh | sh
```

This will install the programs included in flatlakeToRSS2 in your `$HOME/bin`
directory.

If you are running Windows 10 or 11 use the Powershell command below.

```ps1
irm https://rsdoiel.github.io/flatlakeToRSS2/installer.ps1 | iex
```

### If your are running macOS or Windows

You may get security warnings if you are using macOS or Windows. See the notes
for the specific operating system you're using to fix issues.

- [INSTALL_NOTES_macOS.md](INSTALL_NOTES_macOS.md)
- [INSTALL_NOTES_Windows.md](INSTALL_NOTES_Windows.md)

## Installing from source

### Required software

- Deno &gt;&#x3D; 2.4.3
- CMTools &gt;&#x3D; 0.0.40

### Steps

1. git clone https://github.com/rsdoiel/flatlakeToRSS2
2. Change directory into the `flatlakeToRSS2` directory
3. Make to build, test and install

```shell
git clone https://github.com/rsdoiel/flatlakeToRSS2
cd flatlakeToRSS2
make
make test
make install
```
