import axios from 'axios';
import * as cheerio from 'cheerio';
import { Word, Language } from '../../types';
import { APIError } from './config';
import { extractMeaning } from './meaningExtractor';
import { extractEtymology } from './etymologyExtractor';
import { extractCognates } from './cognateExtractor';

const WIKTIONARY_API = '/api/wiktionary';

export async function searchWiktionary(word: string, language: Language): Promise<Word | null> {
  try {
    const params = {
      action: 'parse',
      format: 'json',
      page: word,
      prop: 'text|sections',
      origin: '*'
    };

    const response = await axios.get(WIKTIONARY_API, { params });
    const data = response.data;

    if (!data.parse?.text['*']) {
      return null;
    }

    const $ = cheerio.load(data.parse.text['*']);
    const meaning = extractMeaning($, language);
    
    if (!meaning) {
      return null;
    }

    const etymology = extractEtymology($, word, language);
    const cognates = extractCognates($);

    return {
      word,
      language,
      meaning,
      etymology,
      cognates
    };
  } catch (error) {
    console.error('Error in searchWiktionary:', error);
    return null;
  }
}