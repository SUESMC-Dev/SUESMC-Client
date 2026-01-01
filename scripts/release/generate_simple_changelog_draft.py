import os
import re

import requests
from packaging.version import Version

OWNER = "UNIkeEN"
REPO = "SJMCL"
TAG_PATTERN = re.compile(r"^v(.+)$")


def get_headers():
    token = os.getenv("GITHUB_TOKEN")
    if token:
        return {"Authorization": f"token {token}"}
    return {}


def get_tags(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/tags"
    resp = requests.get(url, headers=get_headers(), params={"per_page": 100, "page": 1})
    resp.raise_for_status()
    return [tag["name"] for tag in resp.json()]


def filter_and_sort_tags(tags):
    valid_tags = []
    for tag in tags:
        match = TAG_PATTERN.match(tag)
        if not match:
            continue
        try:
            valid_tags.append((tag, Version(match.group(1))))
        except Exception:
            continue
    valid_tags.sort(key=lambda item: item[1], reverse=True)
    return [item[0] for item in valid_tags]


def main():
    tags = filter_and_sort_tags(get_tags(OWNER, REPO))
    if len(tags) < 2:
        print("Synced to latest commit, no previous tag available for diff.")
        return
    latest, previous = tags[0], tags[1]
    diff_url = f"https://github.com/{OWNER}/{REPO}/releases/tag/{latest}"
    print(f"# {latest}\n- Synced upstream to {latest}, for more information please visit {diff_url}. \n\n---\n\n# {latest}\n- 同步上游到 {latest} ，访问 {diff_url} 了解更多信息。")


if __name__ == "__main__":
    main()
