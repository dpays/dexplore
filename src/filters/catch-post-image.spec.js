import {catchPostImage} from './catch-post-image';
import {expect} from "chai";


describe('Catch Post Image', () => {
  it('Should extract post image from json_metadata', () => {

    let input = {
      json_metadata: '{"tags":["auto","vehicle","ai","technology","adsactly"],"users":["adsactly","techblogger","adsactly-witness"],"image":["http://www.autonews.com/apps/pbcsi.dll/storyimage/CA/20180205/MOBILITY/180209919/AR/0/AR-180209919.jpg","http://clipart-library.com/images/pco56kbxi.png","http://psipunk.com/wp-content/uploads/2010/03/phoenix-electric-car-futuristic-concept-01.jpg","https://images.hgmsites.net/med/2011-honda-small-sports-ev-concept_100369472_m.jpg","https://cdn.trendhunterstatic.com/thumbs/electric-car-concept.jpeg","https://s.aolcdn.com/hss/storage/midas/162bec06fe31386c2a36ad6ca4d7f01d/205983934/lg-here-self-driving-car-partnership.jpg","https://dsiteimages.com/DQmd5CQG5zLjjm2z8289qcLU6eBHJpC5FmgtR3aC1eXnhsi/Adsactly-Logo-200px.png","https://dsiteimages.com/0x0/https://dsiteimages.com/DQmWK9ACVoywHPBJQdoTuJpoTSoaubBSKSAdZaJtw1cfLb9/adsactlywitness.gif"],"links":["https://qzprod.files.wordpress.com/2018/02/kelly-sikkema-266805.jpg?quality=80&strip=all&w=3200","http://psipunk.com/wp-content/uploads/2010/03/phoenix-electric-car-futuristic-concept-01.jpg","https://images.hgmsites.net/med/2011-honda-small-sports-ev-concept_100369472_m.jpg","https://cdn.trendhunterstatic.com/thumbs/electric-car-concept.jpeg","https://s.aolcdn.com/hss/storage/midas/162bec06fe31386c2a36ad6ca4d7f01d/205983934/lg-here-self-driving-car-partnership.jpg","https://discord.gg/EwGhEzb","https://steemit.com/witness-category/@adsactly-witness/adsactly-steemit-witness-proposal","https://steemit.com/~witnesses","https://go.dpayid.io/sign/account-witness-vote?witness=adsactly-witness&approve=1"],"app":"steemit/0.1","format":"markdown"}',
      body: ''
    };
    let expected = 'https://dsiteimages.com/0x0/http://www.autonews.com/apps/pbcsi.dll/storyimage/CA/20180205/MOBILITY/180209919/AR/0/AR-180209919.jpg';
    expect(catchPostImage(input)).to.equal(expected);


    input = {
      json_metadata: '{"community":"busy","app":"busy/2.3.0","format":"markdown","users":["gavvet","kingscrown","vcelier","ezzy","meesterboom","thecryptodrive","reggaemuffin","adsactly","adsactly-witness","buildteam","minnowbooster","steemvoter","steemsports"],"links":["https://imgur.com/NUt92kg","/@gavvet","/@kingscrown","/@vcelier","/@ezzy","/@meesterboom","/@thecryptodrive","/@reggaemuffin","/@adsactly","/@adsactly-witness"],"image":["https://dsiteimages.com/0x0/https://i.imgur.com/NUt92kg.jpg","https://dsiteimages.com/0x0/https://dsiteimages.com/DQmXndfFUQmmtMk5Dd6u1nRNmNqr2mdkEGDVkT9SNyCxEeP/bt%20logo.png","https://dsiteimages.com/0x0/https://dsiteimages.com/DQmd5CQG5zLjjm2z8289qcLU6eBHJpC5FmgtR3aC1eXnhsi/Adsactly-Logo-200px.png"],"tags":["art","photography","adsactly","thoughts","busy"]}',
      body: ''
    };
    expected = 'https://dsiteimages.com/0x0/https://i.imgur.com/NUt92kg.jpg';
    expect(catchPostImage(input)).to.equal(expected);


    input = {
      json_metadata: '{"video":{"info":{"title":"HEALTHY SERIES | LUNCH | STUFFED AUBERGINE BOATS - VIDEO ","snaphash":"QmdbBjr9bhab392f2zkXsa7YhHue7YNch2J1XXzvhLEE6V","author":"allasyummyfood","permlink":"qe5nlzmj","duration":172.384943,"filesize":26936060,"spritehash":"QmSG49VefmCQqWVjb8ii79GQVuSSKrFrUNSh45gni5Kqhq"},"content":{"videohash":"QmRkNLhhBjr86YB21ZpD76A1jCDt7stCAMeNpWgxNYRmUs","video480hash":"QmP3S6piVPRuriPmQZRbPPHGYG5aKYjukFP8vWWcW349VQ","magnet":"","description":"How to make stuffed eggplant. Looking for a flavorful dinner? Then try this baked eggplant dish that\'s stuffed with vegetables and spices. Make the most of whole aubergines - turn them into edible bowls. Serve these stuffed aubergines as a light dinner along with a big salad. This is very hearty and nutritious dish.\\n\\nIngredients \\n\\n\\n1 large aubergine\\n1 cup - 200 gr of chopped canned tomato\\n1 tsp of turmeric and 1tsp of cumin\\nhalf an onion\\n2 cloves of garlic\\nbunch of parsley\\nsalt & pepper\\nsour cream ( optional)\\n\\nDirections \\n\\nStep 1: Preheat your oven to 180 C or 350 F.\\nStep 2 : Cut your eggplant in half, make few cuts along and then across. \\nStep 3 : Place your eggplant onto a baking dish, blush them with olive oil or use low calorie cooking spray. \\nStep 4 : Cook your eggplant for 30-35 min. \\nStep 5 : In a small saucepan, place your chopped onion and garlic. Fry for 3 -5 min untill soft. Add turmeric and cumin. Then add chopped tomatoes, \\nStep 6 : Scoop the mixture from your eggplant very carefully without breaking the skin. \\nStep 7 : Add the eggplant flesh into your pan along with parsley and cook for 15 min on low heat.\\nStep 8 : Fill your eggplant boats and serve with some fresh sour cream. \\n\\nMore videos on @dvideo!!! :))) Alla \\n","tags":["dvideo","video","food","recipe"]},"_id":"d46a5cfac370f095a54e6aa088656d7e"},"tags":["dvideo","video","food","recipe","dvideo"],"app":"dvideo/0.6"}',
      body: ''
    };
    expected = null;
    expect(catchPostImage(input)).to.equal(expected);

  });

  it('Should extract post image from markdown', () => {
    let input = {
      json_metadata: '{}',
      body: "<center><a href='https://dvideo.io/#!/v/theaudgirl/2ys21z9c'><img src='https://ipfs.io/ipfs/QmaG5Dpg1XGiY7EyeMCwT8Dqw4GfiAaehq3hZadongniQc'></a></center><hr>"
    };

    let expected = 'https://dsiteimages.com/0x0/https://ipfs.io/ipfs/QmaG5Dpg1XGiY7EyeMCwT8Dqw4GfiAaehq3hZadongniQc';
    expect(catchPostImage(input)).to.equal(expected);


    input = {
      json_metadata: '{}',
      body: "<center><a href='https://dvideo.io/#!/v/benswann/2snaen3c'><img src='https://ipfs.io/ipfs/QmYFWFseBNkHLhYRYqvi3on7sxNh4RyezMqwUWmDtw5QT5'></a></center><hr>"
    };

    expected = 'https://dsiteimages.com/0x0/https://ipfs.io/ipfs/QmYFWFseBNkHLhYRYqvi3on7sxNh4RyezMqwUWmDtw5QT5';
    expect(catchPostImage(input)).to.equal(expected);
  });


  it('Should extract nothing', () => {
    let input = {
      json_metadata: '{}',
      body: "<p>lorem ipsum dolor</p> sit amet"
    };

    let expected = null;
    expect(catchPostImage(input)).to.equal(expected);
  });
});
