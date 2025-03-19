import { describe, expect, it } from 'bun:test'
import { parse } from './parse'

describe('parse', () => {
  const versions = {
    '090': '0.90',
    '091': '0.91',
    '092': '0.92',
    '093': '0.93',
    '094': '0.94',
    '20': '2.0',
    ns: 'with namespaces',
  }

  for (const [key, label] of Object.entries(versions)) {
    it(`should correctly parse RSS ${label}`, async () => {
      const reference = `${import.meta.dir}/references/rss-${key}`
      const input = await Bun.file(`${reference}.xml`).text()
      const expectation = await Bun.file(`${reference}.json`).json()
      const result = parse(input)

      expect(result).toEqual(expectation)
    })
  }

  it('should correctly parse RSS with mixed case tags', async () => {
    const input = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rSs version="2.0">
        <ChAnNeL>
          <TiTlE>Mixed Case Feed</TiTlE>
          <LiNk>https://example.com/</LiNk>
          <DeScRiPtIoN>A test feed with mixed case tags</DeScRiPtIoN>
          <category DOMAin="http://www.example.com/cusips">Cat 1</category>
          <ITEM>
            <TiTlE>First Item</TiTlE>
            <LiNk>https://example.com/item1</LiNk>
            <DeScRiPtIoN>Description of first item</DeScRiPtIoN>
            <PuBdAtE>Mon, 01 Jan 2024 12:00:00 GMT</PuBdAtE>
          </ITEM>
          <item>
            <title>Second Item</title>
            <link>https://example.com/item2</link>
            <description>Description of second item</description>
            <pubDate>Tue, 02 Jan 2024 12:00:00 GMT</pubDate>
          </item>
        </ChAnNeL>
      </rSs>
    `
    const expectation = {
      title: 'Mixed Case Feed',
      link: 'https://example.com/',
      description: 'A test feed with mixed case tags',
      categories: [{ name: 'Cat 1', domain: 'http://www.example.com/cusips' }],
      items: [
        {
          title: 'First Item',
          link: 'https://example.com/item1',
          description: 'Description of first item',
          pubDate: 'Mon, 01 Jan 2024 12:00:00 GMT',
        },
        {
          title: 'Second Item',
          link: 'https://example.com/item2',
          description: 'Description of second item',
          pubDate: 'Tue, 02 Jan 2024 12:00:00 GMT',
        },
      ],
    }
    const result = parse(input)

    expect(result).toEqual(expectation)
  })
})
