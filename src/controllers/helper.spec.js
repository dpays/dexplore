import {amountFormatCheck, amountPrecisionCheck, formatStrAmount, isUrl} from './helper.js';

import {expect} from "chai";


describe('Controller helper', () => {
  it('amountFormatCheck', () => {
    expect(amountFormatCheck('0.001')).to.deep.equal(true);
    expect(amountFormatCheck('1')).to.deep.equal(true);
    expect(amountFormatCheck('102.222')).to.deep.equal(true);
    expect(amountFormatCheck('0.1')).to.deep.equal(true);

    expect(amountFormatCheck('0.')).to.deep.equal(false);
    expect(amountFormatCheck('0.00.')).to.deep.equal(false);
    expect(amountFormatCheck('a1')).to.deep.equal(false);
  });

  it('amountPrecisionCheck', () => {
    expect(amountPrecisionCheck('0.001')).to.deep.equal(true);
    expect(amountPrecisionCheck('100')).to.deep.equal(true);
    expect(amountPrecisionCheck('5')).to.deep.equal(true);

    expect(amountPrecisionCheck('1.0003')).to.deep.equal(false);
    expect(amountPrecisionCheck('5.00000')).to.deep.equal(false);
  });

  it('formatStrAmount', () => {
    expect(formatStrAmount('0.10', 'BEX')).to.deep.equal('0.100 BEX');
    expect(formatStrAmount('0.001', 'BBD')).to.deep.equal('0.001 BBD');
    expect(formatStrAmount('1', 'BEX')).to.deep.equal('1.000 BEX');
    expect(formatStrAmount('10', 'BBD')).to.deep.equal('10.000 BBD');
    expect(formatStrAmount('2.0', 'BBD')).to.deep.equal('2.000 BBD');
    expect(formatStrAmount('100', 'BEX')).to.deep.equal('100.000 BEX');
  });


  it('isUrl', () => {
    expect(isUrl('http://example.com'), true);
    expect(isUrl('https://example.com'), true);
    expect(isUrl('example.com'), false);
    expect(isUrl('://example.com'), false);
    expect(isUrl('ftp://example.com'), false);
  })
});
