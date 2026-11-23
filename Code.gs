function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var base64 = data.image.split(',')[1];
    var bytes = Utilities.base64Decode(base64);
    var safeName = (data.name || 'Student').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]+/g, '_');
    var fileName = 'IEEE_ASU_' + safeName + '_' + Date.now() + '.png';
    var blob = Utilities.newBlob(bytes, 'image/png', fileName);

    var folderName = 'IEEE ASU Booth Cards';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var viewUrl = 'https://drive.google.com/file/d/' + file.getId() + '/view';

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, url: viewUrl }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
