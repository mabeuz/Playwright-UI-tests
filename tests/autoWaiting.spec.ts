import {test, expect} from '@playwright/test'

test.beforeEach(async({page}, testInfo)=>{
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000) //default timeout + 2 sec for this suite
})

test('auto waiting', async({page})=>{
    const successButton = page.locator('.bg-success')

    //await successButton.click()
    
    //const text = await successButton.textContent()

    await successButton.waitFor({state:"attached"})
    //allTextContents doesn't wait
    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async({page})=>{
    const successButton = page.locator('.bg-success')

    //wait for element
    //await page.waitForSelector('.bg-success')

    //wait for particular response -- details in Network tab
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for network calls to be completed (NOT RECOMENDED, some API stucks all test stucks)
    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test ('timeouts', async({page})=>{
    //test.setTimeout(10000)
    test.slow() //increments default timeout 3 times
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 16000}) //overwrite the actionTimeout on config file
})