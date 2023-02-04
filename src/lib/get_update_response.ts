import semver from "semver"
import { Octokit } from "@octokit/rest"
import axios from "axios"

type UpdateResponse = {
    version: string
    notes: string
    pub_date: string
    platforms: PlatformData
}

type PlatformData = {
    [key: string]: {
        url: string
        signature: string
    }
}

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

export default async function getUpdateResponse(): Promise<UpdateResponse> {
    const octokit = new Octokit({ auth: "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" })
    const { data: release } = await octokit.repos.getLatestRelease({
        owner: "ihsanvp",
        repo: "credo-desktop"
    })

    const latest_version = semver.clean(release.tag_name) as string
    const notes = release.body as string
    const pub_date = new Date(release.published_at as string).toISOString()

    const platformsArray = []

    for (const [arch, extension] of PLATFORMS) {
        let url = ""
        let signature = ""

        const asset = release.assets.find(a => a.name.includes(extension))

        if (asset) {
            url = asset.browser_download_url
            const sig = release.assets.find(a => a.name.includes(extension + ".sig"))

            if (sig) {
                signature = await getSignature(sig.browser_download_url)
            }
        }

        platformsArray.push([arch, { url, signature }])
    }

    return {
        version: latest_version,
        notes,
        pub_date,
        platforms: Object.fromEntries(platformsArray)
    }

}

async function getSignature(url: string): Promise<string> {
    const res = await axios.get(url)
    return res.data
}