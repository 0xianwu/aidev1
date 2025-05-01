import puppeteer from 'puppeteer';
import { marked } from 'marked';

class NodeCoinGeckoTrending {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async scrapeTrendingCoins() {
    try {
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      console.log('Navigating to CoinGecko...');
      await page.goto('https://www.coingecko.com/en/highlights/trending-crypto', {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      await page.waitForSelector('table', { timeout: 60000 });
      
      const htmlContent = await page.content();
      await page.close();
      
      // Convert HTML to Markdown
      const markdown = marked.parse(htmlContent);
      
      return markdown;
    } catch (error) {
      console.error('Scraping failed:', error);
      throw error;
    }
  }

  async getTrendingMarkdown() {
    /**
     * Retrieve a Markdown document containing the CoinGecko trending cryptocurrencies page.
     * 
     * @returns {Promise&lt;string&gt;} A Markdown-formatted document with:
     * - Page headers and text
     * - Table of trending cryptocurrencies (Rank, Name, Symbol, Price, etc.)
     * - Additional page content
     */
    if (!this.browser) await this.initialize();
    return await this.scrapeTrendingCoins();
  }

  getParsingInstructions(markdown) {
    /**
     * Provides instructions for parsing the trending coins table from Markdown
     * 
     * @param {string} markdown - The scraped Markdown content
     * @returns {string} LLM parsing instructions
     */
    return `
The following Markdown document contains the CoinGecko trending cryptocurrencies page:

${markdown}

Instructions:
1. Extract the table with columns: Rank, Name, Symbol, Price, 1h Change, 24h Change, 7d Change, 24h Volume, Market Cap
2. Convert to JSON format with fields: rank, name, symbol, price, change_1h, change_24h, change_7d, volume_24h, market_cap
3. Include only the structured data, no Markdown formatting`;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Example usage
async function main() {
  const scraper = new NodeCoinGeckoTrending();
  try {
    const markdown = await scraper.getTrendingMarkdown();
    console.log('Markdown content:', markdown.substring(0, 500) + '...');
    
    const instructions = scraper.getParsingInstructions(markdown);
    console.log('\nParsing instructions:', instructions.substring(0, 300) + '...');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await scraper.close();
  }
}

// Uncomment to test
// main();

export default NodeCoinGeckoTrending;