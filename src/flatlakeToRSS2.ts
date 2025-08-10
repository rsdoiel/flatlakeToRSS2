/**
 * flatlakeToRSS2.ts translate a FlatLake JSON API document to RSS2 XML.
 *  
 *  Copyright (C) 2025  R. S. Doiel
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// Define the structure of your input data
export interface Post {
  content: string;
  data: {
    abstract: string;
    author: string;
    dateCreated?: string;
    dateModified?: string;
    datePublished?: string;
    keywords: string[];
    pubDate?: string;
    title: string;
    url: string;
  };
}

// Define the structure of the RSS feed
export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  items: RSSItem[];
}

export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author: string;
  categories: string[];
}

// Function to convert JSON data to RSS feed with YAML configuration
export function convertToRSS(
  posts: Post[],
  channelInfo: Partial<RSSFeed>,
): RSSFeed {
  const feed: RSSFeed = {
    title: channelInfo.title || "My Blog",
    description: channelInfo.description || "A collection of blog posts",
    link: channelInfo.link || "http://example.com",
    language: channelInfo.language,
    copyright: channelInfo.copyright,
    managingEditor: channelInfo.managingEditor,
    webMaster: channelInfo.webMaster,
    items: [],
  };

  posts.forEach((post) => {
    const item: RSSItem = {
      title: post.data.title,
      description: post.data.abstract,
      link: `http://example.com/${post.data.url}`,
      pubDate: new Date(
        post.data.datePublished || post.data.pubDate || post.data.dateCreated ||
          post.data.dateModified || Date.now(),
      ).toUTCString(),
      author: post.data.author,
      categories: post.data.keywords,
    };
    feed.items.push(item);
  });

  return feed;
}

// Function to generate the RSS XML
export function generateRSS(feed: RSSFeed): string {
  const itemsXML = feed.items
    .map(
      (item) => `
        <item>
            <title><![CDATA[${item.title}]]></title>
            <description><![CDATA[${item.description}]]></description>
            <link>${item.link}</link>
            <pubDate>${item.pubDate}</pubDate>
            <author>${item.author}</author>
            ${
        item.categories.map((category) => `<category>${category}</category>`)
          .join("")
      }
        </item>
    `,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title><![CDATA[${feed.title}]]></title>
        <description><![CDATA[${feed.description}]]></description>
        <link>${feed.link}</link>
        ${feed.language ? `<language>${feed.language}</language>` : ""}
        ${feed.copyright ? `<copyright>${feed.copyright}</copyright>` : ""}
        ${
    feed.managingEditor
      ? `<managingEditor>${feed.managingEditor}</managingEditor>`
      : ""
  }
        ${feed.webMaster ? `<webMaster>${feed.webMaster}</webMaster>` : ""}
        ${itemsXML}
    </channel>
</rss>`;
}
