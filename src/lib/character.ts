import axios from 'axios';
import type { Nodecollect } from '../index.js';
import type { Collection } from './collections.js';

class Character {
  /**
   * @param type A character collection.
   * @param [options] The nodecollect options for collections.
   * @since 1.0.0
   */
  constructor(
    public id: number | string,
    public options: Nodecollect.Options = { language: 'en' }
  ) {}

  /**
   * @param path The URL path to fetch from.
   * @param [params] Optional filtering parameters, if appropriate.
   * @since 1.0.0
   */
  protected async req(path: string, params?: { [key: string]: number | string | boolean }): Promise<unknown | null> {
    try {
      const { data } = await axios({
        method: 'get',
        url: (params
          ? `https://ffxivcollect.com/api/${path}?`.concat(
              Object.keys(params)
                .map((key) =>
                  // @ts-ignore - will fix with typings
                  key === 'predicates' ? params[key] : `${key}=${params[key]}`
                )
                .join('&')
            )
          : `https://ffxivcollect.com/api/${path}`
        )
          .toLowerCase()
          .replace(/_(\w{2})_/gm, `_${this.options?.language}_`),
        responseType: 'json'
      });

      return data;
    } catch (error) {
      if (this.options?.verbose) console.error(error);
    }
    return null;
  }

  /**
   * Shows the data for this character.
   * @since 1.0.0
   * @param [params] Optional data parameters.
   * @returns {Promise<Character.Results>}
   *
   * @example
   * ```javascript
   * await character.show() // {}
   * await character.show({ language: "fr" }) // {}
   * ```
   */
  public async show(params?: { language?: 'en' | 'fr' | 'de' | 'ja'; ids?: boolean; times?: boolean; latest?: boolean }): Promise<Character.Results> {
    const data = await this.req(['characters', this.id].join('/'), params?.language ? params : { ...params, language: this.options.language });
    if (data === null) throw new Error();
    return data as Character.Results;
  }

  /**
   * Shows the owned data in the provided collection for this character.
   * @since 1.0.0
   * @param [params] Optional data parameters.
   * @returns {Promise<Collection.Result<T>[]>}
   *
   * @example
   * ```javascript
   * await character.owned(CollectionType.Achievements) // {}
   * await character.owned(CollectionType.Achievements, { latest: true }) // newer data
   * ```
   */
  public async owned<T extends keyof Collection.ResultTypes>(
    collection: T,
    params?: {
      language?: 'en' | 'fr' | 'de' | 'ja';
      latest?: boolean;
    }
  ): Promise<Collection.Result<T>[]> {
    const data = await this.req(
      ['characters', this.id, collection, 'owned'].join('/'),
      params?.language ? params : { ...params, language: this.options.language }
    );
    if (data === null) throw new Error();
    return data as Collection.Result<T>[];
  }

  /**
   * Shows the missing data in the provided collection for this character.
   * @since 1.0.0
   * @param [params] Optional data parameters.
   * @returns {Promise<Collection.Value<T>[]>}
   *
   * @example
   * ```javascript
   * await character.missing(CollectionType.Achievements) // {}
   * await character.missing(CollectionType.Achievements, { latest: true }) // newer data
   * ```
   */
  public async missing<T extends keyof Collection.ResultTypes>(
    collection: T,
    params?: {
      language?: 'en' | 'fr' | 'de' | 'ja';
      latest?: boolean;
    }
  ): Promise<Collection.Result<T>[]> {
    const data = await this.req(
      ['characters', this.id, collection, 'missing'].join('/'),
      params?.language ? params : { ...params, language: this.options.language }
    );
    if (data === null) throw new Error();
    return data as Collection.Result<T>[];
  }
}

namespace Character {
  interface Totals {
    count: number | null;
    total: number | null;
  }

  interface Rankings extends Totals {
    ranked_count: number | null;
    ranked_total: number | null;
    public: boolean;
  }

  interface RankingsAchievements extends Pick<Rankings, 'count' | 'public' | 'total'> {
    points: number | null;
    points_total: number | null;
    ranked_points_total: number | null;
    ranked_time: string;
  }

  export interface Results {
    id: number;
    name: `${string} ${string}`;
    server: string;
    data_center: string;
    portrait: string;
    avatar: string;
    last_parsed: string;
    verified: boolean;
    achievements: RankingsAchievements;
    mounts: Rankings;
    minions: Rankings;
    orchestrions: Totals;
    spells: Totals;
    emotes: Totals;
    bardings: Totals;
    hairstyles: Totals;
    armoires: Totals;
    fashions: Totals;
    records: Totals;
    survey_records: Totals;
    cards: Totals;
    npcs: Totals;
    rankings: {
      achievements: {
        server: number | null;
        data_center: number | null;
        global: number | null;
      };
      mounts: {
        server: number | null;
        data_center: number | null;
        global: number | null;
      };
      minions: {
        server: number | null;
        data_center: number | null;
        global: number | null;
      };
    };
    relics: {
      weapons: Totals;
      armor: Totals;
      tools: Totals;
    };
    leves: {
      battlecraft: Totals;
      tradecraft: Totals;
      fieldcraft: Totals;
    };
  }
}

export { Character };
