let a = "https://scontent-sjc3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/p640x640/102808656_168325464651977_1506789467788599996_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com\u0026_nc_cat=105\u0026_nc_ohc=qUeqtVln2VoAX-7e4iz\u0026oh=2b2cb6d2aaa5d72968504fe147ed5544\u0026oe=5F07BB42"
// let r = a.replace('\u0026', '&')
let b = 'https://scontent-sjc3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/p640x640/102808656_168325464651977_1506789467788599996_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=105&_nc_ohc=qUeqtVln2VoAX-7e4iz&oh=2b2cb6d2aaa5d72968504fe147ed5544&oe=5F07BB42'
let r = decodeURI(a)
console.log(r)
