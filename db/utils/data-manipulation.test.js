const {
  createArticlesRef,
  formatCommentsData,
} = require('./data-manipulation');

describe('articles reference table', () => {
  test('returns empty object, when passed empty array of articles', () => {
    const articlesRows = [];
    const expectedRef = {};

    expect(createArticlesRef(articlesRows)).toEqual(expectedRef);
  });

  test('returns correct format for array of 1 object', () => {
    const articlesRows = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const expectedRef = { 'Living in the shadow of a great man': 1 };

    expect(createArticlesRef(articlesRows)).toEqual(expectedRef);
  });

  test('returns correct format for array of 2 objects', () => {
    const articlesRows = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171,
      },
    ];
    const expectedRef = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
    };

    expect(createArticlesRef(articlesRows)).toEqual(expectedRef);
  });

  test('createArticlesRef does not mutate input', () => {
    const articlesRows = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171,
      },
    ];
    const expectedRef = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
    };
    createArticlesRef(articlesRows);
    expect(articlesRows).toEqual([
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
      {
        article_id: 2,
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: 1416140514171,
      },
    ]);
  });
});

describe('formatCommentsData', () => {
  test('returns empty array when given empty object', () => {
    const commentData = [];
    const articleRef = {};
    const formattedComments = [];

    expect(formatCommentsData(commentData, articleRef)).toEqual(
      formattedComments
    );
  });

  test('returns correct array when passed single item object', () => {
    const commentData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const articleRef = { "They're not exactly dogs, are they?": 1 };
    const formattedComments = [
      {
        comment_id: 1,
        article_id: 1,
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",

        author: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389,
      },
    ];

    expect(formatCommentsData(commentData, articleRef)).toEqual(
      formattedComments
    );
  });
});
