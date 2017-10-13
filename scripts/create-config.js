#!/usr/bin/env node

const path = require('path')
const load = require('load-json-file')
const write = require('write-json-file')

const moduleSidebarList = []
const completeModules = []

const documentationPath = path.join(__dirname, '..', 'configs', 'config-documentation.json')
const configPath = path.join(__dirname, '..', 'configs', 'config.json')
const templatePath = path.join(__dirname, '..', 'template', 'turf-template', 'src', 'assets', 'config.json')

load.sync(documentationPath).forEach(metadata => {
  const isHeading = metadata.kind === 'note'
  moduleSidebarList.push({
    isHeading: isHeading,
    name: metadata.name,
    hidden: false
  })
  if (!isHeading) {
    const parent = getParent(metadata.context.file)
    completeModules.push({
      name: metadata.name,
      description: getDescription(metadata),
      parent: parent,
      snippet: getSnippet(metadata),
      example: getExample(metadata),
      hasMap: hasMap(metadata),
      npmName: getNpmName(metadata, parent),
      returns: getReturns(metadata),
      params: getParams(metadata),
      throws: getThrows(metadata)
    })
  }
})

const config = {
  sidebar: moduleSidebarList,
  modules: completeModules
}
write.sync(configPath, config)
write.sync(templatePath, config)
console.log('Done compiling the config file')

function getParent (filePath) {
  if (filePath.includes('turf-helpers')) return 'helpers'
  if (filePath.includes('turf-meta')) return 'meta'
  if (filePath.includes('turf-invariant')) return 'invariant'
  return null
}

function getDescription (metadata) {
  return concatTags(metadata.description.children[0].children, true)
}

function getSnippet (metadata) {
  const example = metadata.examples[0]
  if (example) return example.description.split('\r\n//addToMap')[0]
  return false
}

function getExample (metadata) {
  const example = metadata.examples[0]
  if (example) return example.description
  return false
}

function hasMap (metadata) {
  const example = metadata.examples[0]
  if (example) return example.description.indexOf('//addToMap') !== -1
  return false
}

function getNpmName (metadata, parent) {
  if (parent !== null) return parent
  return metadata.name.replace(/([A-Z])/g, word => '-' + word.toLowerCase())
}

function getReturns (metadata) {
  return metadata.returns.map(result => {
    if (!result.description.children.length) return false
    return {
      type: getType(result.type),
      desc: concatTags(result.description.children[0].children, false)
    }
  })
}

function getThrows (metadata) {
  return metadata.throws.map(result => {
    if (!result.description.children.length) return false
    return {
      type: getType(result.type),
      desc: concatTags(result.description.children[0].children, false)
    }
  })
}

function getParams (metadata) {
  let outParams = metadata.params.map(param => {
    if (!param.type) return { type: null }
    if (!param.description.children.length) return false
    return {
      Argument: param.name,
      Type: getType(param.type),
      Description: concatTags(param.description.children[0].children, false),
      _lineNum: param.lineNumber
    }
  })
  outParams = outParams.filter(function (param) {
    return param.type !== null
  })
  const finalOut = outParams.sort(function (a, b) {
    return a._lineNum - b._lineNum
  })
  finalOut.forEach(function (param) {
    delete param._lineNum
  })
  return finalOut
}

function concatTags (inNode, addLink) {
  const outDescr = inNode.map(function (node) {
    if (node.children) {
      if (!addLink) return node.children[0].value
      let link = getLink(node.children[0].value)
      if (link === null || !node.jsdoc) link = node.url
      return '<a target="_blank" href="' + link + '">' + node.children[0].value + '</a>'
    }
    return node.value
  })
  return outDescr.join(' ').replace(' .', '.')
}

function getType (inNode) {
  if (inNode.type === 'UnionType') {
    return '( ' + inNode.elements.map(function (node) {
      return getType(node)
    }).join(' | ') + ' )'
  }
  if (inNode.type === 'OptionalType') return 'Optional: ' + inNode.expression.name
  if (typeof inNode.type === 'object') return inNode.name
  if (inNode.type === 'NameExpression') return inNode.name
  if (inNode.type === 'TypeApplication') {
    return inNode.expression.name + ' 〈' + inNode.applications.map(function (node) {
      return node.name
    }) + '〉'
  }
}

function getLink (name) {
  switch (name.toUpperCase()) {
    case 'POINT':
    case 'POINTS':
      return 'http://geojson.org/geojson-spec.html#point'
    case 'MULTIPOINT':
      return 'http://geojson.org/geojson-spec.html#multipoint'
    case 'LINESTRING':
    case '(MULTI)LINESTRING':
    case '(MULTI)LINESTRING(S)':
    case 'LINE':
      return 'http://geojson.org/geojson-spec.html#linestring'
    case 'MULTILINESTRING':
      return 'http://geojson.org/geojson-spec.html#multilinestring'
    case 'POLYGON':
    case 'POLYGON(S)':
    case '(MULTI)POLYGON':
      return 'http://geojson.org/geojson-spec.html#polygon'
    case 'MULTIPOLYGON':
      return 'http://geojson.org/geojson-spec.html#multipolygon'
    case 'GEOMETRY':
      return 'http://geojson.org/geojson-spec.html#geometry'
    case 'GEOMETRYCOLLECTION':
      return 'http://geojson.org/geojson-spec.html#geometrycollection'
    case 'FEATURE':
      return 'http://geojson.org/geojson-spec.html#feature-objects'
    case 'FEATURECOLLECTION':
      return 'http://geojson.org/geojson-spec.html#feature-collection-objects'
    case 'BBOX':
      return 'http://geojson.org/geojson-spec.html#bounding-boxes'
    default:
      return null
  }
}