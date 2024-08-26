// Similar test formatting as @joshdb/autoensure.
// See https://github.com/josh-development/middlewares/main/packages/auto-ensure/tests/lib/AutoEnsureMiddleware.test.ts
// @ts-ignore
import { CollectionType, Nodecollect } from '../../src';

describe('Nodecollect', () => {
  describe('is a class', () => {
    test('GIVEN typeof Nodecollect THEN returns function', () => {
      expect(typeof Nodecollect).toBe('function');
    });
    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof Nodecollect.prototype).toBe('object');
    });
  });

  describe('can fetch collections', () => {
    const nodecollect = new Nodecollect();

    // achievements
    describe('achievements', () => {
      test('GIVEN show w/ id THEN returns object', async () => {
        const data = await nodecollect.achievements.show(1);

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('id', 1);
      });

      test('GIVEN index w/o params THEN returns object', async () => {
        const data = await nodecollect.achievements.index();

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('query');
        expect(data).toHaveProperty('count');
        expect(data).toHaveProperty('results');
      });

      test('GIVEN index w/ predicate THEN returns object', async () => {
        const data = await nodecollect.achievements.index({ description_en_cont: 'defeat' });

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('query', { description_en_cont: 'defeat', language: 'en' });
      });

      test('GIVEN search w/o params THEN returns object', async () => {
        const data = await nodecollect.achievements.search('world');

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
      });

      test('GIVEN search w/ limit THEN returns object', async () => {
        const data = await nodecollect.achievements.search('free market', { limit: 10 });

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data.count).toBeLessThanOrEqual(10);
      });
    });

    // titles
    describe('titles', () => {
      test('GIVEN show w/ id THEN returns object', async () => {
        const data = await nodecollect.titles.show(1);

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('id', 1);

        const { achievement } = data;

        expect(achievement).toBeDefined();
        expect(achievement?.id).toBeDefined();
        expect(achievement?.name).toBeDefined();
        expect(achievement?.description).toBeDefined();
      });

      test('GIVEN index w/o params THEN returns object', async () => {
        const data = await nodecollect.titles.index();

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('query');
        expect(data).toHaveProperty('count');
        expect(data).toHaveProperty('results');

        const { achievement } = data.results[0];

        expect(achievement).toBeDefined();
        expect(achievement?.id).toBeDefined();
        expect(achievement?.name).toBeDefined();
        expect(achievement?.description).toBeDefined();
      });

      test('GIVEN index w/ predicate THEN returns object', async () => {
        const data = await nodecollect.titles.index({ patch_lt: '6.1' });

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('query', { patch_lt: '6.1', language: 'en' });

        const { achievement } = data.results[0];

        expect(achievement).toBeDefined();
        expect(achievement?.id).toBeDefined();
        expect(achievement?.name).toBeDefined();
        expect(achievement?.description).toBeDefined();
      });

      test('GIVEN search w/o params THEN returns object', async () => {
        const data = await nodecollect.titles.search('world');

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');

        const { achievement } = data.results[0];

        expect(achievement).toBeDefined();
        expect(achievement?.id).toBeDefined();
        expect(achievement?.name).toBeDefined();
        expect(achievement?.description).toBeDefined();
      });

      test('GIVEN search w/ limit THEN returns object', async () => {
        const data = await nodecollect.titles.search('world', { limit: 10 });

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data.count).toBeLessThanOrEqual(10);

        const { achievement } = data.results[0];

        expect(achievement).toBeDefined();
        expect(achievement?.id).toBeDefined();
        expect(achievement?.name).toBeDefined();
        expect(achievement?.description).toBeDefined();
      });
    });

    // item collections
    describe.each([
      { name: 'armoire', id: 1, search: "healer's", params: { limit: { limit: 10 }, predicate: { name_en_cont: 'gallant' } } },
      { name: 'bardings', id: 1, search: 'barding', params: { limit: { limit: 10 }, predicate: { name_en_cont: 'saddle' } } },
      { name: 'emotes', id: 59, search: 'dance', params: { limit: { limit: 10 }, predicate: { patch_gteq: '2.2' } } },
      { name: 'fashion', id: 1, search: 'wings', params: { limit: { limit: 10 }, predicate: { description_en_cont: 'pixie' } } },
      { name: 'framerkits', id: 156, search: 'simple', params: { limit: { limit: 10 }, predicate: { patch_lt: '7' } } },
      { name: 'hairstyles', id: 228, search: 'battle-ready bobs', params: { limit: { limit: 1 }, predicate: { description_en_cont: 'scion' } } },
      { name: 'minions', id: 3, search: 'mammet', params: { limit: { limit: 10 }, predicate: { name_en_cont: 'tiny' } } },
      { name: 'mounts', id: 1, search: 'lanner', params: { limit: { limit: 10 }, predicate: { movement_en_cont: 'airborne' } } },
      { name: 'orchestrions', id: 13, search: 'world', params: { limit: { limit: 10 }, predicate: { category_name_en_eq: 'raids i' } } },
      { name: 'relics', id: 40950, search: 'elemental', params: { limit: { limit: 10 }, predicate: { type_expansion_en_eq: '4' } } }
    ])('$name', (c) => {
      test('GIVEN show w/ id THEN returns object', async () => {
        // @ts-ignore
        const data = await nodecollect[c.name].show(c.id);

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('id', c.id);
      });

      test('GIVEN index w/o params THEN returns object', async () => {
        // @ts-ignore
        const data = await nodecollect[c.name].index();

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('query');
        expect(data).toHaveProperty('count');
        expect(data).toHaveProperty('results');
      });

      test('GIVEN index w/ predicate THEN returns object', async () => {
        // @ts-ignore
        const data = await nodecollect[c.name].index(c.params.predicate);

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('query', Object.assign({ language: 'en' }, c.params.predicate));
      });

      test('GIVEN search w/o params THEN returns object', async () => {
        // @ts-ignore
        const data = await nodecollect[c.name].search(c.search);

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
      });

      test('GIVEN search w/ limit THEN returns object', async () => {
        // @ts-ignore
        const data = await nodecollect[c.name].search(c.search, c.params.limit);

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');
        expect(data.count).toBeLessThanOrEqual(10);
      });
    });

    // records
    describe('records', () => {
      describe('field_records', () => {
        test('GIVEN show w/ id THEN returns object', async () => {
          const data = await nodecollect.records.field.show(1);

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data).toHaveProperty('id', 1);

          const { rarity, sources } = data;

          expect(rarity).toBeDefined();
          expect(sources).toBeDefined();
        });

        test('GIVEN index w/o params THEN returns object', async () => {
          const data = await nodecollect.records.field.index();

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data).toHaveProperty('query');
          expect(data).toHaveProperty('count');
          expect(data).toHaveProperty('results');

          const { rarity, sources } = data.results[0];

          expect(rarity).toBeDefined();
          expect(sources).toBeDefined();
        });

        test('GIVEN index w/ predicate THEN returns object', async () => {
          const data = await nodecollect.records.field.index({ description_en_cont: 'race: hrothgar' });

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data).toHaveProperty('query', { description_en_cont: 'race: hrothgar', language: 'en' });

          const { rarity, sources } = data.results[0];

          expect(rarity).toBeDefined();
          expect(sources).toBeDefined();
        });

        test('GIVEN search w/o params THEN returns object', async () => {
          const data = await nodecollect.records.field.search('ba');

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');

          const { rarity, sources } = data.results[0];

          expect(rarity).toBeDefined();
          expect(sources).toBeDefined();
        });

        test('GIVEN search w/ limit THEN returns object', async () => {
          const data = await nodecollect.records.field.search('ba', { limit: 10 });

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data.count).toBeLessThanOrEqual(10);

          const { rarity, sources } = data.results[0];

          expect(rarity).toBeDefined();
          expect(sources).toBeDefined();
        });
      });

      describe('survey_records', () => {
        test('GIVEN show w/ id THEN returns object', async () => {
          const data = await nodecollect.records.survey.show(1);

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data).toHaveProperty('id', 1);

          const { dungeon, solution } = data;

          expect(dungeon).toBeDefined();
          expect(solution).toBeDefined();
        });

        test('GIVEN index w/o params THEN returns object', async () => {
          const data = await nodecollect.records.survey.index();

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data).toHaveProperty('query');
          expect(data).toHaveProperty('count');
          expect(data).toHaveProperty('results');

          const { dungeon, solution } = data.results[0];

          expect(dungeon).toBeDefined();
          expect(solution).toBeDefined();
        });

        test('GIVEN index w/ predicate THEN returns object', async () => {
          const data = await nodecollect.records.survey.index({ dungeon: 'aloalo island', solution_en_cont: 'left path' });

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data).toHaveProperty('query', { dungeon: 'aloalo island', solution_en_cont: 'left path', language: 'en' });

          const { dungeon, solution } = data.results[0];

          expect(dungeon).toBeDefined();
          expect(solution).toBeDefined();
        });

        test('GIVEN search w/o params THEN returns object', async () => {
          const data = await nodecollect.records.survey.search('silkie');

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');

          const { dungeon, solution } = data.results[0];

          expect(dungeon).toBeDefined();
          expect(solution).toBeDefined();
        });

        test('GIVEN search w/ limit THEN returns object', async () => {
          const data = await nodecollect.records.survey.search('silkie', { limit: 10 });

          expect(data).toBeDefined();
          expect(typeof data).toBe('object');
          expect(data.count).toBeLessThanOrEqual(10);

          const { dungeon, solution } = data.results[0];

          expect(dungeon).toBeDefined();
          expect(solution).toBeDefined();
        });
      });
    });
  });

  describe('can fetch character', () => {
    const nodecollect = new Nodecollect();
    const character = nodecollect.getCharacter(29193229);

    describe('can show character data', () => {
      test('GIVEN show w/o params THEN returns object', async () => {
        const data = await character.show();

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');

        const { id, name, server, data_center } = data;
        expect(id).toBe(character.id);
        expect(name).toBeDefined();
        expect(server).toBeDefined();
        expect(data_center).toBeDefined();
      });

      test('GIVEN show w/ params THEN returns object', async () => {
        const data = await character.show({ language: 'fr' });

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');

        const { id, name, server, data_center } = data;
        expect(id).toBe(character.id);
        expect(name).toBeDefined();
        expect(server).toBeDefined();
        expect(data_center).toBeDefined();
      });
    });

    describe('can show owned character collections', () => {
      test('GIVEN owned w/o params THEN returns object', async () => {
        const data = await character.show();

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');

        const { id, name, server, data_center } = data;
        expect(id).toBe(character.id);
        expect(name).toBeDefined();
        expect(server).toBeDefined();
        expect(data_center).toBeDefined();
      });

      test('GIVEN show w/ params THEN returns object', async () => {
        const data = await character.show({ language: 'fr' });

        expect(data).toBeDefined();
        expect(typeof data).toBe('object');

        const { id, name, server, data_center } = data;
        expect(id).toBe(character.id);
        expect(name).toBeDefined();
        expect(server).toBeDefined();
        expect(data_center).toBeDefined();
      });
    });
  });
});
