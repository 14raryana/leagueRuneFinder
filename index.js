const pup = require("puppeteer");
const inquirer = require("inquirer");
var questions = [
    {
        name: "champName",
        message: "What is the name of the champion you would like?",
        type: "input"
    },
    {
        name: "role",
        message: "Select your role",
        type: "list",
        choices: [
            "Top",
            "Mid",
            "ADC",
            "Support",
            "Jungle"
        ]
    }
]
var answers = [];
var championsList = [];
var isHeadless;

async function champSelect() {
    await inquirer.prompt(questions).then((res) => {
        answers.push(res);
    });
    // console.log(answers);
    // console.log("END");
    // console.log(answers[0].champName);
    // console.log(answers[0].role);
    runesFor(answers[0].champName, answers[0].role);
    // return;
}



async function runesFor(inputChamp, inputRole) {
    const browser = await pup.launch({
        headless: true,
        defaultViewport: null,
        slowMo: 10
    });

    const page = (await browser.pages())[0];
    

    await page.goto("https://u.gg/");
    console.log("OPENED U.GG");
    // await page.waitForNavigation();
    // await inquirer.prompt(questions).then((answer) => {
    //     answers.push(answer);
    //     // console.log(answers);
    // });
    // console.log(answers);
    // console.log("END");
    // return;
    console.log("WAITING 5 SECONDS");
    await page.waitForTimeout(5000);

    // console.log("WAITING FOR NAVIGATION!!!!");

    // await page.waitForNavigation();
    // console.log("WAITED FOR NAVIGATION")

    await page.bringToFront();
    console.log("BROUGHT TO FRONT");

    console.log("WAITING FOR SELECTOR");
    
    // await page.waitForTimeout(5000);

    try {
        //works in headless mode
        if(browser._process.spawnargs.includes("--headless")) {
            isHeadless = true;
            await page.waitForSelector("#side-nav_toggle");
            await page.click("#side-nav_toggle");
            await page.waitForSelector("#side-nav > div.side-nav-links > div > a:nth-child(4)");
            await page.click("#side-nav > div.side-nav-links > div > a:nth-child(4)");
            console.log("CLICKED ON SELECTOR");
        }
        else {
            isHeadless = false;
            throw "Headless mode is turned off.  Proceeding with non-headless mode...";
        }
    }

    catch(error) {
        //DOES NOT WORK IN HEADLESS MODE, HEADLESS MUST BE FALSE FOR THE CATCH BLOCK TO RUN
        console.log(`Something went wrong: ${error}`);
        await page.waitForSelector("#side-nav > div.side-nav-links > div:nth-child(3)");
        await page.click("#side-nav > div.side-nav-links > div:nth-child(3) > a:nth-child(5)", {delay: 100});
    }

    
    
    



    await page.waitForSelector("#content > div > div > div.champions-container");
    console.log("WAITED FOR CHAMPIONS");
    // var hello = await page.$$("#content > div > div > div.champions-container > a:nth-child(1)");
    // "#content > div > div > div.champions-container > a:nth-child(1)"


    // var fuckFace = await page.$$eval("#content > div > div > div.champions-container", (champs) => {
    //     console.log(champs.textContent);
    //     return champs.map(());
    // });

    // console.log(fuckFace);


    const jsHandle = await page.evaluateHandle(() => {
        const elements = document.getElementsByClassName('champion-link');
        return elements;
      });
      console.log(jsHandle); // JSHandle

      var numOfChamps = await jsHandle.evaluate((champs) => champs.length);



      const result = await jsHandle.evaluate((champs, numOfChamps) => {
          var champions = [];
          var champBuild = [];
        //   console.log(champs);
        //   console.log("THESE ARE THE CHAMPS!!!!!!!");
          for(var i = 0; i < numOfChamps; i++) {
              var champ = {};
              champ.nameElement = champs[i].innerHTML;
              champ.build = champs[i].href;
              champions.push(champ);
            // champions.push(champs[i].innerHTML);
          }

          return champions;
      }, numOfChamps);

    //   console.log(result);
    //   console.log("THIS IS THE RESULT CONSTANT!!!!!!!");

    //   console.log(result);
    //   console.log(typeof result);
      for(var i = 0; i < numOfChamps; i++) {
        //   console.log(result[i]);
        //   console.log("THIS IS THE RESULT[i]");
        //   continue;
        var champName = result[i].nameElement.split(">");
        var champBuild = result[i].build;
        
        for(var j = 0; j < 5; j++) {
            // if(j == 0) {
            //     console.log(champName);
            // }
            if(j == 4) {
                champName.pop();
                break;
            }
            champName.shift();
        }
        // console.log(champName[0])
        // console.log(champName[0].split("<"));
        // console.log("THIS IS THE RESULT ARRAY");
        

        champName = champName[0].split("<");
        champName.pop();
        // return;

        // champName.shift();
        // champName = champName.join("");
        // champName = champName.split("=");
        // champName.shift();
        
        
        
        // champName = champName.join("");
        // champName = champName.split('"');
        // champName[3] = champName[3].toLowerCase();



        // champName[3].toLowerCase();
        // console.log(champName[1]);
        // console.log(champName[3]);


        var champion = {
            build: champBuild,
            name: champName[0]
        };
        championsList.push(champion);
      }

    //   championsList.champion

    console.log(championsList);
    console.log("THIS IS THE CHAMPIONS LIST VARIABLE");
    // return;
    var selectedChamp;
    console.log(inputChamp);
    console.log("THIS IS THE INPUT CHAMP");
    // for(var x = 0; x < championsList.length; x++) {
        // console.log(championsList[x].name);
        // console.log("THESE ARE THE CHAMP NAMES!!!!")
    // }
    // return;

    championsList.forEach((champ) => {
        console.log(champ.name);
        console.log("THIS IS THE CHAMP.NAME");
        if(champ.name.toLowerCase() == inputChamp.toLowerCase()) {
            // console.log(champ);
            // console.log("THIS SHOULD BE THE SELECTED CHAMPION");
            // break;
            selectedChamp = champ;
        }
        // else {
        //     continue;
        // }
        // break;
        // return champ;
    });

    console.log(selectedChamp);
    console.log("THIS IS THE SELECTED CHAMP VARIABLE");
    // return;

    switch(inputRole) {
        case "Top":
            inputRole = "top"
            break;

        case "Mid":
            inputRole = "middle"
            break;

        case "Adc":
            inputRole = "adc"
            break;

        case "Support":
            inputRole = "support"
            break;
        
        case "Jungle":
            inputRole = "jungle"
            break;
    }
    console.log("OPENING CHAMP BUILD PAGE...");
    await page.goto(`${selectedChamp.build}?role=${inputRole}`);
    console.log("OPENED CHAMP BUILD PAGE");
    // return;

    // console.log(selectedChamp);
    // console.log("THIS IS THE SELECTED CHAMP VARIABLE");
    // await page.waitForSelector("#content > div > div > div > div > div.filter-manager.media-query.media-query_TABLET__DESKTOP_LARGE > div > div > div.media-query.media-query_TABLET__DESKTOP_LARGE.media-query.media-query_MOBILE_SMALL__DESKTOP_SMALL")
    // await page.waitForSelector("#content > div > div > div > div > div.filter-manager.media-query.media-query_TABLET__DESKTOP_LARGE > div > div > div.media-query.media-query_TABLET__DESKTOP_LARGE.media-query.media-query_MOBILE_SMALL__DESKTOP_SMALL > div > div > div");
    // await page.click("#content > div > div > div > div > div.filter-manager.media-query.media-query_TABLET__DESKTOP_LARGE > div > div > div.media-query.media-query_TABLET__DESKTOP_LARGE.media-query.media-query_MOBILE_SMALL__DESKTOP_SMALL")
    console.log("TAKING SCREENSHOT...");
    await page.screenshot({path: "uggScreenshot.jpg"});
    console.log("SCREENSHOT COMPLETE!!!!!!!!!");

    // await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2)");
    // await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div");
    await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1");

    await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div")
    await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1)");
    var runeTree = await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div > div.rune-tree_header");


// EXTRACTING PRIMARY TREE------------EXTRACTING PRIMARY TREE------------EXTRACTING PRIMARY TREE------------EXTRACTING PRIMARY TREE------------EXTRACTING PRIMARY TREE

    
    runeTree = await page.evaluate(() => Array.from(document.getElementsByClassName('perk-style-title'), e => e.innerHTML));
    var activeRunes = await page.evaluate(() => Array.from(document.getElementsByClassName("perk-active"), (key) => key.innerHTML));
    // console.log(runeTree);
    selectedChamp.build = {};
    selectedChamp.build.primaryTree = [];
    selectedChamp.build.secondaryTree = [];

    if(isHeadless) {
        runeTree.shift();
        if(runeTree.length > 1) {
            runeTree.shift();
        }
    }

    else {
        runeTree.pop();
        if(runeTree.length > 1) {
            runeTree.pop();
        }
    }
    selectedChamp.build.primaryTree.push(...runeTree);
    
    // for(var )
    

    
// ;    return;

    var activeRuneNames = activeRunes.map((rune) => {
        // rune = rune;
        // for(var i = 0; i < rune.length; i++) {
        //     rune = rune[i].split("=");
        // }
        // return rune;
        rune = rune.split("=");
        for(var i = 0; i < 3; i++) {
            rune.shift();
        }

        rune = rune[0];
        rune = rune.split('"');
        rune.shift();
        rune.pop();
        rune = rune[0];
        return rune;
        // for(var i = 0; i < 3; i++) {
        //     rune.shift();
        // }
        // return rune;
        // for(var j = 0; j < rune.length; j++) {
        //     rune = rune[j].split('"');
        // }
        // return rune;
    });

    selectedChamp.build.primaryTree.push(...activeRuneNames);

    console.log(selectedChamp);
    console.log(selectedChamp.build);
    console.log("THIS IS THE SELECTED CHAMP AND SELECTED CHAMP.BUILD RESPECTIVELY");
    console.table(selectedChamp.build.primaryTree);

// EXTRACTING PRIMARY TREE------------EXTRACTING PRIMARY TREE------------EXTRACTING PRIMARY TREE------------EXTRACTING PRIMARY TREE------------EXTRACTING PRIMARY TREE



// EXTRACTING SECONDARY TREE------------EXTRACTING SECONDARY TREE------------EXTRACTING SECONDARY TREE------------EXTRACTING SECONDARY TREE------------EXTRACTING SECONDARY TREE


    // runeTree = await page.evaluate(() => Array.from(document.getElementsByClassName('perk-style-title'), e => e.innerHTML));










    
    // console.log(activeRuneNames);
    // console.log("THESE ARE THE ACTIVE RUNE NAMES!!!!!");
    // console.log(runeTree);
    return;

    activeRunes.forEach((rune) => {
        rune.split("=");
    });

    console.log(activeRunes);
    // console.log(activeRunes[0].split("="));
    console.log("THESE ARE THE ACTIVE RUNES");


    var runeTree = [];
    var poop = 0;
    console.log(runeTree);
    console.log(runeTree.length);
    console.log("THIS IS THE runeTree VARIABLE");

    for(var i = 0; i < runeTree.length - 2; i++) {
        runeTree.push(runeTree[i]);
    }

    console.log(runeTree);
    console.log("THESE ARE THE RUNES DAWG");

    // runes.forEach(rune => {
    //     if(count > 1) {
    //         break;
    //     }
    //     runeTree.push(rune);
    //     poop++;
    //     // console.log(tweet);
    // });
    // console.log(runeTree);
    // console.log("THIS IS THE RUNE TREE");
    return;

    var bigPeePee = await page.$$(".rune-tree_header", (shit) => {
        return shit;
        // return document.getElementById("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div > div.rune-tree_header");
    });
    console.log(bigPeePee);
    console.log(bigPeePee.length);
    console.log("THIS IS THE BIG PEE PEE VARIABLE");
    // return;
    var littlePeePee = await page.evaluateHandle((bigPeePee) => {
        return bigPeePee;
    });
    console.log(littlePeePee);
    console.log("THIS IS THE LITTLE PEE PEE VARIABLE!!!!!!!");

    var normalPeePee = await littlePeePee.$$eval((shitBird) => {
        return shitBird;
    });
    console.log(normalPeePee);
    console.log("THIS IS NORMAL SIZED PEE PEE VARIABLE!!!!!");
    return;
    
    var peePee = await page.evaluateHandle(() => {
        var hell = document.getElementById("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1");
        return hell;
    });

    var shitEars = await peePee.evaluate((dicks) => {
        console.log(dicks);
        return dicks;
    });

    console.log(peePee);
    console.log("THIS IS THE PEEPEE VARIABLE!!!!!!!!");

    console.log(shitEars);
    console.log("THIS IS THE SHIT EARS VARIABLE");

    // await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div");
    // var shit = await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div > div.rune-tree_header");
    // var whore = await page.evaluate(() => {
    //     var penis = document.getElementById("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div > div.rune-tree_header > div.perk-style-title");
    //     return penis;
    // });

    // console.log(whore);
    // console.log("THIS IS THE WHORE VARIABLE!!!!!!");
    // var fuckFace = await page.waitForSelector("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div > div.rune-tree_header > div.rune-image-container");
    // console.log(fuckFace);#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1)

    // var handle = await page.evaluate(() => {
    //     var ele = document.getElementById("#content > div > div > div > div > div.champion-profile-page > div.champion-recommended-build > div.content-section.content-section_no-padding.grid-1 > div.content-section_content.recommended-build_runes > div:nth-child(2) > div.rune-trees-container-2.media-query.media-query_MOBILE_LARGE__DESKTOP_LARGE > div:nth-child(1) > div > div.rune-tree_header > div.rune-image-container");
    //     return ele;
    // });


    

    // var shitDick = handle.evaluate(())

    // const jsHandle = await page.evaluateHandle(() => {
    //     const elements = document.getElementsByClassName('champion-link');
    //     return elements;
    //   });
    
    // var hello = await page.evaluateHandle(() => {
    //     console.log("IN HELLO EVALUATE HANDLE FUNCTION");
    //     const aatrox = document.getElementById("content > div > div > div.champions-container > a:nth-child(1)");
    //     return aatrox;
    // });

    console.log("THIS IS FUCK FACE VARIABLE!!!!!!!");
    

    //   console.log("THIS IS THE RESULT AND END OF THE PROGRAM!!!!!!");
    
    //   const result = await jsHandle.evaluate((els) => {
    //       var random = [];
    //     //   for(var i = 0; i < 20; i++) {
    //     //       random.push(els[i]);
    //     //   }
    //     random.push(els[1]);
    //       console.log("THIS IS EVERY ELS IN THE JSHANDLE.EVALUATE FUNCTION")
    //       return els[0];
    //       return console.log("THIS IS EVERY ELS IN THE JSHANDLE.EVALUATE FUNCTION")
    //     return {
    //         champion: els[0].innerText,
    //         build: els[0].href
    //     }
    //   });
    //   console.log(result);
    //   console.log("THIS IS THE RESULT/els length!!!!!");
      return;



    // console.log(fuckFace);
    // console.log("THIS IS THE FUCKFACE VARIABLE");




    var hello = await page.evaluateHandle(() => {
        console.log("IN HELLO EVALUATE HANDLE FUNCTION");
        const aatrox = document.getElementById("content > div > div > div.champions-container > a:nth-child(1)");
        return aatrox;
    });

    // const result = await page.evaluate((els) => els.innerHTML, hello);
    // console.log(result);



    
    // console.log(hello);
    // console.log(hello.innerHTML);
    // console.log(hello.innerText);
    // console.log(hello.textContent);
    // console.log(hello.value);
    // console.log("THIS IS THE HELLO VARIABLE");
    
    // await page.evaluate(() => {
    //     var hello = document.getElementById("content > div > div > div.champions-container");
    //     console.log(hello);
    //     console.log("THIS IS THE HELLO VARIABLE");
    //     // #content > div > div > div.champions-container > a:nth-child(1)
    // })

//CHAMPION SEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH

    // console.log("WAITING FOR SELECTOR")
    // await page.waitForSelector("#super-search-bar");
    // console.log("SELECTOR FOUND!!!!");

    // await page.click("#super-search-bar");
    // console.log("SEARCH BAR CLICKED!!!!!");

    // await page.keyboard.type("jhin", {delay: 100});

//CHAMPION SEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH---------------CHAMPIONSEARCH




    // await page.select()
    // await page.evaluate(() => {
    //     var dropdown = document.getElementById("react-autowhatever-1");
    //     console.log(dropdown);
    // })
}

// async function championSelect() {
    
// }

// runesFor();
champSelect();














// const path = require("path");
// path.join(__dirname + "./index.js");
// const captchaSolver = require("./CaptchaSolver");
// const fetch = require("node-fetch");
// var json = require("json-object").setup(global);
// var FormData = require("form-data");
// let formDataBalance = new FormData();

// let formData = new FormData();
// var captchaId = "";

// const selectDate = require("./selectDate");

// const username = "14raryana";
// const password = "Farvardin81376";


// const userInfo = {
//     plateNum: "HDL8716",
//     //GHX7127 Rayans license plate number
//     fName: "Raman",
//     lName: "Aryana",
//     model: "Camry",
//     addressNum: "2397",
//     addressStreet: "Dysart Rd",
//     carColor: "Black",
//     zipCode: "44118",
//     email: "14raryana@gmail.com",
//     phoneNum: "2169780564"
// }

// var captcha_dict = {
//     proxy: "",
//     proxytype: "",
//     googlekey: "6LeE_bAUAAAAAKulTMpnr0SqYGuglMtHxFOtg7SY",
//     pageurl: "https://www.frontlinepss.com/uhpd"
// }






async function main() {    


    // fetch("http://api.dbcapi.me/api/user", {
    //     method: "POST",
    //     body: formDataBalance
    // })

    // .then((response) => response.text())
    //     .then((json) => console.log(`THIS IS THE JSON: ${json}`))
    
    // .catch((error) => {
    //     console.log(`balance Poll Failed: ${error}`);
    // })

    const browser = await pup.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 10
    });

    const page = (await browser.pages())[0];

    await page.goto("https://www.frontlinepss.com/uhpd");
    

    await page.waitForSelector('#MainContent_lbONP2');
    await page.click('#MainContent_lbONP2');

    // console.log("WAITING FOR NAVIGATION");
    // await page.waitForNavigation();
    // console.log("NAVIGATION COMPLETED!");
    console.log("WAITING FOR SELECTOR");
    // await page.waitForSelector("#MainContent_ctrlOverNightParking_pnlOvernightParking");
    await page.waitForSelector("#MainContent_ctrlOverNightParking_txtPlate");
    console.log("SELECTOR FOUND!!!!");
    // await page.bringToFront();

    // await page.waitForNavigation();
    
    // console.log('WAITING TO CLICK');
    // await page.click('#MainContent_ctrlOverNightParking_txtPlate').catch(async(error) => {
    //     console.log(`YOU FUCKED UP: ${error}`);
    //     return;
    // });

    // console.log("THIS IS THE END OF THE LINE!");
    // console.log("CLICKED LICENCE PLATE INPUT!!!!!!");


    const licensePlate = userInfo.plateNum.split("");
    const model = userInfo.model.split("");
    const carColor = userInfo.carColor.split("");
    const addressNum = userInfo.addressNum.split("");
    const addressStreet = userInfo.addressStreet.split("");
    const zipCode = userInfo.zipCode.split("");
    const fName = userInfo.fName.split("");
    const lName = userInfo.lName.split("");
    const phoneNum = userInfo.phoneNum.split("");
    const email = userInfo.email.split("");

    console.log("split all strings to be used for data!!!!");

    await page.bringToFront();
    await page.waitForSelector("#default-Popup > div > div.modal-body > div:nth-child(2) > div:nth-child(3) > div");
    

//---------License Plate Input---------License Plate Input---------License Plate Input---------License Plate Input---------License Plate Input---------License Plate Input

    await page.waitForSelector("#MainContent_ctrlOverNightParking_txtPlate");
    // console.log(await page.evaluate(() => document.getElementById("MainContent_ctrlOverNightParking_txtPlate")));
    // return;

    await page.waitForTimeout(5000);

    await page.click("#MainContent_ctrlOverNightParking_txtPlate", {delay: 1000});

    // console.log("License Plate clicked NIGGAAAAA!!!!!!");


    // return;

    // try{
    //     page.click("#MainContent_ctrlOverNightParking_txtPlate", {delay: 100});
    // }

    // catch(error) {
    //     console.log(error);
    //     await page.click("#MainContent_ctrlOverNightParking_txtPlate", {delay: 100});
    // }

    await page.keyboard.type(userInfo.plateNum, {delay: 100});

//---------License Plate Input---------License Plate Input---------License Plate Input---------License Plate Input---------License Plate Input---------License Plate Input



//---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON

    await page.select("#MainContent_ctrlOverNightParking_ddlReason", "2436");

//---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON---------OVERNIGHT PARKING REASON



//---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR

    await page.select("#MainContent_ctrlOverNightParking_ddlMake", "Toyota");
    await page.click('#MainContent_ctrlOverNightParking_txtModel');
    
    // return;

    await page.keyboard.type(userInfo.model, {delay: 100});

    await page.click('#MainContent_ctrlOverNightParking_txtVehicleColor');

    await page.keyboard.type(userInfo.carColor, {delay: 100});
    
    console.log("up to vehicle coler should be done");

    
    // return;

//---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR---------MAKE MODEL AND COLOR


//---------USER ADDRESS INFORMATION---------USER ADDRESS INFORMATION---------USER ADDRESS INFORMATION---------USER ADDRESS INFORMATION---------USER ADDRESS INFORMATION---------USER ADDRESS INFORMATION

    await page.click("#MainContent_ctrlOverNightParking_txtAddress");
    await page.keyboard.type(userInfo.addressNum, {delay: 100});




    await page.select("#MainContent_ctrlOverNightParking_ddlDirection", "East");

    await page.click("#MainContent_ctrlOverNightParking_txtStreetName");
    await page.keyboard.type(userInfo.addressStreet, {delay: 100});



    await page.waitForSelector(".ui-menu-item");
    await page.click(".ui-menu-item");

    // console.log("What is .ui-menu-item");
    // return;


    await page.click("#MainContent_ctrlOverNightParking_txtFirstName");
    await page.keyboard.type(userInfo.fName, {delay: 100});


    // for(var i = 0; i < fName.length; i++) {
    //     await page.keyboard.press(fName[i]);
    // }

    await page.click("#MainContent_ctrlOverNightParking_txtLastName");
    await page.keyboard.type(userInfo.lName, {delay: 100});

    // for(var i = 0; i < lName.length; i++) {
    //     await page.keyboard.press(lName[i]);
    // }

    await page.click("#MainContent_ctrlOverNightParking_txtPhone");
    await page.keyboard.type(userInfo.phoneNum, {delay: 100});


    // for(var i = 0; i < phoneNum.length; i++) {
    //     await page.keyboard.press(phoneNum[i]);
    // }

    await page.click("#MainContent_ctrlOverNightParking_txtEmail");
    await page.keyboard.type(userInfo.email, {delay: 100});

    console.log("ALL INPUT SHOULD BE FILEED EXCEPT FOR DATE AND RECAPTCHA!!!!!");

    // selectDate

    await selectDate(page);
    // .then((response) => {
    //     console.log(response);
    // });

    // await captchaSolver().then((response) => {
    //     console.log(response);
    //     console.log("THIS IS THE RETURN VALUE FROM CAPTCHA SOLVER FILE IN INDEX.JS");
    // })
    // return;


    // for(var i = 0; i < email.length; i++) {
    //     await page.keyboard.press(email[i]);
    // }










    // formDataBalance.append("username", username);
    // formDataBalance.append("password", password);

    formData.append("username", username);
    formData.append("password", password);
    formData.append("type", 4);
    formData.append("token_params", JSON.stringify(captcha_dict));

    fetch("http://api.dbcapi.me/api/captcha", {
        method: "POST",
        body: formData
    })

    .then((response) => response.text())
        .then((data) => {
            var captchaStr = data.substring(16, 28);
            var captchaIdentifier = captchaStr.replace(/\D/g, "");
            data = captchaIdentifier;
            captchaId = captchaIdentifier;
            return data;
        })

        .then((data) => console.log(`Solving captcha... \nCaptcha ID: ${data}`))
        .then((x) => new Promise((resolve) => setTimeout(() => resolve(x), 10000)))
        .then((data) => console.log(`Still working on your captcha...`))
        .then((x) => new Promise((resolve) => setTimeout(() => resolve(x), 50000)))
        .then((data) => {
            return fetch("http://api.dbcapi.me/api/captcha/" + captchaId);
        })
        .then((response) => response.text())
        .then((response) => response.length > 47 
        ? response 
        : 
        new Promise((resolve, reject) => {
            setTimeout(() => resolve(fetch("http://api.dbcapi.me/api/captcha/" + captchaId).then((response) => response.text())), 50000)
        }))
        .then(async (response) => {
            // console.log(`This is the final response: ${response}`);
            var captchaResponse = response.split("&");
            await captchaResponse.shift();
            await captchaResponse.shift();
            await captchaResponse.pop();
            captchaResponse = captchaResponse.toString();
            var captchaAnswer = captchaResponse.split("=");
            await captchaAnswer.shift();
            // console.log(typeof captchaResponse);
            // console.log(captchaResponse);
            // var captchaAnswer = captchaResponse.split("=");
            // captchaAnswer = captchaResponse.pop();

            // console.log(Object.keys(captchaResponse))

            // console.log(captchaAnswer[0]);
            captchaAnswer = captchaAnswer[0];
            console.log(captchaAnswer);
            console.log("CAPTCHA SOLVED NIGGGGGAAAAAAAA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log("fucking idiot, stupid, retard, bitchFace, whoreMouth, fuck nose, ear shit, mayonaise gargling, fat piece of ghorme sabzi!!!!!!");

            await page.$eval("#g-recaptcha-response", (element, captchaAnswer) => {
                element.value = captchaAnswer;
            }, captchaAnswer);

            // await page.$eval("#g-recaptcha-response", (element, captchaAnswer) => {
            //     element.value = captchaAnswer;
            // }, captchaAnswer);



            console.log("CHECK THE VALUE OF THE G-RECAPTCHA-RESPONSE ELEMENT IN DEV TOOLS CONSOLE");
            await page.waitForSelector("#MainContent_ctrlOverNightParking_btnSubmit");
            
            
            await page.click("#MainContent_ctrlOverNightParking_btnSubmit", {delay: 1000});
            
            console.log("SUBMIT BUTTON CLICKED!!!!!!!!!!!!!!!!");
            console.log("SUCCESS!!!!! Closing browser, Please wait until browser is closed to continue");
            await page.waitForTimeout(3000);
            await browser.close();

            // var recaptchaInnerText = await page.evaluate(async (captchaAnswer) => {
            //     return document.getElementById("g-recaptcha-response").value = captchaAnswer;
            // });

            // console.log(recaptchaInnerText);
            // recaptchaInnerText.innerHTML = captchaAnswer[0];
            // console.log("THIS IS AFTER THE PAGE.EVALUATE FUNCTION. INNERHTML SHOULD BE SET. TRY SUBMITTING THE FORM MANUALLY");
            // await inputCaptcha(page, captchaAnswer);
            // console.log("THIS IS AFTER THE INPUT CAPTCHA FUNCTION");
        })

        .catch((error) => {
            console.log(`Request Failed: ${error}`)
        });

        // var splitAt = {};


        // splitAt.start = response.indexOf("&captcha=");
        // splitAt.end = response.indexOf("&is");

        // await page.evaluate(document.getElementById("g-recaptcha-response").innerHTML = )


        // reCaptchaCallback




    //     .then((json) => console.log(`THIS IS THE JSON: ${json}`))
    
    // .catch((error) => {
    //     console.log(`balance Poll Failed: ${error}`);
    // })
}


async function inputCaptcha(page, captchaToken) {
    console.log(captchaToken);
    // console.log(page)
    await page.evaluate(() => {
        document.getElementById("g-recaptcha-response").innerHTML = captchaToken;
        console.log("THE INNER HTML SHOULD BE SET. TRY TO SUBMIT THE FORM");
        return;
    });
    return;
    
}


// main();