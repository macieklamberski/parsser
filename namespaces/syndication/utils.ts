import type { ParseFunction } from '../../common/types'
import { hasAnyProps, isObject, parseNumber, parseString } from '../../common/utils'
import type { Feed } from './types'

export const retrieveFeed: ParseFunction<Feed> = (value, level) => {
  if (!isObject(value)) {
    return
  }

  const feed = {
    updatePeriod: parseString(value['sy:updatePeriod']?.['#text'], level),
    updateFrequency: parseNumber(value['sy:updateFrequency']?.['#text'], level),
    updateBase: parseString(value['sy:updateBase']?.['#text'], level),
  }

  if (hasAnyProps(feed, Object.keys(feed) as Array<keyof Feed>)) {
    return feed
  }
}
