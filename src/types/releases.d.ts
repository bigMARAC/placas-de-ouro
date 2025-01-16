declare module '../data/releases.json' {
  interface Release {
    version: string
    date: string
    type: 'major' | 'beta' | 'update' | 'first' | 'coming-soon'
    description: string
    features: string[]
  }

  interface ReleasesData {
    releases: Release[]
  }

  const value: ReleasesData
  export default value
}
