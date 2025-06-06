Key observations :
1. Each time, you provide code, you are changing variable names, method implementaions, code changes, logics with-in.
2. Each of your answer is different to what we started and what we are working for
3. You are consistant with what we are working together.
4. For each failure, you are taking a different approach and that's causing other issues.

Ground Rules :
1. Variable names should be same and meaningful and more elobrative, easy to understand, easy to follow the code.
2. Functions, methods, logic - needed to be simple and easy and yet efficient.
3. Provide libraral fucntional comments on top of fucntion, what is it, what is it, what are the variables, why, what do they do? where do we use them? how do we use them and so on
4. Please do not change the flow, do not change the idea, do not change the way that we are working
5. If you notice best possibilites, best ideas, better coding, please suggest and so we can work towards it
6. Treat me as your best friend and help me in every possiblity to ge the project done at the BEST.
7. if there are issues, please provide Issue... Solution...documentation


=========

yes, let's improve to the BEST.
for now, I see the following comments or drawbacks.

Comments or Drawbacks of our project : 
1. The extracted elements and the locators are very low level. I mean, it's not the advanced way of locating, it's the best. it's locating full html path.. it's not good.
2. Need to locate elements at the best way. please use advanced mechanisims, better locating techniques.
3. The Best Locator, CSS, XPATH are very low level identification techniques. Need to locate elements at the best way. please use advanced mechanisims, better locating techniques.
4. Can we auto-format the CSV file to look good? at least some kind of headers, columns bold/italics.. OR we can use XLSX way of saving ... this is on YOU.
5. On the UI/popup, can we use the AI/robt moments, instead of mouse, when hover on it
6. When we hover on the check-boxes/ options of the UI/popup, can we do some kind of animations, color changing ways, text bigger or some sorts of FUN and JOY of usage.
7. Can we change the FONT to look good and feel BEST
8. Can we expand the UI/popup, after the scanning is done. As the table at the bottom increases 
9. is there way to copy the locators from UI itself, like option to COPY from UI?
10. Can we do better representing the AI tip, l dont know. Jus to EYE CATCHING kind of

```js
function getBestLocator(el) {
    // 1. ID (most stable)
    if (el.id && !el.id.match(/^[0-9]+$/)) return {type: 'ID', locator: `#${el.id}`};

    // 2. data-testid, data-qa, data-cy (test automation attributes)
    for (const attr of ['data-testid', 'data-qa', 'data-cy']) {
        if (el.hasAttribute(attr)) return {type: attr, locator: `[${attr}="${el.getAttribute(attr)}"]`};
    }

    // 3. aria-label or aria-labelledby
    if (el.hasAttribute('aria-label')) return {type: 'aria-label', locator: `[aria-label="${el.getAttribute('aria-label')}"]`};
    if (el.hasAttribute('aria-labelledby')) return {type: 'aria-labelledby', locator: `[aria-labelledby="${el.getAttribute('aria-labelledby')}"]`};

    // 4. role (if unique in page)
    if (el.hasAttribute('role')) {
        const sameRole = document.querySelectorAll(`[role="${el.getAttribute('role')}"]`);
        if (sameRole.length === 1) return {type: 'role', locator: `[role="${el.getAttribute('role')}"]`};
    }

    // 5. Unique class (single in page)
    if (el.classList.length === 1) {
        const className = el.classList[0];
        const sameClass = document.querySelectorAll(`.${className}`);
        if (sameClass.length === 1) return {type: 'class', locator: `.${className}`};
    }

    // 6. Unique text (short)
    if (el.innerText && el.innerText.length < 32) {
        const allWithText = Array.from(document.querySelectorAll(el.tagName))
            .filter(e => e.innerText.trim() === el.innerText.trim());
        if (allWithText.length === 1) return {type: 'text', locator: `${el.tagName}:contains("${el.innerText.trim()}")`};
    }

    // 7. Fallback: Short CSS or XPath
    return {type: 'CSS', locator: getUniqueCssSelector(el)};
}
```


