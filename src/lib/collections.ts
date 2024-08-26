import axios from 'axios';
import type { Nodecollect } from '../index.js';

enum CollectionType {
  Achievements = 'achievements',
  Titles = 'titles',
  Mounts = 'mounts',
  Minions = 'minions',
  Orchestrions = 'orchestrions',
  Blue_Magic = 'spells',
  Hairstyles = 'hairstyles',
  Emotes = 'emotes',
  Bardings = 'bardings',
  Armoire = 'armoires',
  Fashion_Accessories = 'fashions',
  Framer_Kits = 'frames',
  Triple_Triad = 'triad',
  Field_Records = 'records',
  Survey_Records = 'survey records',
  Relics = 'relics',
  Levequests = 'leves',
  Moogle_Treasure_Trove = 'tomestones'
}

enum Tomestones {
  Philosophy = 'philosophy',
  Mythology = 'mythology',
  Soldiery = 'soldiery',
  Law = 'law',
  Esoterics = 'esoterics',
  Pageantry = 'pageantry',
  Lore = 'lore',
  Scripture = 'scripture',
  Verity = 'verity',
  Creation = 'creation',
  Mendacity = 'mendacity',
  Tenfold_Pageantry = 'tenfold pageantry',
  Genesis_I = 'genesis I',
  Genesis_II = 'genesis II'
}

enum TriadType {
  Card = 'cards',
  Deck = 'decks',
  NPC = 'npcs',
  Pack = 'packs'
}

class BaseCollection<T extends keyof Collection.ResultTypes> {
  /**
   * @param type The type of collection to fetch.
   * @param [options] The nodecollect options for collections.
   * @since 1.0.0
   */
  constructor(
    public readonly type: T,
    public readonly options: Nodecollect.Options = {
      language: 'en',
      verbose: false
    }
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
          ? `https://ffxivcollect.com/api/${path.replace(/ /gm, '_')}?`.concat(
              Object.keys(params)
                .map((key) => `${key}=${params[key]}`)
                .join('&')
            )
          : `https://ffxivcollect.com/api/${path.replace(/ /gm, '_')}`
        )
          .toLowerCase()
          .replace(/_(\w{2})_/gm, `_${params?.language ?? 'en'}_`),
        responseType: 'json'
      });

      if (data.status === 404) return null;
      return data;
    } catch (error) {
      if (this.options?.verbose) console.error(error);
    }

    return null;
  }

  /**
   * Indexes all data within the collection.
   * @param [params] Optional filtering parameters, if appropriate.
   * @returns {Promise<Collection.Results<Collection.Result<T>>>}
   *
   * @example
   * ```javascript
   * await collection.index() // {}
   * await collection.index({ limit: 10 }) // {}
   * ```
   *
   * @example
   * ```javascript
   * // Finds all items in collection from Eureka added after Patch 4.1
   * await collection.index({
   *    description_en_cont: "Eureka",
   *    patch_gt: 4.1,
   *    language: "en" // optional, defaults to 'options.language'
   * }) // {}
   * ```
   *
   */
  public async index(params?: { [key: string]: number | string | boolean }): Promise<Collection.Results<Collection.Result<T>>> {
    const data = await this.req([this.type].join('/'), {
      ...params,
      language: params?.language ?? this.options.language ?? 'en'
    });
    if (data === null) throw new Error();
    return data as Collection.Results<Collection.Result<T>>;
  }
}

class Collection<T extends keyof Collection.ResultTypes> extends BaseCollection<T> {
  constructor(
    public readonly type: T,
    public readonly options: Nodecollect.Options = {
      language: 'en'
    }
  ) {
    super(type, options);
  }

  /**
   * Shows a specific data set.
   * @since 1.0.0
   * @param id The id for the Collection.
   * @param [params] Optional filtering parameters, if appropriate.
   * @returns {Promise<Collection.Result<T>>}
   *
   * @example
   * ```javascript
   * await collection.show(595) // {}
   * await collection.show("325") // {}
   * ```
   */
  public async show(
    id: number | string,
    params?: {
      language: 'en' | 'fr' | 'de' | 'ja';
    }
  ): Promise<Collection.Result<T>> {
    const data = await this.req([this.type, id].join('/'), {
      language: params?.language ?? this.options.language ?? 'en'
    });
    if (data === null) throw new Error();
    return data as Collection.Result<T>;
  }

  /**
   * Searches all the data within the collection.
   * @param query Name of data to search for.
   * @param [params] Optional filtering parameters, if appropriate.
   * @returns {Promise<Collection.Results<Collection.Result<T>>>}
   *
   * @example
   * ```javascript
   * await collection.search('apple') // {}
   * await collection.search('apple', { limit: 10 }) // {}
   * ```
   *
   * @see {@link Collection.index} for advanced data searching.
   */
  public async search(query: string, params?: { [key: string]: number | string | boolean }): Promise<Collection.Results<Collection.Result<T>>> {
    return this.index({
      name_en_cont: query,
      language: params?.language ?? this.options.language ?? 'en',
      ...params
    });
  }
}

class TroveCollection<T extends keyof Collection.ResultTypes> extends BaseCollection<T> {
  constructor(options?: Nodecollect.Options) {
    super(CollectionType.Moogle_Treasure_Trove as T, options);
  }

  /**
   * Searches through all data within the moogle treasure trove collection.
   * @param query Name of data to search for.
   * @param [params] Optional filtering parameters, if appropriate.
   * @returns {Promise<Collection.Results<Collection.Result<T>>>}
   *
   * @example
   * ```javascript
   * await trove.search('apple') // {}
   * await trove.search('apple', { limit: 10 }) // {}
   * ```
   *
   * @see {@link Collection.index} for advanced data searching.
   */
  public async search(
    tomestone: Tomestones | string,
    params?: { language: 'en' | 'fr' | 'de' | 'ja' }
  ): Promise<Collection.Results<Collection.Result<T>>> {
    const data = await this.req([super.type].join('/'), {
      tomestone_eq: tomestone,
      language: params?.language ?? this.options.language ?? 'en'
    });
    if (data === null) throw new Error();
    return data as Collection.Results<Collection.Result<T>>;
  }
}

class TriadCollection<T extends keyof Collection.ResultTypes> extends BaseCollection<T> {
  protected triad_type: TriadType;

  /**
   * @param type The type of collection to fetch.
   * @param [options] The nodecollect options for collections.
   * @since 1.0.0
   */
  constructor(type: TriadType, options?: Nodecollect.Options) {
    super(CollectionType.Triple_Triad as T, options);
    this.triad_type = type;
  }

  /**
   * Shows a specific set of data in the triple triad collection.
   * @since 1.0.0
   * @param id The id for the Collection.
   * @returns {Promise<Collection.Result<T>>}
   *
   * @example
   * ```javascript
   * await collection.show(595) // {}
   * await collection.show("325") // {}
   * ```
   */
  public async show(id: number | string, params?: { [key: string]: number | string | boolean }): Promise<Collection.Result<T>> {
    const data = await this.req([CollectionType.Triple_Triad, this.triad_type, id].join('/'), { ...params, language: this.options.language! });
    if (data === null) throw new Error();
    return data as Collection.Result<T>;
  }

  /**
   * Indexes all data within the triple triad collection.
   * @param [params] Optional filtering parameters, if appropriate.
   * @returns {Promise<Collection.Results<Collection.Result<T>>>}
   *
   * @example
   * ```javascript
   * await trove.index() // {}
   * await trove.index({ limit: 10 }) // {}
   * ```
   *
   * @example
   * ```javascript
   * // Finds all items in collection from Eureka added after Patch 4.1
   * await trove.index({
   *    description_en_cont: "Eureka",
   *    patch_gt: 4.1,
   *    language: "en" // optional, defaults to 'options.language'
   * }) // {}
   * ```
   *
   */
  public async index(params?: { [key: string]: number | string | boolean }): Promise<Collection.Results<Collection.Result<T>>> {
    const data = await this.req([CollectionType.Triple_Triad, this.triad_type].join('/'), { ...params, language: this.options?.language ?? 'en' });
    if (data === null) throw new Error();
    return data as Collection.Results<Collection.Result<T>>;
  }

  /**
   * Searches through all data within the triple triad collection.
   * @param query Name of data to search for.
   * @param [params] Optional filtering parameters, if appropriate.
   * @returns {Promise<Collection.Results<Collection.Result<T>>>}
   *
   * @example
   * ```javascript
   * await trove.search('apple') // {}
   * await trove.search('apple', { limit: 10 }) // {}
   * ```
   *
   * @see {@link Collection.index} for advanced data searching.
   */
  public async search(query: string, params?: { [key: string]: number | string | boolean }): Promise<Collection.Results<Collection.Result<T>>> {
    return this.index({ name_en_cont: query, ...params });
  }
}

namespace Collection {
  interface Source {
    type: string;
    text: string;
    related_type: string | null;
    related_id: number | null;
  }

  interface Partial {
    id: number;
    name: string;
    description: string;
    patch: `${number}.${number}${number | ''}`;
    owned: `${number}${number}%` | `${number}.${number}%`;
    icon: string;
  }

  namespace Achievement {
    export interface Base extends Partial {
      points: number;
      category: { id: number; name: string };
      type: { id: number; name: string };
      reward: { type: string; name: string };
    }

    export interface WithTitle extends Omit<Base, 'reward'> {
      reward: { type: string; title: Title };
    }
  }

  namespace Item {
    export interface Base extends Partial {
      image: string;
      item_id: number | null;
      tradeable: boolean;
      sources: Source[];
    }

    export interface Minion extends Base {
      enhanced_description: string;
      tooltip: string;
      behavior: { id: number; name: string };
      race: { id: number; name: string };
      verminion: {
        cost: number;
        attack: number;
        defense: number;
        hp: number;
        speed: number;
        area_attack: boolean;
        skill: string;
        skill_description: string;
        skill_angle: number;
        skill_cost: number;
        eye: boolean;
        gate: boolean;
        shield: boolean;
        skill_type: { id: number; name: string };
      };
    }

    export interface Mount extends Base {
      enhanced_description: string;
      tooltip: string;
      movement: string;
      seats: number;
      order: number;
      order_group: number;
      bgm: string | null;
    }

    export interface Emote extends Omit<Base, 'image'> {
      command: `/${string}`;
      category: { id: number; name: string };
    }

    export interface FramerKit extends Omit<Base, 'source'> {}

    export interface Orchestrion extends Omit<Base, 'sources' | 'image'> {
      number: string;
      category: { id: number; name: string };
    }

    export interface Relic extends Omit<Partial, 'patch' | 'description'> {
      achievement_id: number;
      type: {
        name: string;
        category: string;
        jobs: number;
        order: number;
        expansion: number;
      };
    }
  }

  namespace Record {
    interface Base extends Partial {
      image: string;
      sources: Source[];
    }

    export interface Field extends Base {
      rarity: number;
      location: string;
      linked_record_id: number | null;
    }

    export interface Survey extends Base {
      solution: string;
      dungeon: string;
    }
  }

  namespace Trove {
    interface Item extends Pick<Item.Base, 'id' | 'name' | 'tradeable'> {
      type: string;
      tomestone: string;
      cost: number;
    }

    interface Collectable extends Item {
      sources: Source[];
    }

    export interface Results {
      collectables: Collectable[];
      items: Item[];
    }
  }

  namespace Triad {
    export interface Card extends Omit<Item.Base, 'item_id' | 'tradeable'> {
      stars: number;
      sell_price: string;
      order_group: number;
      order: number;
      deck_group: number;
      number: string;
      image_red: string;
      image_blue: string;
      link: string;
      stats: {
        numeric: { top: number; right: number; bottom: number; left: number };
        formatted: { top: number; right: number; bottom: number; left: number };
      };
      type: { id: number; name: string; image: string | null };
    }

    export interface NPC extends Omit<Partial, 'description'> {
      resident_id: number;
      difficulty: number;
      excluded: boolean;
      link: string;
      location: { name: string; region: string; x: string; y: string };
      quest: { id: number; name: string; link: string };
      rules: string[];
      rule_ids: number[];
      rewards: Card[];
    }

    export interface Deck {
      id: number;
      notes: string;
      rating: number;
      user: string;
      updated: boolean;
      purpose: { type: string; name: string };
      cards: Card[];
    }

    export interface Pack {
      id: number;
      name: string;
      cost: number;
      link: string;
      cards: Card[];
    }
  }

  interface Title extends Omit<Partial, 'description'> {
    female_name: string;
    achievement?: Achievement.Base;
  }

  interface Levequest extends Pick<Partial, 'id' | 'name' | 'patch'> {
    level: number;
    cost: number;
    issuer: string;
    location: { name: string; region: string; x: string; y: string };
    craft: string;
    category: string;
    item: { id: number | null; name: string | null; quantity: number | null };
  }

  interface Bluemagic extends Partial {
    tooltip: string;
    order: number;
    rank: number;
    type: { id: number; name: string };
    aspect: { id: number; name: string };
    sources: Source[];
  }

  export interface Results<T extends Partial | unknown = unknown> {
    query: { [key: string]: string | boolean };
    count: number;
    results: T[];
  }

  export interface ResultTypes {
    achievements: Achievement.Base | Achievement.WithTitle;
    titles: Title;
    mounts: Item.Mount;
    minions: Item.Minion;
    orchestrions: Item.Orchestrion;
    spells: Bluemagic;
    hairstyles: Item.Base;
    emotes: Item.Emote;
    bardings: Item.Base;
    armoires: Item.Base;
    fashions: Item.Base;
    frames: Item.FramerKit;
    triad: Triad.Card | Triad.Deck | Triad.NPC | Triad.Pack;
    records: Record.Field;
    'survey records': Record.Survey;
    relics: Item.Relic;
    leves: Levequest;
    tomestones: Trove.Results;
  }

  export type Result<T extends keyof ResultTypes> = ResultTypes[T];
}

export { CollectionType, Tomestones, TriadType, Collection, TroveCollection, TriadCollection };
