/* example script
10:36 => 1:24
10:38 => 1:26
*/
const redirectRegex = /(?<channel1>\d+):(?<note1>\d+)\s*=>\s*(?<channel2>\d+):(?<note2>\d+)/

export default function (script) {
  const redirects = {}

  const lines = script.split('\n').filter((x) => x)

  for (const line of lines) {
    const match = line.match(redirectRegex)

    if (!match) continue

    const { channel1, note1, channel2, note2 } = match.groups
    const zeroBasedChannel1 = parseInt(channel1) - 1
    const zeroBasedChannel2 = parseInt(channel2) - 1

    if (!(zeroBasedChannel1 in redirects)) {
      redirects[zeroBasedChannel1] = {}
    }

    redirects[zeroBasedChannel1][note1] = [
      zeroBasedChannel2,
      parseInt(note2),
    ]
  }

  return redirects
}