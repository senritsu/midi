/* example script
10:36 => 1:24
10:38 => 1:26
*/
const commentRegex = /^\s*#.*$/
const aliasRegex = /^alias (?<definitions>([^\s=,]+=[^\s=,]+,?)+)$/
const redirectRegex = /^(?<fromChannel>\d+):(?:(?<isFromCC>CC)?(?<fromNote>\d+)|(?<isFromPitchBend>PB))\s*=>\s*(?<toChannel>\d+):(?:(?<isToCC>CC)?(?<toNote>\d+)|(?<isToPitchBend>PB))$/

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

    const { fromChannel, fromNote, toChannel, toNote, isFromCC, isToCC, isFromPitchBend, isToPitchBend } = match.groups

    if (isFromCC !== isToCC) {
      console.error(`CC can only be mapped to CC, invalid rule: ${line}`)
      continue
    }

    if (isFromPitchBend !== isToPitchBend) {
      console.error(`pitch bend can only be mapped to pitch bend, invalid rule: ${line}`)
      continue
    }

    const zeroBasedfromChannel = parseInt(fromChannel) - 1
    const zeroBasedtoChannel = parseInt(toChannel) - 1

    // pitch bend
    if (isFromPitchBend) {
      if (!redirects.pb) {
        redirects.pb = {}
      }

      redirects.pb[zeroBasedfromChannel] = zeroBasedtoChannel
      continue
    }

    // cc special case
    if (isFromCC && !redirects.cc) {
      redirects.cc = {}
    }

    const applicableRedirects = isFromCC
      ? redirects.cc
      : redirects

    // same for cc and note on/off
    if (!(zeroBasedfromChannel in applicableRedirects)) {
      applicableRedirects[zeroBasedfromChannel] = {}
    }

    applicableRedirects[zeroBasedfromChannel][fromNote] = [
      zeroBasedtoChannel,
      parseInt(toNote),
    ]
  }

  return redirects
}