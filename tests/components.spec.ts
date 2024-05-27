import {test, expect} from '@playwright/test'

test.describe.configure({mode:'parallel'}) //run in parallel the test inside this feature

test.beforeEach(async({page}, testInfo)=>{
    await page.goto('/') //use the env variable on config file
})

test.describe.parallel('Form Layouts page', {tag:['@block']}, ()=>{ //only to run test inside in parallel
    //test.describe.configure({retries: 2})
    test.beforeEach(async({page})=>{
        
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}, testInfo)=>{
        if(testInfo.retry){
            //do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500}) //add delay between each char

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com') //TOHAVETEXT DOESN'T NOT WORK IN INPUT FIELDS
    })

    test('radio buttons', async({page})=>{
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        await usingTheGridForm.getByLabel('Option 1').check({force: true}) //force the click if it is hidden
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})

        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        //Visual assertion - first time fails and generates the screenshot, following runs checks with the png generated
        //in html report generated you can see the expected and actual results
        await expect(usingTheGridForm).toHaveScreenshot()

        // expect(radioStatus).toBeTruthy()
        // await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })

} )

test('checkboxes', async({page})=>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()  

    await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true})
    await page.getByRole('checkbox', {name: "Hide on click"}).check({force: true}) //mark or remains as check
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})

    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){ //.all transform the const to an array
        await box.check({force:true})
        expect(await box.isChecked()).toBeTruthy()
    }
})

test('list and dropdowns', async({page})=>{
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    page.getByRole('list') //when the list has a UL tag
    page.getByRole('listitem') //when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({hasText:"Cosmic"}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light":"rgb(255, 255, 255)",
        "Dark":"rgb(34, 43, 69)",
        "Cosmic":"rgb(50, 50, 89)",
        "Corporate":"rgb(255, 255, 255)"    
    }

    await dropdownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropdownMenu.click()
    }
})

test('toltips', async({page})=>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click() 

    const tooltipCard = page.locator('nb-card', {hasText:"Tooltip Placements"})
    await tooltipCard.getByRole('button',{name:"Top"}).hover()

    page.getByRole('tooltip') //only if you have a role tooltip created (not in this page)
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog boxes', async({page})=>{
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click() 

    page.on('dialog', dialog=>{
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    //by default playwright cancel the dialog
    await page.getByRole('table').locator('tr',{hasText:"mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com")
})

test('web tables', async({page})=>{
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click() 

    //1 get the row by any test in this row
    const targetRow = page.getByRole('row', {name:"twitter@outlook.com"}) //it change to a value when edit the column, here it is used as a html text
    await targetRow.locator('.nb-edit').click()
    //row ready to edit change the html
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill("35")
    await page.locator('.nb-checkmark').click()

    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name:"11"}).filter({has: page.locator('td').nth(1).getByText("11")})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill("test@test.com")
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of the table
    const ages = ["20", "30", "40", "200"]
    for (let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()

            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }else{
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('date pickers', async({page})=>{
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    //js date mozilla documentation
    let date = new Date()
    date.setDate(date.getDate() + 200)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month:'short'})
    const expectedMontLong = date.toLocaleString('En-US', {month:'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMontLong} ${expectedYear} `
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact:true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({page})=>{
    // Update attribute
    const temGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await temGauge.evaluate( node=>{
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
        //browser didn't reflect the change because the event wasn't triggered
    })
    await temGauge.click() //trigger the event

    //Mouse movement
    const temBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await temBox.scrollIntoViewIfNeeded()

    //begins in the upper left corner
    const box = await temBox.boundingBox()
    const x = box.x + box.width / 2 //to start in the center of the box
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x+100, y) //moving right
    await page.mouse.move(x+100,y+100) //moving down
    await page.mouse.up()
    await expect(temBox).toContainText('30')
})
