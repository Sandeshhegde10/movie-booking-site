import re

# Read the file
with open('lib/all-movies-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all HTTPS image URLs with local paths
# Extract the filename from the URL and create local path
def replace_url(match):
    url = match.group(1)
    # Extract the last part after the last slash for filename
    # For local paths (starting with /), keep them as-is
    if url.startswith('/'):
        return f'image: "{url}"'
    else:
        # This is an external URL, we'll skip it for now
        return match.group(0)

# Find all image: "..." patterns
pattern = r'image:\s*"([^"]+)"'
content_new = re.sub(pattern, replace_url, content)

# Now replace all https URLs with placeholder
content_new = re.sub(
    r'image:\s*"https://[^"]+\.jpg"',
    lambda m: 'image: "/placeholder.svg"',
    content_new
)

with open('lib/all-movies-data-temp.ts', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("Done!")
