import {expect, test} from '@playwright/test'

test.beforeAll(() =>{
    //somethimes for data base
})

test.beforeEach(async({page})=>{
    await page.goto('/')
})

test.describe('locators', ()=>{
    test.beforeEach(async({page})=>{
        await page.getByText('Forms').click()
    })
    
    test('the first test', async({page}) => {
        await page.getByText('Form Layouts').click ()
        
        //by Tag Name
        page.locator('input')

        //by ID
        await page.locator('#inputEmail1').click()

        //by Class
        page.locator('.shape-rectangle')

        //by attribute
        page.locator('[placeholder="Email"]')

        //by Class value (full)
        page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

        //combine different selectors
        page.locator('input[placeholder="Email"].shape-rectangle')
        page.locator('input[placeholder="Email"][nbinput]')

        //by XPath NOT RECOMMENDED
        page.locator('//*[@id="inputEmail1"]')

        //by partial text match
        page.locator(':text("Using")')

        //by exact text match
        page.locator(':text-is("Using the Grid")')
    })
})

test.describe('interation with web elements', ()=>{

    test.beforeEach(async({page})=>{
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('User facing locators', async({page}) => {
        await page.getByRole('textbox', {name: "Email"}).first().click()
        await page.getByRole('button', {name:'Sign in'}).first().click()

        await page.getByLabel('Email').first().click() // click the input element of the lable

        await page.getByPlaceholder('Jane Doe').click()

        await page.getByText('Using the Grid').click()

        await page.getByTitle('IoT Dashboard').click()

        //await page.getByTestId('buttontestid')  in html add new < .. data-testid="buttontestid" /> data-testid is reserved to playwright
    })

    test('locating child elements', async({page})=>{
        await page.locator('nb-card nb-radio :text-is("Option 1")').click()
        await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

        await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

        // search by index, 4th element
        await page.locator('nb-card').nth(3).getByRole('button').click()
    })

    test('locating parent elements', async({page})=>{
        await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
        await page.locator('nb-card', {has: page.locator("#inputEmail1")}).getByRole('textbox', {name: "Email"}).click()

        await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
        await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

        //busca los nb-card que tengan el checkbox y ademas el texto "Sign in"
        await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

        //NOT recommended locator('..') va un level up
        await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
    })

    test('reusing locators', async({page})=>{

        const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
        const emailField = basicForm.getByRole('textbox', {name: "Email"})

        await emailField.fill('test@test.com')
        await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
        await basicForm.locator('nb-checkbox').click()
        await basicForm.getByRole('button').click()

        await expect(emailField).toHaveValue('test@test.com')
    })

    test('extracting values', async({page})=>{
        //single text value
        const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
        const buttonText = await basicForm.locator('button').textContent()
        expect(buttonText).toEqual('Submit')

        //all text values
        const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
        expect(allRadioButtonLabels).toContain("Option 1")

        //input value
        const emailField = basicForm.getByRole('textbox', {name: "Email"})
        await emailField.fill('test@test.com')
        const emailValue = await emailField.inputValue()
        expect(emailValue).toEqual('test@test.com')

        //check attribute value
        const placeholderValue = await emailField.getAttribute('placeholder')
        expect(placeholderValue).toEqual("Email")
    })

    test('assertions', async({page})=>{
        const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
        //General assertions
        const value = 5
        expect(value).toEqual(5)

        const text = await basicFormButton.textContent()
        expect(text).toEqual("Submit")

        //Locator assertion -- wait until up 5 seconds
        await expect(basicFormButton).toHaveText("Submit")

        //Soft Assertion
        await expect.soft(basicFormButton).toHaveText("Submit5")
        await basicFormButton.click()
    })
})
