function doGet(e) {
  return HtmlService.createTemplateFromFile("index").evaluate()
}
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
function userClick(data) {
  let ss = SpreadsheetApp.openById('SheetID');
  let sheet = ss.getSheets()[0];
  let response = Maps.newGeocoder().reverseGeocode(data.lat, data.lon);
  let geoAddress = response.results[0].formatted_address;
  sheet.appendRow([data.username,data.sub,data.buiding,data.timeset,data.situation,data.sit,Utilities.formatDate(new Date(), "GMT+7", "MM/dd/yyyy HH:mm:ss"), `${data.lat},${data.lon}`, geoAddress])

  
  var strYear543 = parseInt(Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy")) + 543;  
  var strhour=Utilities.formatDate(new Date(), "Asia/Bangkok", "HH");
  var strMinute=Utilities.formatDate(new Date(), "Asia/Bangkok", "mm");
  var strMonth1 = Utilities.formatDate(new Date(), "Asia/Bangkok", "M");
  var strMonthCut1 = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]  
  var strMonthThai = strMonthCut1[strMonth1];
  var strDay = Utilities.formatDate(new Date(), "Asia/Bangkok", "d"); // d ไม่มี 0 นำ dd มี 0 นำ
  var daytime=strDay+' '+strMonthThai+' '+strYear543+ ' เวลา '+strhour+':'+strMinute+' น.';
  
  var text_data1 = '📣 แจ้งพิกัดการเช็คอิน\n';
  text_data1 += '⏰วัน-เวลา\n'+daytime+'\n👨‍💼ชื่อ-นามสกุลผู้อยู่เวร\n'+data.username+'\n👨‍💼ผู้อยู่เวรแทน\n'+data.sub+'\n🏢อาคาร\n'+data.buiding+'\n⌚ช่วงเวลา\n'+data.timeset+'\n🔰สถานการณ์\n'+data.situation+'\nเหตุการณ์🧾️\n'+data.sit+'\n📌พิกัด\n'+data.lat+","+data.lon + '\n🏡ที่อยู่\n'+geoAddress
      
var latitude = data.lat
var longitude = data.lon
var map = Maps.newStaticMap()
.setSize(600,600)  //(Max:1300 X 1300
.setLanguage('TH')
.setMobile(true)
.setMapType(Maps.StaticMap.Type.HYBRID)

map.addMarker(latitude, longitude)
var mapBlob = map.getBlob()
var mapUrl = map.getMapUrl()
sendHttpPostImage(text_data1,mapBlob)
}

function sendHttpPostImage(mapUrl, mapBlob){
var token = "Token";
var formData = {
'message' : '\n'+mapUrl,
'imageFile': mapBlob
}
var options =
{
"method"  : "post",
"payload" : formData,  // message, imageFile, formData, Post
"headers" : {"Authorization" : "Bearer "+ token}
};

UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}
