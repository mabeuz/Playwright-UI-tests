import{test} from '../test-options'
import{PageManager} from '..//page-objects/pageManager'
import {faker} from '@faker-js/faker'


test('parametrized methods', async({pageManager})=>{
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(/ /g, '')}${faker.number.int(1000)}@test.com`

    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, "Option 1")
    await pageManager.onFormLayoutsPage().submitInLineFormWitNameEmailAndCheckbox(randomFullName, randomEmail, true)
})
