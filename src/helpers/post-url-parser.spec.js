import {postUrlParser} from './post-url-parser';
import {expect} from "chai";


describe('Post url parser', () => {

  it('should parse dSite post url', () => {
    const input = `https://dsite.io/dexplorer/@jared/upcoming-dexplorer-surfer-b911ad82fc8ef`;
    const expected = {author: 'jared', permlink: 'upcoming-dexplorer-surfer-b911ad82fc8ef'};
    expect(postUrlParser(input)).to.deep.equal(expected);
  });


  it('should parse busy post url', () => {
    const input = `https://dsocial.io/@jared/dexplorer-app-is-our-new-home-e4f6bfa9f0ceb`;
    const expected = {author: 'jared', permlink: 'dexplorer-app-is-our-new-home-e4f6bfa9f0ceb'};
    expect(postUrlParser(input)).to.deep.equal(expected);
  });

  it('Non url test', () => {
    const input = `@jared/dexplorer-app-is-our-new-home-e4f6bfa9f0ceb`;
    const expected = {author: 'jared', permlink: 'dexplorer-app-is-our-new-home-e4f6bfa9f0ceb'};
    expect(postUrlParser(input)).to.deep.equal(expected);
  });

  it('should return null', () => {
    const input = `introducing-dexplorer-desktop-b911ad82fc8ef`;
    const expected = null;
    expect(postUrlParser(input)).to.deep.equal(expected);
  });

  it('should return null', () => {
    const input = `https://dsite.io/trending`;
    const expected = null;
    expect(postUrlParser(input)).to.deep.equal(expected);
  });

  it('should return null', () => {
    const input = `https://dsocial.io/trending/photography`;
    const expected = null;
    expect(postUrlParser(input)).to.deep.equal(expected);
  });

  it('should return null', () => {
    const input = `@jared`;
    const expected = null;
    expect(postUrlParser(input)).to.deep.equal(expected);
  });
});
