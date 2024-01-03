// ==UserScript==
// @name         caseHighlighter.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight cases with specific table paramaters for Salesforce Performance edition
// @require      https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js
// @author       Michael Dakin
// @match        https://*.my.salesforce.com/500*
// @grant        none
// ==/UserScript==

/*
* Version history:
* 0.1 - here we are
*/

const DEBUG = true;

function log(logmessage) {
    var logtime = new Date().toISOString();
    if (DEBUG == true) {
        console.log("[UserScipt:caseHighlighter.js] " + logtime + " [DEBUG] " + logmessage);
    }
}

// Main func to loop over SFDC table nd find cases with desired status and highlight the status to make it much easier to view cases requiring attention at a glance
function getCaseStatus() {
    var caseRows = document.getElementsByClassName("x-grid3-row-table");

    if (document.querySelector('[title="Case Number"]') != null) {
        var caseNumFieldCol = document.querySelector('[title="Case Number"]').parentNode.cellIndex; // get the index of the case status
        log("caseNumFieldCol " + caseNumFieldCol);
    }

    if (document.querySelector('[title="Status"]') != null) {
        var statusFieldCol = document.querySelector('[title="Status"]').parentNode.cellIndex; // get the index of the case status
        log("statusFieldCol " + statusFieldCol);
    }

    let totalCases = 0;
    let totalCRP = 0;
    for (var row = 0; row < caseRows.length; row++) {
        var statusField = caseRows[row].rows[0].cells[statusFieldCol];
        var caseID = caseRows[row].rows[0].cells[caseNumFieldCol].innerText;

        if (statusField.innerText === "Customer Response Provided") {
            caseRows[row].rows[0].cells[statusFieldCol].style.background = bgColour;
            caseRows[row].rows[0].cells[statusFieldCol].style.color = textColour;

            totalCRP += 1;
            log("Highlighted case " + caseID);
        }

        totalCases += 1;
    }
    log("Total cases: " + totalCases);
    log("Total Custom Responded cases: " + totalCRP);
}

waitForKeyElements("div.x-grid3-row.x-grid3-row-last", getCaseStatus);
