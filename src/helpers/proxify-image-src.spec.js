
import {proxifyImageSrc} from './proxify-image-src';
import {expect} from "chai";

describe('Proxify image src', () => {
  it('should proxify image src', () => {
    const input = `https://i.imgur.com/muESb0B.png`;
    const expected = 'https://dsiteimages.com/0x0/https://i.imgur.com/muESb0B.png';
    expect(proxifyImageSrc(input)).to.deep.equal(expected);
  });

  it('should not proxify if already proxified', () => {
    const input = `https://dsiteimages.com/0x0/https://dsiteimages.com/DQmWK9ACVoywHPBJQdoTuJpoTSoaubBSKSAdZaJtw1cfLb9/adsactlywitness.gif`;
    const expected = 'https://dsiteimages.com/0x0/https://dsiteimages.com/DQmWK9ACVoywHPBJQdoTuJpoTSoaubBSKSAdZaJtw1cfLb9/adsactlywitness.gif';
    expect(proxifyImageSrc(input)).to.deep.equal(expected);
  });
});
