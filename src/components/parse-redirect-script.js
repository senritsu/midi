/* example script
10:36 => 1:24
10:38 => 1:26
*/
const commentRegex = /^\s*#.*$/
const aliasRegex = /^alias (?<definitions>([^\s=,]+=[^\s=,]+,?)+)$/
const redirectRegex = /^(?<fromChannel>\d+):(?<fromNote>\d+)\s*=>\s*(?<toChannel>\d+):(?<toNote>\d+)$/

export default function (script) {
  const aliases = {}
  const redirects = {}

  const lines = script.split('\n').filter((x) => x)

  for (let line of lines) {
    if (line.match(commentRegex)) continue

    const aliasMatch = line.match(aliasRegex)
    if (aliasMatch) {
      aliasMatch.groups.definitions.split(',').forEach(aliasDefinition => {
        const [from, to] = aliasDefinition.split('=')
        aliases[from] = to
      })
    }

    Object.entries(aliases).forEach(([from, to]) => {
      line = line.replaceAll(from, to)
    })

    const match = line.match(redirectRegex)

    if (!match) continue

    const { fromChannel, fromNote, toChannel, toNote } = match.groups
    const zeroBasedfromChannel = parseInt(fromChannel) - 1
    const zeroBasedtoChannel = parseInt(toChannel) - 1

    if (!(zeroBasedfromChannel in redirects)) {
      redirects[zeroBasedfromChannel] = {}
    }

    redirects[zeroBasedfromChannel][fromNote] = [
      zeroBasedtoChannel,
      parseInt(toNote),
    ]
  }

  return redirects
}