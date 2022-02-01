import { FormCounterPipe } from './form-counter.pipe';

describe('FormCounterPipe', () => {
  it('create an instance', () => {
    const pipe = new FormCounterPipe();
    expect(pipe).toBeTruthy();
  });
});
