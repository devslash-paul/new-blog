import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Node } from 'unist'
import getConfig from 'next/config'

interface ImageNode extends Node {
  type: string
  url?: string
  tagName?: string
  properties?: {
    src?: string
  }
}

const { publicRuntimeConfig } = getConfig()

const remarkImagePrefix: Plugin = () => {
  return (tree) => {
    visit(tree, (node: ImageNode) => {
      // Handle markdown image nodes
      if (node.type === 'image' && node.url?.startsWith('/')) {
        node.url = `${publicRuntimeConfig.basePath}${node.url}`
      }
      // Handle HTML image elements
      if (node.type === 'element' && node.tagName === 'img' && node.properties?.src?.startsWith('/')) {
        node.properties.src = `${publicRuntimeConfig.basePath}${node.properties.src}`
      }
    })
  }
}

export default remarkImagePrefix 