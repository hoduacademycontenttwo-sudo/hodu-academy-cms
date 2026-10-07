/**
 * Hodu Academy → Google Sheets webhook.
 *
 * Paste this into Extensions → Apps Script of the target spreadsheet, set the script property
 * WEBHOOK_SECRET, and deploy as a web app. Full steps: scripts/google-sheets/README.md.
 *
 * The website POSTs: { "secret": "...", "sheet": "CBT Registrations", "row": { "Name": "...", ... } }
 * Each key in "row" becomes a column. New keys add new columns at the end; existing columns keep their order.
 */

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var expected = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (!expected || body.secret !== expected) return json_({ ok: false, error: 'unauthorised' });

    var sheetName = String(body.sheet || 'Registrations').slice(0, 90);
    var row = body.row || {};
    var keys = Object.keys(row);
    if (!keys.length) return json_({ ok: false, error: 'empty row' });

    // One write at a time, so simultaneous registrations never land on the same row.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.getRange('A:Z').setNumberFormat('@'); // keep phone numbers etc. as typed
      }

      var headers = sheet.getLastColumn() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
      var missing = keys.filter(function (k) { return headers.indexOf(k) === -1; });
      if (missing.length) {
        sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
        headers = headers.concat(missing);
        sheet.setFrozenRows(1);
      }

      var values = headers.map(function (h) {
        var v = row[h];
        return v === null || v === undefined ? '' : String(v);
      });
      sheet.appendRow(values);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Opening the web app URL in a browser shows this, which is a quick way to check the deployment works.
function doGet() {
  return json_({ ok: true, message: 'Hodu Academy sheet webhook is running. Send registrations with POST.' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
