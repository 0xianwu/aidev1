import NodeCoinGeckoTrending from '../node_coingecko_trending.js';
import { jest } from '@jest/globals';

describe('NodeCoinGeckoTrending', () => {
  let scraper;

  beforeAll(async () => {
    scraper = new NodeCoinGeckoTrending();
    await scraper.initialize();
  });

  afterAll(async () => {
    await scraper.close();
  });

  test('should scrape trending coins', async () => {
    const markdown = await scraper.getTrendingMarkdown();
    expect(markdown).toContain('Trending Cryptocurrencies');
    expect(markdown.length).toBeGreaterThan(1000);
  });

  test('should generate parsing instructions', () => {
    const sample = '| Rank | Name | Symbol |';
    const instructions = scraper.getParsingInstructions(sample);
    expect(instructions).toContain('Convert to JSON format');
  });
});