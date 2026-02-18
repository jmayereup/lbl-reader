/**
 * This function handles HTTP POST requests. 
 * It's triggered when the HTML form is submitted.
 * @param {Object} e - The event parameter for a POST request.
 */
function doPost(e) {
  // Use a try-catch block for robust error handling.
  try {
    // Parse the JSON data sent from the HTML form.
    const data = JSON.parse(e.postData.contents);

    // Select the spreadsheet and the specific sheet to save data to.
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');

    // FIX: Check if the sheet is empty. If getLastRow() is 0, there's no data.
    // In this case, we add the header row first.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Nickname', 'Homeroom', 'Student ID', 'Quiz Name', 'Score', 'Total Questions']);
    }

    // Append a new row with the data from the quiz.
    // The order here must match the header order.
    sheet.appendRow([
      new Date(),
      data.nickname,
      data.homeroom,
      data.studentId,
      data.quizName,
      data.score,
      data.total
    ]);

    // Return a success response to the HTML front-end.
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'success', 
        'message': 'Your score was submitted successfully!' 
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // If an error occurs, log it for debugging purposes.
    Logger.log(error.toString());

    // Return an error response to the HTML front-end.
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'message': error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
