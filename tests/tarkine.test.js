const tarkine = require('../'); // Replace with your engine's import path
const path = require('path');

tarkine.store.set("uppercase", (value = "") => value.toUpperCase())
tarkine.store.set("isString", (value) => typeof value === "string")

describe('Tarkine Template Engine', () => {
    test('renders comments', () => {
        const template = `{{# this is a comment }}Hello`;
        const output = tarkine.render(template, {});
        expect(output).toBe('Hello');
    });

    test('escapes HTML', () => {
        const template = `{{ username }}`;
        const output = tarkine.render(template, { username: '<script>' });
        expect(output).toBe('&lt;script&gt;');
    });

    test('does not escape HTML', () => {
        const template = `{{- html }}`;
        const output = tarkine.render(template, { html: '<b>bold</b>' });
        expect(output).toBe('<b>bold</b>');
    });

    test('renders conditionals', () => {
        const template = `
            {{:if status}}yes{{:else if status == 0}}zero{{:else}}no{{/if}}
        `;
        expect(tarkine.render(template, { status: true })).toContain('yes');
        expect(tarkine.render(template, { status: 0 })).toContain('zero');
        expect(tarkine.render(template, { status: null })).toContain('no');
    });

    test('renders array loops', () => {
        const template = `{{:for val, i in array}}<li>{{ i }} - {{ val }}</li>{{/for}}`;
        const output = tarkine.render(template, { array: ['a', 'b'] });
        expect(output).toContain('<li>0 - a</li><li>1 - b</li>');
    });

    test('renders object loops', () => {
        const template = `{{:for val, key in object}}<li>{{ key }} - {{ val }}</li>{{/for}}`;
        const output = tarkine.render(template, { object: { foo: 'bar' } });
        expect(output).toContain('<li>foo - bar</li>');
    });

    test('renders includes', () => {
        const template = `{{- include("./templates/partials/button", { text: "Click" }) }}`;
        const output = tarkine.render(template);
        expect(output).toContain('Click');
    });

    test('executes code blocks', () => {
        const template = `
            {{~
                function add(a, b) { return a + b; }
                const msg = "done"
            }}
            {{ add(1, 2) }} {{ msg }}
        `;
        const output = tarkine.render(template);
        expect(output).toContain('3 done');
    });

    test('renders void attributes conditionally', () => {
        const template = `<button disabled="islogin">Login</button>`;
        const output = tarkine.render(template, { islogin: true });
        expect(output).toContain('disabled');
    });

    test('global store functions', () => {
        const template = `{{ $.uppercase("word") }} {{ $.isString("yes") }}`;
        const output = tarkine.render(template);
        expect(output).toBe('WORD true');
    });

    test('macros work', () => {
        const template = `
            {{:macro button(text, ...classes)}}
                <button class="{{ classes.join(' ') }}">{{ text }}</button>
            {{/macro}}
            {{- button("Login", "btn", "primary") }}
        `;
        const output = tarkine.render(template);
        expect(output).toContain('<button class="btn primary">Login</button>');
    });

    test('layouts with slots', () => {
        const pagePath = path.join('templates', 'page.tark');
        const output = tarkine.renderFile(pagePath);

        expect(output).toContain('<title>Example layout</title>');
        expect(output).toContain('<h1>Body content</h1>');
    });
});
