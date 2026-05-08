import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/sanity/schemaTypes'
import {s3Files} from 'sanity-plugin-s3-files'
import {projectId, dataset} from './src/sanity/env'

export default defineConfig({
  name: 'default',
  title: 'Parallax Frames',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
    s3Files({
      credentials: {
        bucketKey: 'josa-assets',
        bucketRegion: 'auto',
        getSignedUrlEndpoint: typeof window !== 'undefined' ? `${window.location.origin}/api/s3` : 'http://localhost:3002/api/s3',
        deleteObjectEndpoint: typeof window !== 'undefined' ? `${window.location.origin}/api/s3` : 'http://localhost:3002/api/s3',
        folder: '',
        secretForValidating: '',
      },
    })
  ],
  schema: {
    types: schemaTypes,
  },
})
