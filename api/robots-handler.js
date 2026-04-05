export default function robotsHandler(req, res) {
    const baseUrl = 'https://space.makerlab.academy'; // Corrected Domain
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /lp
Disallow: /dist
Disallow: /node_modules

Sitemap: ${baseUrl}/sitemap.xml`;

    res.header('Content-Type', 'text/plain');
    res.send(robots);
}
