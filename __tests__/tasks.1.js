const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('Animation', () => {
    it("Sub-text should be hidden until user hovers over image", async () => {
        const overflow = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('overflow')));
        expect(overflow.some(e => e.includes('hidden'))).toBeTruthy();
    })
    it("Sub-text should be displayed when user hovers over image", async () => {
        const transform = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('transform')));
        expect(transform.some(e => e !== 'none')).toBeTruthy();
    });
    it("Sub-text should slide in one by one when user hovers over image", async () => {
        const transition = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('transition')));
        const transitionArray = transition.map(e => e.replace(/[^0-9]/g, '').split(','));
        expect(transitionArray.some(e => e.some(e => e !== '00'))).toBeTruthy();
    });
});

describe('Background', () => {
    it("Page has background image", async () => {
        const img = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('background-image')));
        expect(img.filter(e => e.includes('http')).length).toBeGreaterThan(0);
    });
});