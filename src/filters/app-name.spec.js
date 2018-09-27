import {appName} from './app-name';
import {expect} from "chai";


describe('App Name Filter', () => {
  it('Should return empty string if argument given is null or undefined or empty string', () => {
    let input = '';
    let expected = '';
    expect(appName(input)).to.equal(expected);

    input = undefined;
    expected = '';
    expect(appName(input)).to.equal(expected);

    input = null;
    expected = '';
    expect(appName(input)).to.equal(expected);

  });

  it('Should return app name if string', () => {
    let input = 'dexplorer';
    let expected = 'dexplorer';
    expect(appName(input)).to.equal(expected);
  });

  it('Should return app name if object', () => {
    let input = {"name": "dexplorer-desktop"};
    let expected = 'dexplorer-desktop';
    expect(appName(input)).to.equal(expected);
  });

  it('Should return empty string if given object has no "name" property', () => {
    let input = {"na": "dexplorer-desktop"};
    let expected = '';
    expect(appName(input)).to.equal(expected);
  });
});
