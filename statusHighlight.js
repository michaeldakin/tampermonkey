// ==UserScript==
// @name         statusHighlight.js
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Highlight cases with specific table paramaters for Salesforce Performance edition
// @require      https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js
// @author       Michael Dakin
// @match        https://*.my.salesforce.com/500*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/michaeldakin/tampermonkey/main/statusHighlight.js
// ==/UserScript==

/*
* Version history:
* 0.1 - here we are
* 0.2 - cleaned up legacy code and using a new version of waitForKeyElements - no jQuery!
* 0.3 - added priority highlighting and timeout to run the script every WAITTIME seconds (currently 5)
*/

function log(logmessage) {
    var logtime = new Date().toISOString();
    if (DEBUG == true) {
        console.log("[UserScipt:caseHighlighter.js] " + logtime + " [DEBUG] " + logmessage);
    }
}

// Loop over `caseRows` table and find `Case Number` & `Status` fields, we then apply custom styling
function getCaseStatus() {
    var DEBUG = false;

    // Get case table from /500*
    let caseRows = document.getElementsByClassName("x-grid3-row-table");     // resets

    // Get cell index of rows by column name
    if (document.querySelector('[title="Case Number"]') != null) {
        var caseNumFieldCol = document.querySelector('[title="Case Number"]').parentNode.cellIndex; // get the index of the case status
        log("caseNumFieldCol " + caseNumFieldCol);
    }

    if (document.querySelector('[title="Priority"]') != null) {
        var casePriorityCol = document.querySelector('[title="Priority"]').parentNode.cellIndex; // get the index of the Priority column
        log("casePriorityCol", casePriorityCol);
    }

    if (document.querySelector('[title="Status"]') != null) {
        var statusFieldCol = document.querySelector('[title="Status"]').parentNode.cellIndex; // get the index of the case status
        log("statusFieldCol " + statusFieldCol);
    }

    // Loop over `caseRows` and highlight Status field if it equals Customer Response Provided
    // TODO: move this to a map / array to allow multiple field highlighting
    for (let row = 0; row < caseRows.length; row++) {
        if (caseNumFieldCol != null) { var caseID = caseRows[row].rows[0].cells[caseNumFieldCol].innerText; log(caseID, "caseID: " + caseNumFieldCol.innerText); }
        if (statusFieldCol != null) { var statusField = caseRows[row].rows[0].cells[statusFieldCol]; log(caseID, "statusField: " + statusField.innerText); }
        if (casePriorityCol != null) { var casePriority = caseRows[row].rows[0].cells[casePriorityCol]; log(caseID, "casePriority: " + casePriority.innerText); }

        // initialise total cases variables
        let totalCases = 0;
        let totalCRP = 0;

        // Loop over desired Column(s) innerHTML and apply styling
        if (statusField.innerText === "Customer Response Provided" || casePriority === "P1 - Emergency") {
            caseRows[row].style.background = "lightyellow";
            //caseRows[row].style.color = "white";

            totalCRP += 1;
            log("Highlighted case " + caseID);
        }
        if (casePriority.innerText == "P3 - Normal" || casePriority.innerText == "P4 - Low" || casePriority.innerText == "RFE - Request for Enhancement") {
            caseRows[row].style.background = "#b3ffff";
        }

        totalCases += 1;
    }
    log("Total cases: " + totalCases);
    log("Total Custom Responded cases: " + totalCRP);
}

const DEBUG = true; // turn debug logging on
const WAITTIME = 5000; // we wait to run this script every 5 seconds due to page refreshes

// Wait until last table element has loaded before running the function, otherwise it kinda breaks
waitForKeyElements("div.x-grid3-row.x-grid3-row-last", getCaseStatus);

// Run the script every WAITTIME amount to combat page refreshes
setTimeout(getCaseStatus, WAITTIME);
