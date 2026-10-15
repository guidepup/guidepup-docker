# Guidepup for Docker

<a href="https://github.com/guidepup/guidepup-docker/actions/workflows/test.yml"><img alt="Guidepup Docker test workflows" src="https://github.com/guidepup/guidepup-docker/workflows/Test/badge.svg" /></a>
<a href="https://github.com/guidepup/guidepup-docker/blob/main/LICENSE"><img alt="Guidepup Docker uses the MIT license" src="https://img.shields.io/github/license/guidepup/guidepup-docker" /></a>

## [Documentation](https://www.guidepup.dev)

[![Ubuntu Resolute Support](https://img.shields.io/badge/ubuntu-26.04%2B-blue.svg?logo=ubuntu)](https://releases.ubuntu.com/resolute/)
[![Debian Trixie Support](https://img.shields.io/badge/debian-13%2B-blue.svg?logo=debian)](https://www.debian.org/releases/trixie/)

Base images that enable Guidepup automation for the <a href="https://www.guidepup.dev/docs/api/class-orca"><b>Orca screen reader</b></a> in Linux containers.

## Overview

Linux base images for Guidepup screen reader automation.

Each image includes Node.js, the Linux runtime packages configured by `@guidepup/setup`, and the Orca assets required by the corresponding `@guidepup/guidepup` release.

Browsers are not included.

## Images

Images are published to GitHub Container Registry (GHCR) for `linux/amd64` and `linux/arm64`:

| OS                      | Node.js | Image                                                        |
| ----------------------- | ------- | ------------------------------------------------------------ |
| Ubuntu 26.04 (Resolute) | 24      | `ghcr.io/guidepup/guidepup:<version>-ubuntu-resolute-node24` |
| Ubuntu 26.04 (Resolute) | 26      | `ghcr.io/guidepup/guidepup:<version>-ubuntu-resolute-node26` |
| Debian 13 (Trixie)      | 24      | `ghcr.io/guidepup/guidepup:<version>-debian-trixie-node24`   |
| Debian 13 (Trixie)      | 26      | `ghcr.io/guidepup/guidepup:<version>-debian-trixie-node26`   |

`<version>` matches the corresponding `@guidepup/guidepup` release, for example:

```sh
docker pull ghcr.io/guidepup/guidepup:0.36.2-ubuntu-resolute-node24
```

The Ubuntu images use `ubuntu:resolute` and install the selected Node.js major from NodeSource. The Debian images use the corresponding official `node:<major>-trixie` base image.

## Usage

### Use the image with a volume mount

The images do not set a default working directory. Mount your project wherever you prefer, start a shell, then change to the mount point:

```sh
docker run --rm -it \
  --volume "$PWD:/project" \
  ghcr.io/guidepup/guidepup:0.36.2-ubuntu-resolute-node24 \
  bash
```

In the container:

```sh
cd /project
```

The image runs as root by default, so the Orca assets installed at build time are available from the default Guidepup cache at `/root/.cache/guidepup`. If you run the container as another user, set `GUIDEPUP_SCREEN_READERS_PATH` to a cache location writable by that user and install Orca assets there.

### Extend the image

Use the image as a base when you want to bake your project dependencies or additional tools into a custom image. For example, this Dockerfile installs the dependencies from a project in the build context:

```dockerfile
FROM ghcr.io/guidepup/guidepup:0.36.2-ubuntu-resolute-node24

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
```

Build and run the custom image:

```sh
docker build -t my-guidepup-project .
docker run --rm -it my-guidepup-project
```

This example sets `/app` as the derived image's working directory; the Guidepup base image itself does not impose one. Adjust the base tag to the OS and Node.js version you need.

## Powerful tooling

Check out some of the other Guidepup modules:

- [`@guidepup/setup`](https://github.com/guidepup/setup/) - Set up your local or CI environment for screen reader test automation.
- [`@guidepup/guidepup`](https://github.com/guidepup/guidepup/) - Reliable automation for your screen reader a11y workflows through JavaScript supporting VoiceOver and NVDA.
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/) - Seamless integration of Guidepup with Playwright.
- [`@guidepup/virtual-screen-reader`](https://github.com/guidepup/virtual-screen-reader/) - Reliable unit testing for your screen reader a11y workflows.
- [`@guidepup/jest`](https://github.com/guidepup/jest/) - Jest matchers for reliable unit testing of your screen reader a11y workflows.

## Resources

- [Documentation](https://www.guidepup.dev)
- [Releases](https://github.com/guidepup/guidepup-docker/pkgs/container/guidepup)
- [MIT License](https://github.com/guidepup/guidepup-docker/blob/main/LICENSE)
