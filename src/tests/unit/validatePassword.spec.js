const { text } = require('body-parser');
const { TestScheduler } = require('jest');
const LoginUser = require('../../Application/UseCases/User/LoginUser');

var ls = new LoginUser();
test('the password is valid', async () => {
    const isValid = await ls.validatePassword("123", "$2b$08$QlggMGEOBTN0thj.W/ncp.hImAlso6/F84prhfcTYXOkZQWXfoYHu");
    expect(isValid).toBe(true);
});

// Commmon Matchers
test('object assignment', () => {
    const data = { one: 1};
    data['two'] = 2;
    expect(data).toEqual({ one: 1, two: 2});
});


// truthiness
test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
});

test('is undefined', () => {
    var isun;
    expect(isun).toBeUndefined();
});

// Numbers
test('two plus two', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);

    //toBe and toEqual are equivalent for numbers
    expect(value).toBe(4);
    expect(value).toEqual(4);
});

test('adding floating point numbers', () => {
    const value = 0.1 + 0.2;
    // expect(value).toBe(0.3);  // This won't work because of rounding error;
    expect(value).toBeCloseTo(0.3); // This works.
});

// Strings
test('there is I in team', () => {
    expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
});

// Arrays and iterables
const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'beer'
];

test('the shopping list has beer on it', () => {
    expect(shoppingList).toContain('beer');
    expect(new Set(shoppingList)).toContain('beer');
});

// Expections
//// If you want to test whether a particular function throws an error when it's called, use toThrow.
function compileAndroidCode() {
    throw new Error('you are using the wrong JDK');
}
test('compiling android goes as expected', () => {
    expect(compileAndroidCode).toThrow();
    expect(compileAndroidCode).toThrow(Error);

    // You can also use the exact error message or a regexp
    expect(compileAndroidCode).toThrow('you are using the wrong JDK');
    expect(compileAndroidCode).toThrow(/JDK/);
});
