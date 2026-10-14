# Guidepup Docker images

Linux base images for Guidepup screen reader automation. Each image includes Node.js, the Linux runtime packages configured by `@guidepup/setup`, and the Orca assets required by the corresponding `@guidepup/guidepup` release. The matching Guidepup package remains installed under `/opt/guidepup` so the baked assets stay registered. Browsers are not included; install the browser version that matches your project's Playwright dependency.

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

## Publishing

The `Publish Docker images` workflow checks the latest stable release of `guidepup/guidepup` daily and publishes its four OS/Node combinations to GHCR if any corresponding tag is missing. It can also be run manually with `workflow_dispatch`.

Publishing uses the repository's automatically provided `GITHUB_TOKEN`; no Docker Hub account or additional publishing secret is required. After the first successful publish, set the `guidepup/guidepup` container package visibility to **Public** in the organization's GitHub Packages settings so users can pull images without authenticating.

The `@guidepup/setup` version is pinned independently in `.github/workflows/publish.yml` and should be updated there when desired.

## Testing

The `Test Docker images` workflow builds both Dockerfiles with the latest stable Guidepup release, then runs the Orca + Firefox Playwright smoke test in each image. Firefox is installed by the test run rather than included in the base images.
