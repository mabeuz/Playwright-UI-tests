import {test as base} from '@playwright/test'
import { PageManager } from './page-objects/pageManager'

export type TestOptions = {
    globalsQaURL: string
    formLayoutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', {option:true}],

    //initialized before test run and browser opened, runs faster
    formLayoutsPage: [async({page}, use) =>{
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use('')
        console.log('Tear down - before run the tests')
    }, {auto: true}], //run before any test

    pageManager: async({page}, use) =>{
        const pm = new PageManager(page)
        await use(pm)
    }

    //OR
    // formLayoutsPage: async({page}, use) =>{
    //     await page.goto('/')
    //     await page.getByText('Forms').click()
    //     await page.getByText('Form Layouts').click()
    //     await use('')
    // }

    // pageManager: async({page, formLayoutsPage}, use) =>{
    //     const pm = new PageManager(page)
    //     await use(pm)
    // }
})