import{test, expect} from '@playwright/test'
import{PageManager} from '..//page-objects/pageManager'
import{NavigationPage} from '..//page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatepickerPage } from '../page-objects/datepickerPage'
import {faker} from '@faker-js/faker'

test.beforeEach(async({page})=>{
    await page.goto('/')
})

test('navigate to form page', {tag: ['@smoke']}, async({page})=>{
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page})=>{
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(/ /g, '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, "Option 1")
    await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})
    //save as a binary
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInLineFormWitNameEmailAndCheckbox(randomFullName, randomEmail, true)
    await page.locator('nb-card', {hasText:"Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})
})

test('Datepicker test', async({page})=>{
    const pm = new PageManager(page)
    
    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5)

    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 14)
})
