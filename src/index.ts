import { Character } from './lib/character.js';
import { Collection, CollectionType, Tomestones, TriadCollection, TriadType, TroveCollection } from './lib/collections.js';

class Nodecollect {
  public options: Nodecollect.Options = {};

  /**
   * A NodeJS handler for data collection for ffxivcollect.com.
   * @param [options] Optional nodecollect options.
   * @since 1.0.0
   *
   * @example
   * ```javascript
   * import { Nodecollect } from 'nodecollect';
   *
   * const nodecollect = new Nodecollect();
   * const data = await nodecollect.achievements.index(); // {}
   * ```
   *
   * @see https://ffxivcollect.com/
   */
  constructor(options: Nodecollect.Options = { language: 'en', verbose: false }) {
    const { language } = options;

    this.options = options;

    if (!language || !['en', 'fr', 'de', 'ja'].includes(language)) {
      throw Error(`Invalid language given, must be any of these: 'en', 'fr', 'de' or 'ja'.`);
    }
  }

  public achievements = new Collection(CollectionType.Achievements, this.options);
  public armoire = new Collection(CollectionType.Armoire, this.options);
  public bardings = new Collection(CollectionType.Bardings, this.options);
  public bluemagic = new Collection(CollectionType.Blue_Magic, this.options);
  public emotes = new Collection(CollectionType.Emotes, this.options);
  public fashion = new Collection(CollectionType.Fashion_Accessories, this.options);
  public framerkits = new Collection(CollectionType.Framer_Kits, this.options);
  public hairstyles = new Collection(CollectionType.Hairstyles, this.options);
  public leves = new Collection(CollectionType.Levequests, this.options);
  public minions = new Collection(CollectionType.Minions, this.options);
  public mounts = new Collection(CollectionType.Mounts, this.options);
  public orchestrions = new Collection(CollectionType.Orchestrions, this.options);
  public records = {
    field: new Collection(CollectionType.Field_Records, this.options),
    survey: new Collection(CollectionType.Survey_Records, this.options)
  };
  public relics = new Collection(CollectionType.Relics, this.options);
  public titles = new Collection(CollectionType.Titles, this.options);
  public tripletriad = {
    cards: new TriadCollection<CollectionType.Triple_Triad>(TriadType.Card, this.options),
    npcs: new TriadCollection<CollectionType.Triple_Triad>(TriadType.NPC, this.options),
    decks: new TriadCollection<CollectionType.Triple_Triad>(TriadType.Deck, this.options),
    packs: new TriadCollection<CollectionType.Triple_Triad>(TriadType.Pack, this.options)
  };
  public trove = new TroveCollection<CollectionType.Moogle_Treasure_Trove>(this.options);

  /**
   * Fetches the character.
   * @since 1.0.0
   * @param id The id of the character to fetch.
   * @returns The {@link Character} instance.
   *
   * @example
   * ```javascript
   * const chara = nodecollect.getCharacter(12345678); // or "12345678"
   *
   * await chara.show(); // {}
   * await chara.owned(); // []
   * await chara.missing(); // []
   * ```
   */
  public getCharacter(id: number | string): Character {
    if (!/(\d){8}/gm.test(`${id}`)) {
      throw new Error(
        'Invalid character ID provided, please see https://documenter.getpostman.com/view/1779678/TzXzDHM1#a5036338-e90e-4210-a6c0-f9c9e7b596a9'
      );
    }

    return new Character(id, this.options);
  }

  /**
   * Fetches the user's character.
   * @since 1.0.0
   * @param id The id of the user to fetch.
   * @returns The {@link Character} instance.
   *
   * @example
   * ```javascript
   * const user = nodecollect.getUser(12345678901234567); // or "12345678901234567"
   *
   * await user.show(); // {}
   * await user.owned(); // []
   * await user.missing(); // []
   * ```
   */
  public getUser(id: number | string): Character {
    if (!/(\d){17,}/gm.test(`${id}`)) {
      throw new Error(
        'Invalid user ID provided, please see https://documenter.getpostman.com/view/1779678/TzXzDHM1#829b2e1f-d5bd-4caa-857b-210dfdf76990'
      );
    }

    return new Character(id, this.options);
  }
}

declare namespace Nodecollect {
  /**
   * The options for {@link Nodecollect}
   * @since 1.0.0
   */
  export interface Options {
    /**
     * The language setting for {@link Nodecollect}
     * @since 1.0.0
     * @default "en" (English)
     */
    language?: 'en' | 'fr' | 'de' | 'ja';

    /**
     * @since 1.0.0
     * @default false
     */
    verbose?: boolean;
  }
}

export { Nodecollect, CollectionType, Tomestones };
