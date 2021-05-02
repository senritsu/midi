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

  it('should replace aliases', () => {
    const script = `
alias foo=1:2,bar=4
alias baz=9

foo => 3:bar
baz:7 => 7:7
`
    const redirects = parseRedirectScript(script)

    // NOTE channels are zerobased internally, so 0 instead of 1
    expect(Object.keys(redirects)).toEqual(['0', '8'])
    expect(Object.keys(redirects[0])).toEqual(['2'])
    // NOTE channels are zerobased internally, so 2 instead of 3
    expect(redirects[0][2]).toEqual([2, 4])
    expect(Object.keys(redirects[8])).toEqual(['7'])
    expect(redirects[8][7]).toEqual([6, 7])
  })

  it('should parse CC redirects', () => {
    const script = `
1:2 => 3:4
1:CC12 => 3:CC24
`
    const redirects = parseRedirectScript(script)

    // NOTE channels are zerobased internally, so 0 instead of 1
    expect(Object.keys(redirects)).toEqual(['0', 'cc'])
    expect(Object.keys(redirects[0])).toEqual(['2'])
    // NOTE channels are zerobased internally, so 2 instead of 3
    expect(redirects[0][2]).toEqual([2, 4])
    expect(Object.keys(redirects.cc)).toEqual(['0'])
    expect(Object.keys(redirects.cc[0])).toEqual(['12'])
    expect(redirects.cc[0][12]).toEqual([2, 24])
  })

  it('should parse pitch bend redirects', () => {
    const script = `
1:2 => 3:4
1:PB => 3:PB
`
    const redirects = parseRedirectScript(script)

    // NOTE channels are zerobased internally, so 0 instead of 1
    expect(Object.keys(redirects)).toEqual(['0', 'pb'])
    expect(Object.keys(redirects[0])).toEqual(['2'])
    // NOTE channels are zerobased internally, so 2 instead of 3
    expect(redirects[0][2]).toEqual([2, 4])
    expect(Object.keys(redirects.pb)).toEqual(['0'])
    expect(redirects.pb[0]).toEqual(2)
  })
})