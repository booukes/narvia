import { SitemapStream, streamToPromise } from 'sitemap'
import { createWriteStream } from 'fs'

const hostname = 'https://antworksnarvia.vercel.app'
const links = [
    { url: '/', changefreq: 'daily', priority: 1.0},
    { url: '/dashboard', changefreq: 'weekly' },
]

const stream = new SitemapStream({ hostname })
links.forEach(link => stream.write(link))
stream.end()

streamToPromise(stream).then(data => {
    const output = createWriteStream('./public/sitemap_index.xml')
    output.write(data)
    output.end()
    console.log('✅ Sitemap generated successfully!')
})
