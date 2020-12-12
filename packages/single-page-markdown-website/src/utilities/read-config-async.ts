import * as fs from 'fs-extra'
import * as path from 'path'

import { Config } from '../types'

const configKey = 'single-page-markdown-website'

const defaultConfig = {
  description: null,
  hideToc: false,
  links: [],
  title: null
}

export async function readConfigAsync(): Promise<Config> {
  const packageJsonFilePath = path.resolve(process.cwd(), 'package.json')
  if ((await fs.pathExists(packageJsonFilePath)) === false) {
    return defaultConfig
  }
  const packageJson = JSON.parse(await fs.readFile(packageJsonFilePath, 'utf8'))
  const packageJsonConfig = {
    description:
      typeof packageJson.description === 'undefined'
        ? null
        : packageJson.description,
    links:
      typeof packageJson.homepage === 'undefined'
        ? []
        : [
            {
              text: 'GitHub',
              url: packageJson.homepage
            }
          ],
    title: typeof packageJson.name === 'undefined' ? null : packageJson.name
  }
  const config = packageJson[configKey]
  return {
    ...defaultConfig,
    ...packageJsonConfig,
    ...(typeof config === 'undefined' ? {} : config)
  }
}
