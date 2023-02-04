import Router from "@koa/router";
import pkg from "../package.json"
import semver from "semver"
import getUpdateResponse from "lib/get_update_response";

const router = new Router()

router.get("/", async (ctx, next) => {
    ctx.body = {
        version: pkg.version,
        name: pkg.name,
        description: pkg.description,
    }
})

const EXTENSIONS = {
    windows: "x64_en-US.msi.zip",
    macos: "app.tar.gz",
    linux: "amd64.AppImage.tar.gz"
}

const PLATFORMS = [
    // windows
    ["windows-x86_64", EXTENSIONS.windows],

    // macos
    ["darwin-x86_64", EXTENSIONS.macos],
    ["darwin-aarch64", EXTENSIONS.macos],

    // linux
    ["linux-x86_64", EXTENSIONS.linux],
]

type PlatformData = {
    [key: string]: {
        url: string
        signature: string
    }
}

router.get("/update/:target/:current_version", async (ctx, next) => {
    try {
        const current_version = ctx.params.current_version
        const update = await getUpdateResponse()

        if (semver.compare(update.version, current_version) <= 0) {
            throw new Error("already up to date")
        }

        ctx.body = update

    } catch (err) {
        ctx.status = 204
        ctx.body = {}
    }
})

export default router