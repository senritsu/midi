import parseRedirectScript from './parse-redirect-script'

describe('parseRedirectScript', () => {
  it('should parse channel+note redirects', () => {
    const script = `
1:2 => 3:4
`
    const redirects = parseRedirectScript(script)

    // NOTE channels are zerobased internally, so 0 instead of 1
    expect(Object.keys(redirects)).toEqual(['0'])
    expect(Object.keys(redirects[0])).toEqual(['2'])
    // NOTE channels are zerobased internally, so 2 instead of 3
    expect(redirects[0][2]).toEqual([2, 4])
  })

  it('should ignore empty lines and comments', () => {
    const script = `
1:2 => 3:4

# 3:4 => 10:11
5:6 => 7:8
`
    const redirects = parseRedirectScript(script)

    // NOTE channels are zerobased internally, so 0 and 4 instead of 1 and 5
    expect(Object.keys(redirects)).toEqual(['0', '4'])
  })

  it('should ignore incomplete lines', () => {
    const script = `
1:2 => 3:4
5:6 =>
`
    const redirects = parseRedirectScript(script)

    // NOTE channels are zerobased internally, so 0 instead of 1
    expect(Object.keys(redirects)).toEqual(['0'])
  })
})