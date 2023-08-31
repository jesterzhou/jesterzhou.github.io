/**
 * using a json file -> render as html elements   
 */

async function item() {
    let json = await fetch('/item.json')
    let data = await json.text()


}


item()