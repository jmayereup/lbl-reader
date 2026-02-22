import glob

files = glob.glob('/home/jmayer/Dev/tj-components/src/*/index.js')
for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    parts = content.split('connectedCallback() {')
    if len(parts) > 1:
        subparts = parts[1].split('setTimeout(() => {', 1)
        if len(subparts) > 1:
            rest = subparts[1].replace('}, 0);', '});', 1)
            parts[1] = subparts[0] + 'requestAnimationFrame(() => {' + rest
            new_content = 'connectedCallback() {'.join(parts)
            with open(filepath, 'w') as f:
                f.write(new_content)
            print("Updated", filepath)
        else:
            print("Could not find setTimeout in", filepath)
    else:
        print("Could not find connectedCallback in", filepath)
